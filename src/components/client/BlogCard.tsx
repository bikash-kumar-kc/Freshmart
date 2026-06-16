// components/blog/BlogCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

// ── types ──────────────────────────────────────
export type BlogCategory =
  | "Nutrition"
  | "Farming"
  | "Family"
  | "Recipes"
  | "Lifestyle"
  | "Health";

export interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  category: BlogCategory;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string; // ISO string
  readTimeMinutes: number;
}

// ── category config ────────────────────────────
const CATEGORY_STYLES: Record<
  BlogCategory,
  { bg: string; text: string }
> = {
  Nutrition: { bg: "bg-green-100",  text: "text-green-800"  },
  Farming:   { bg: "bg-amber-100",  text: "text-amber-800"  },
  Family:    { bg: "bg-teal-100",   text: "text-teal-800"   },
  Recipes:   { bg: "bg-orange-100", text: "text-orange-800" },
  Lifestyle: { bg: "bg-lime-100",   text: "text-lime-800"   },
  Health:    { bg: "bg-emerald-100",text: "text-emerald-800"},
};

// ── helpers ────────────────────────────────────
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

// ── component ──────────────────────────────────
export default function BlogCard({
  slug,
  title,
  excerpt,
  thumbnail,
  category,
  author,
  publishedAt,
  readTimeMinutes,
}: BlogCardProps) {
  const catStyle = CATEGORY_STYLES[category];

  return (
    <Link
      href={`/blogs/${slug}`}
      className="group block bg-white dark:bg-[#1c1c1c] border border-gray-100
        dark:border-[#262626] rounded-2xl overflow-hidden
        transition-transform duration-200 hover:-translate-y-1
        hover:border-green-300 dark:hover:border-green-700"
    >
      {/* ── image ── */}
      <div className="relative h-[180px] w-full overflow-hidden bg-green-50">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300
            group-hover:scale-105"
        />

        {/* category badge */}
        <span
          className={`absolute top-3 left-3 text-[8px] font-medium
            uppercase tracking-widest px-2.5 py-1 rounded-lg
            ${catStyle.bg} ${catStyle.text}`}
        >
          {category}
        </span>

        {/* torn paper SVG edge */}
        <div className="absolute bottom-0 left-0 w-full leading-[0]">
          <svg
            viewBox="0 0 400 24"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block fill-white dark:fill-[#1c1c1c]"
          >
            <path d="M0,0 L0,12 Q20,24 40,14 Q60,4 80,16 Q100,24 120,10 Q140,0 160,18 Q180,24 200,8 Q220,0 240,20 Q260,24 280,12 Q300,2 320,18 Q340,24 360,10 Q380,0 400,16 L400,0 Z" />
          </svg>
        </div>
      </div>

      {/* ── body ── */}
      <div className="px-5 pt-3 pb-5">

        {/* author + date */}
        <div className="flex items-center gap-2 mb-3">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center
              justify-center text-[10px] font-medium text-green-800 flex-shrink-0">
              {getInitials(author.name)}
            </div>
          )}
          <span className="text-xs text-gray-500 dark:text-[#a3a3a3]">
            {author.name}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-[#404040]" />
          <span className="text-xs text-gray-400 dark:text-[#737373]">
            {formatDate(publishedAt)}
          </span>
        </div>

        {/* title */}
        <h3 className="font-serif text-[17px] leading-snug font-medium
          text-gray-900 dark:text-[#f5f5f5] mb-2 line-clamp-2
          group-hover:text-green-700 dark:group-hover:text-green-400
          transition-colors duration-200">
          {title}
        </h3>

        {/* excerpt */}
        <p className="text-sm text-gray-500 dark:text-[#a3a3a3] leading-relaxed
          line-clamp-3 mb-4">
          {excerpt}
        </p>

        {/* footer */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px]
            text-gray-400 dark:text-[#737373]">
            <Clock size={12} />
            {readTimeMinutes} min read
          </span>
          <span className="text-xs font-medium text-green-700
            dark:text-green-400 flex items-center gap-1
            group-hover:gap-2 transition-all duration-200">
            Read article
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>

      </div>
    </Link>
  );
}