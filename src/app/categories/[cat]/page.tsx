// app/category/[category]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";

interface ICategoryProducts {
  variants: {
    id: string;
    productId: string;
    weightValue: number;
    weightUnit: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
  }[];
  id: string;
  name: string;
  slug: string;
  category: string;
  keywords: string;
  description: string;
  thumbnail: string;
  images: string[];
  icon: string | null;
  isMostPopular: boolean;
  isFeatured: boolean;
  isOffered: boolean;
  discount: number | null;
  offerStartDate: string | null;
  offerEndDate: string | null;
  originCountry: string;
  farmName: string;
  freshnessTags: string[];
  featuredBanner: string[];
  status: string;
  expireAt: string;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
}

// ─────────────────────────────────────────────
// All 5 categories — slug used in the URL,
// label shown in the sidebar
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    slug: "vegetables",
    label: "Vegetables",
    dbName: "Vegetables",
    emoji: "🥦",
  },
  { slug: "fruits", label: "Fruits", dbName: "Fruits", emoji: "🍎" },
  {
    slug: "dairy-eggs",
    label: "Dairy & Eggs",
    dbName: "Dairy & Eggs",
    emoji: "🥛",
  },
  {
    slug: "grains-cereals",
    label: "Grains & Cereals",
    dbName: "Grains & Cereals",
    emoji: "🌾",
  },
  {
    slug: "pulses-lentils",
    label: "Pulses & Lentils",
    dbName: "Pulses & Lentils",
    emoji: "🫘",
  },
] as const;

// ─────────────────────────────────────────────
// Data fetch — server side, per category
// ─────────────────────────────────────────────
async function getProductsByCategory(dbName: string) {
  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.category, dbName));

  if (productRows.length === 0) return [];

  const productIds = productRows.map((p) => p.id);
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds));

  const variantsByProduct = new Map<string, typeof variantRows>();
  for (const v of variantRows) {
    const list = variantsByProduct.get(v.productId) ?? [];
    list.push(v);
    variantsByProduct.set(v.productId, list);
  }

  return productRows.map((p) => ({
    ...p,
    variants: variantsByProduct.get(p.id) ?? [],
  }));
}

function cheapestVariant(variants: { price: number }[]) {
  if (!variants.length) return null;
  return variants.reduce(
    (min, v) => (v.price < min.price ? v : min),
    variants[0],
  );
}

// ─────────────────────────────────────────────
// Category sidebar item
// ─────────────────────────────────────────────
function CategorySidebarItem({
  cat,
  isActive,
}: {
  cat: (typeof CATEGORIES)[number];
  isActive: boolean;
}) {
  return (
    <Link
      href={`/categories/${cat.slug}`}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
        transition-all duration-150 group
        ${isActive ? "bg-green-700 text-white" : "hover:bg-green-50 text-gray-700"}
      `}
    >
      <span className="text-base leading-none shrink-0">{cat.emoji}</span>
      <span className="text-sm font-medium flex-1 leading-none">
        {cat.label}
      </span>
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
      )}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Product card
// ─────────────────────────────────────────────
function ProductCard({ product }: { product: ICategoryProducts }) {
  const variant = cheapestVariant(product.variants);
  const isOutOfStock =
    product.status === "out_of_stock" || !variant || variant.price === 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100
        overflow-hidden hover:border-green-200 hover:shadow-sm
        transition-all duration-200 flex flex-col"
    >
      <div className="relative aspect-4/3 bg-green-50 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300
            group-hover:scale-105 ${isOutOfStock ? "opacity-60" : ""}`}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffered && (
            <span
              className="bg-orange-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none"
            >
              -{product.discount}%
            </span>
          )}
          {product.isMostPopular && (
            <span
              className="bg-amber-400 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none"
            >
              Popular
            </span>
          )}
          {isOutOfStock && (
            <span
              className="bg-gray-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none"
            >
              Out of stock
            </span>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p
          className="text-sm font-semibold text-gray-900 line-clamp-1
          group-hover:text-green-700 transition-colors mb-1"
        >
          {product.name}
        </p>
        {variant && (
          <p className="text-[11px] text-gray-400 mb-2">
            {/* From {product.variant.weightValue}{product?.variants[0].weightUnit} */}
          </p>
        )}
        {variant && (
          <div className="mt-auto">
            <span className="text-base font-bold text-gray-900">
              Rs. {variant.price}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default async function page({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  console.log("called here !")
  const { cat } = await params;
  console.log("cat",cat)
  const activeCategory = CATEGORIES.find((c) => c.slug === cat);

  if (!activeCategory) notFound();

  const productList = await getProductsByCategory(activeCategory.dbName);

  return (
    <main className="bg-[#F5F9F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">
              {activeCategory.emoji} {activeCategory.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {productList.length} organic products
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium
              text-green-700 hover:text-green-900 transition-colors"
          >
            <Home size={14} />
            Home
          </Link>
        </div>

        <div className="flex gap-6 items-start">
          {/* LEFT — category sidebar */}
          <aside
            className="hidden md:flex flex-col w-52 shrink-0
            bg-white rounded-2xl border border-gray-100 p-3 sticky top-4"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest
              text-gray-400 px-3 mb-2"
            >
              Categories
            </p>
            <nav className="flex flex-col gap-0.5">
              {CATEGORIES.map((cat) => (
                <CategorySidebarItem
                  key={cat.slug}
                  cat={cat}
                  isActive={cat.slug === activeCategory.slug}
                />
              ))}
            </nav>
          </aside>

          {/* mobile — horizontal scroll categories */}
          <div
            className="md:hidden flex gap-2 overflow-x-auto pb-2
            -mx-4 px-4 mb-4 w-full"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`
                  shrink-0 flex items-center gap-1.5 px-3 py-2
                  rounded-xl text-sm font-medium border transition-all
                  ${
                    cat.slug === activeCategory.slug
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-200"
                  }
                `}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>

          {/* RIGHT — product grid */}
          <div className="flex-1 min-w-0">
            {productList.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center
                py-24 text-center"
              >
                <span className="text-4xl mb-3">🌱</span>
                <p className="text-sm font-medium text-gray-500">
                  No products in this category yet
                </p>
              </div>
            ) : (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4
                gap-3 sm:gap-4"
              >
                {productList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// Static params — pre-render all 5 category pages at build time
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}
