// app/blog/[slug]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Clock,
  Eye,
  Calendar,
  Leaf,
  ShoppingBag,
  ArrowRight,
  Link2,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  price: string;
  unit: string;
  thumbnail: string;
  slug: string;
}

interface RelatedPost {
  slug: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  readTimeMinutes: number;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  views: number;
  tags: string[];
  content: React.ReactNode;
  relatedProducts: Product[];
  relatedPosts: RelatedPost[];
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(/[\s_]/)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

// ── reading progress bar ──────────────────────
// function ReadingProgressBar({ progress }: { progress: number }) {
//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-green-100
//       dark:bg-green-950">
//       <div
//         className="h-full bg-green-600 transition-[width] duration-100 ease-linear"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   );
// }

// ── sidebar progress card ─────────────────────
function SidebarProgress({ progress }: { progress: number }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-100
      dark:border-[#262626] rounded-2xl p-4 mb-4">
      <p className="text-[10px] font-medium uppercase tracking-widest
        text-gray-400 dark:text-[#737373] mb-2">
        Reading progress
      </p>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500 dark:text-[#a3a3a3]">
          {Math.round(progress)}% through
        </span>
        {progress >= 95 && (
          <span className="text-[10px] font-medium text-green-700
            dark:text-green-400 flex items-center gap-1">
            <Check size={10} /> Finished
          </span>
        )}
      </div>
      <div className="h-1.5 bg-green-100 dark:bg-green-950 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-600 rounded-full
            transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── save button ───────────────────────────────
function SaveButton({ postSlug }: { postSlug: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`blog-saved-${postSlug}`);
    if (saved) setSaved(true);
  }, [postSlug]);

  const toggle = () => {
    const next = !saved;
    setSaved(next);
    if (next) {
      localStorage.setItem(`blog-saved-${postSlug}`, "1");
    } else {
      localStorage.removeItem(`blog-saved-${postSlug}`);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        flex items-center gap-2 text-xs font-medium px-3 py-1.5
        rounded-xl border transition-all duration-200
        ${saved
          ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-300"
          : "bg-white dark:bg-[#1c1c1c] border-gray-200 dark:border-[#262626] text-gray-600 dark:text-[#a3a3a3] hover:bg-gray-50 dark:hover:bg-[#262626]"
        }
      `}
    >
      <Bookmark
        size={13}
        className={saved ? "fill-green-700 text-green-700 dark:fill-green-400 dark:text-green-400" : ""}
      />
      {saved ? "Saved" : "Save article"}
    </button>
  );
}

// ── share button ──────────────────────────────
function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyLink}
      className="flex items-center justify-center w-8 h-8 rounded-xl
        border border-gray-200 dark:border-[#262626] bg-white
        dark:bg-[#1c1c1c] text-gray-500 dark:text-[#a3a3a3]
        hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors"
      aria-label="Copy link"
    >
      {copied ? <Check size={14} className="text-green-600" /> : <Link2 size={14} />}
    </button>
  );
}

// ── product card (sidebar) ────────────────────
function SidebarProduct({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-100
      dark:border-[#262626] last:border-0 last:pb-0">
      {/* <div className="w-9 h-9 rounded-xl overflow-hidden bg-green-50
        flex-shrink-0">
        <Image
          src={product.thumbnail}
          alt={product.name}
          width={36}
          height={36}
          className="object-cover w-full h-full"
        />
      </div> */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-900 dark:text-[#f5f5f5]
          truncate">
          {product.name}
        </p>
        <p className="text-[11px] text-green-700 dark:text-green-400 font-medium">
          ${product.price} / {product.unit}
        </p>
      </div>
      <button
        onClick={handleAdd}
        className={`
          shrink-0 text-[11px] px-2 py-1 rounded-lg border transition-all
          ${added
            ? "bg-green-50 border-green-300 text-green-800 dark:bg-green-950 dark:border-green-700 dark:text-green-300"
            : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
          }
        `}
      >
        {added ? <Check size={11} /> : "+ Add"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────
export  function BlogDetailPage({ post }: { post: BlogPost }) {
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);

  // ── reading progress logic ─────────────────
  useEffect(() => {
    const handleScroll = () => {
      const article = articleRef.current;
      if (!article) return;

      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = window.scrollY;

      // progress starts when article top hits viewport top
      // ends when article bottom hits viewport bottom
      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;

      if (scrolled < start) {
        setReadProgress(0);
      } else if (scrolled >= end) {
        setReadProgress(100);
      } else {
        const progress = ((scrolled - start) / (end - start)) * 100;
        setReadProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── top progress bar ── */}
      {/* <ReadingProgressBar progress={readProgress} /> */}

      <main className=" mt-10 bg-gray-50 dark:bg-[#111111] min-h-screen pb-16">

        {/* ── hero ── */}
        <div className="relative group h-70 sm:h-[360px] lg:h-[520px] 
          bg-[#0F1A0E] overflow-hidden rounded-2xl">
        <Image
    src={post.thumbnail}
    alt={post.title}
    fill
    priority
    sizes="100vw"
    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300 "
  />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A0E]
            via-[#0F1A0E]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8
            lg:px-16 pb-6 sm:pb-8 cursor-pointer">
            <span className="inline-flex items-center gap-1.5 bg-green-100
              text-green-800 text-[11px] font-medium px-2.5 py-1 rounded-lg
              uppercase tracking-wide mb-3 animate-fade-up  " style={{ animationDelay: "0ms" }}>
              <Leaf size={11} />
              {post.category}
            </span>
            <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl
              font-medium text-white leading-snug max-w-2xl animate-fade-up " style={{ animationDelay: "0ms" }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* ── meta bar ── */}
        <div className="bg-green-50 dark:bg-[#1c1c1c] border-b border-gray-100
          dark:border-[#262626]  px-6  py-3">
          <div className="  flex flex-wrap items-center
            gap-3 sm:gap-4">
            {/* author */}
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-100
                  flex items-center justify-center text-[11px] font-medium
                  text-green-800 shrink-0">
                  {getInitials(post.author.name)}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-gray-900
                  dark:text-[#f5f5f5] leading-none">
                  {post.author.name}
                </p>
                <p className="text-[12px] text-gray-700 tracking-wider dark:text-[#737373]
                  mt-0.5">
                  {post.author.role}
                </p>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-200 dark:bg-[#262626]
              hidden sm:block" />

            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs
                text-gray-500 dark:text-[#a3a3a3]">
                <Calendar size={12} />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5 text-xs
                text-gray-500 dark:text-[#a3a3a3]">
                <Clock size={12} />
                {post.readTimeMinutes} min read
              </span>
              <span className="flex items-center gap-1.5 text-xs
                text-gray-500 dark:text-[#a3a3a3]">
                <Eye size={12} />
                {formatViews(post.views)} views
              </span>
            </div>

            <div className="ml-auto">
              <SaveButton postSlug={post.slug} />
            </div>
          </div>
        </div>

        {/* ── body layout ── */}
        <div className=" px-4 sm:px-8 lg:px-16 pt-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── article prose ── */}
            <article
              ref={articleRef}
              className="flex-1 min-w-0"
            >
              {/* intro highlight */}
              <div className="bg-green-50 dark:bg-green-950/40 border-l-4
                border-green-500 rounded-r-2xl px-5 py-4 mb-8">
                <p className="text-sm text-green-900 dark:text-green-200
                  leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* article content */}
              <div className="
                [&>h2]:font-serif [&>h2]:text-lg [&>h2]:font-medium
  [&>h2]:text-gray-900 dark:[&>h2]:text-[#f5f5f5]
  [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:pb-2
  [&>h2]:border-b [&>h2]:border-gray-100 dark:[&>h2]:border-[#262626]

  [&>p]:text-sm [&>p]:text-gray-600 dark:[&>p]:text-[#a3a3a3]
  [&>p]:leading-relaxed [&>p]:mb-4

  [&>ul]:mb-4 [&>ul]:ml-5 [&>ul]:space-y-1.5
  [&>ul>li]:text-md [&>ul>li]:text-gray-600
  dark:[&>ul>li]:text-[#a3a3a3] [&>ul>li]:leading-relaxed
  [&>ul>li]:list-disc [&>ul>li]:marker:text-green-600

  [&>blockquote]:border-l-4 [&>blockquote]:border-green-400
  [&>blockquote]:bg-green-50 dark:[&>blockquote]:bg-green-950/30
  [&>blockquote]:rounded-r-xl [&>blockquote]:px-4 [&>blockquote]:py-3
  [&>blockquote]:my-4
  [&>blockquote>p]:text-sm [&>blockquote>p]:text-green-900
  dark:[&>blockquote>p]:text-green-200 [&>blockquote>p]:mb-0

  [&>img]:rounded-2xl [&>img]:w-full [&>img]:my-4

  [&>strong]:text-gray-800 dark:[&>strong]:text-[#d4d4d4]
  [&>a]:text-green-700 dark:[&>a]:text-green-400 [&>a]:no-underline
  hover:[&>a]:underline
              ">
                {post.content}
              </div>

              {/* ── tags ── */}
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t
                border-gray-100 dark:border-[#262626] ">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white
                      dark:bg-[#1c1c1c] border border-gray-200
                      dark:border-[#262626] text-gray-500
                      dark:text-[#a3a3a3] hover:border-[green] cursor-auto "
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* ── share ── */}
              <div className="flex items-center gap-3 mt-10">
                <span className="text-xs text-gray-700 dark:text-[#737373]">
                  Share this article
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8
                    rounded-xl border border-gray-200 dark:border-[#262626]
                    bg-white dark:bg-[#1c1c1c] text-gray-500
                    dark:text-[#a3a3a3] hover:bg-gray-50
                    dark:hover:bg-[#262626] transition-colors hover:border-green-400"
                  aria-label="Share on Twitter"
                >
                  <Calendar size={14} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8
                    rounded-xl border border-gray-200 dark:border-[#262626]
                    bg-white dark:bg-[#1c1c1c] text-gray-500
                    dark:text-[#a3a3a3] hover:bg-gray-50
                    dark:hover:bg-[#262626] transition-colors hover:border-green-400"
                  aria-label="Share on Facebook"
                >
                  <Calendar size={14} />
                </a>
                <ShareButton  />
              </div>

              {/* ── mobile: related products ── */}
              <div className="lg:hidden mt-8">
                <MobileProductSection products={post.relatedProducts} />
              </div>
            </article>

            {/* ── sidebar — desktop only ── */}
            <aside className="hidden lg:block w-[350px] flex-shrink-0">
              <div className="sticky top-6 space-y-4">

                <SidebarProgress progress={readProgress} />

                {/* shop products */}
                <div className="bg-white dark:bg-[#1c1c1c] border
                  border-gray-100 dark:border-[#262626] rounded-2xl p-4">
                  <p className="text-[10px] font-medium uppercase
                    tracking-widest text-gray-700 dark:text-[#737373]
                    flex items-center gap-1.5 mb-3">
                    <ShoppingBag size={11} />
                    Shop mentioned
                  </p>
                  <div>
                    {post.relatedProducts.map((p) => (
                      <SidebarProduct key={p.id} product={p} />
                    ))}
                  </div>
                  <Link
                    href={`/products?category=${post.category.toLowerCase()}`}
                    className="mt-3 w-full flex items-center justify-center
                      gap-2 text-xs font-medium py-2.5 rounded-xl
                      bg-green-700 hover:bg-green-800 text-green-50
                      transition-colors"
                  >
                    View all {post.category.toLowerCase()}
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {/* related posts */}
                <div className="bg-white dark:bg-[#1c1c1c] border
                  border-gray-100 dark:border-[#262626] rounded-2xl p-4">
                  <p className="text-[10px] font-medium uppercase
                    tracking-widest text-gray-700 dark:text-[#737373] mb-3">
                    Related articles
                  </p>
                  <div className="space-y-3">
                    {post.relatedPosts.map((rp) => (
                      <Link
                        key={rp.slug}
                        href={`/blog/${rp.slug}`}
                        className="flex gap-2.5 group"
                      >
                        {/* <div className="w-11 h-9 rounded-lg overflow-hidden
                          bg-green-50 shrink-0">
                          <Image
                            src={rp.thumbnail}
                            alt={rp.title}
                            width={44}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        </div> */}
                        <div>
                          <p className="text-xs font-medium text-gray-800
                            dark:text-[#d4d4d4] leading-snug line-clamp-2
                            group-hover:text-green-700
                            dark:group-hover:text-green-400
                            transition-colors">
                            {rp.title}
                          </p>
                          <p className="text-[10px] text-gray-400
                            dark:text-[#737373] mt-0.5">
                            {formatDate(rp.publishedAt)} · {rp.readTimeMinutes}m
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
}

// ── mobile product section ────────────────────
function MobileProductSection({ products }: { products: Product[] }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] border border-gray-100
      dark:border-[#262626] rounded-2xl p-4">
      <p className="text-[10px] font-medium uppercase tracking-widest
        text-gray-400 dark:text-[#737373] flex items-center gap-1.5 mb-3">
        <ShoppingBag size={11} />
        Shop mentioned products
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="flex sm:flex-col items-center sm:items-start gap-3
              p-3 rounded-xl border border-gray-100 dark:border-[#262626]
              hover:border-green-300 dark:hover:border-green-700
              transition-colors"
          >
            <div className="w-12 h-12 sm:w-full sm:h-24 rounded-xl
              overflow-hidden bg-green-50 shrink-0">
              <Image
                src={p.thumbnail}
                alt={p.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-900
                dark:text-[#f5f5f5]">
                {p.name}
              </p>
              <p className="text-[11px] text-green-700 dark:text-green-400
                font-medium">
                ${p.price} / {p.unit}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/products?category=vegetables"
        className="mt-3 flex items-center justify-center gap-2 text-xs
          font-medium py-2.5 rounded-xl bg-green-700 hover:bg-green-800
          text-green-50 transition-colors w-full"
      >
        View all products <ArrowRight size={12} />
      </Link>
    </div>
  );
}


// ─────────────────────────────────────────────
// Sample page — app/blog/organic-vegetables/page.tsx
// ─────────────────────────────────────────────
export default function SampleBlogPage() {
  const SAMPLE_POST: BlogPost = {
    slug: "organic-vegetables-more-nutrients",
    title: "Why organic vegetables have more nutrients than conventional ones",
    excerpt:
      "Studies consistently show that organically grown produce contains significantly higher concentrations of polyphenols, antioxidants, and essential minerals. We break down what the science actually says.",
    thumbnail: "https://loremflickr.com/1200/420/vegetables,organic,farm",
    category: "Nutrition",
    author: {
      name: "Sita Rai",
      role: "Organic nutritionist",
    },
    publishedAt: "2026-06-10T08:00:00Z",
    readTimeMinutes: 5,
    views: 1240,
    tags: ["organic farming", "antioxidants", "nutrition science", "vegetables", "soil health"],
    relatedProducts: [
      {
        id: "prod_vegetables_03",
        name: "Organic spinach",
        price: "1.80",
        unit: "500g",
        thumbnail: "https://loremflickr.com/72/72/spinach,vegetable",
        slug: "spinach-vegetables",
      },
      {
        id: "prod_vegetables_04",
        name: "Organic carrots",
        price: "1.20",
        unit: "500g",
        thumbnail: "https://loremflickr.com/72/72/carrot,vegetable",
        slug: "carrot-vegetables",
      },
      {
        id: "prod_vegetables_06",
        name: "Organic broccoli",
        price: "2.10",
        unit: "500g",
        thumbnail: "https://loremflickr.com/72/72/broccoli,vegetable",
        slug: "broccoli-vegetables",
      },
    ],
    relatedPosts: [
      {
        slug: "soil-health-organic-farming",
        title: "The soil beneath your food: how organic farming rebuilds the earth",
        thumbnail: "https://loremflickr.com/88/72/soil,farming",
        publishedAt: "2026-06-05T08:00:00Z",
        readTimeMinutes: 7,
      },
      {
        slug: "pesticide-free-food-children",
        title: "Pesticide-free food for your children",
        thumbnail: "https://loremflickr.com/88/72/fruit,fresh",
        publishedAt: "2026-05-28T08:00:00Z",
        readTimeMinutes: 6,
      },
      {
        slug: "ten-most-nutrient-dense-organic-foods",
        title: "The 10 most nutrient-dense organic foods",
        thumbnail: "https://loremflickr.com/88/72/seeds,nuts",
        publishedAt: "2026-05-15T08:00:00Z",
        readTimeMinutes: 4,
      },
    ],
    content: (
      <>
        <h2>What does the research say?</h2>
        <p>
          A landmark meta-analysis of 343 studies published in the British
          Journal of Nutrition found that organic crops had substantially higher
          concentrations of antioxidants compared to their conventional
          counterparts. The difference was most pronounced in leafy greens and
          root vegetables.
        </p>
        <blockquote>
          Organic produce had up to 69% more polyphenols on average — compounds
          directly linked to reduced risk of cardiovascular disease,
          neurodegenerative conditions, and certain cancers.
        </blockquote>

        <h2>Why does growing method matter?</h2>
        <p>
          Plants produce antioxidants partly as a natural defense mechanism —
          against pests, UV radiation, and environmental stress. When synthetic
          pesticides do that job for them, plants produce fewer of these
          compounds themselves. Organic farming removes that chemical crutch,
          forcing the plant to build its own defenses.
        </p>
        <ul>
          <li>No synthetic pesticides — plants self-defend with phytochemicals</li>
          <li>Healthier soil microbiome improves mineral uptake</li>
          <li>Slower growth cycles allow deeper nutrient accumulation</li>
          <li>No artificial nitrogen — prevents hollow, watery vegetables</li>
        </ul>

        <Image
          src="https://loremflickr.com/700/300/soil,roots,organic"
          alt="Healthy organic soil with plant roots"
          width={700}
          height={300}
          className="rounded-2xl w-full"
        />
        <p className="text-xs text-center text-gray-400 -mt-2">
          Organic soil contains far richer microbial diversity than chemically
          treated farmland.
        </p>

        <h2>Which vegetables show the biggest difference?</h2>
        <p>
          Not all vegetables respond equally to organic growing conditions. The
          impact is highest in produce that is eaten skin-on, grows close to the
          soil, or has a long growing season — giving it more time to accumulate
          nutrients from the soil microbiome.
        </p>
        <p>
          Spinach, kale, carrots, tomatoes, and beetroot consistently top the
          charts in peer-reviewed comparisons. Starchy vegetables like potatoes
          show a smaller but still measurable difference, primarily in mineral
          content rather than antioxidants.
        </p>

        <h2>How to make the most of your organic vegetables</h2>
        <p>
          Buying organic is only half the equation. How you store and prepare
          vegetables significantly affects the nutrients that reach your plate.
          Keep leafy greens refrigerated and unwashed until use. Steam rather
          than boil where possible — water-soluble vitamins leach into cooking
          water and are lost when you drain it.
        </p>
        <ul>
          <li>Buy loose over bagged — less bruising, better air circulation</li>
          <li>Store root vegetables in a cool dark place, not the fridge</li>
          <li>Eat the skin where possible — highest nutrient concentration</li>
          <li>Steam or roast instead of boiling to preserve water-soluble vitamins</li>
        </ul>
      </>
    ),
  };

  return <BlogDetailPage post={SAMPLE_POST} />;
}