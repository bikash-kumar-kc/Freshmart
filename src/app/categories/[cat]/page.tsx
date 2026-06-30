import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { CategoryItem } from "../CategoryItem";
import { CATEGORIES } from "../categories";
import { ProductCard } from "../ProductCard";


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



export default async function page({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  const activeCategory = CATEGORIES.find((c) => c.slug === cat);
  if (!activeCategory) notFound();
  const productList = await getProductsByCategory(activeCategory.dbName);

  return (
    <main className="bg-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto  py-6">
        <div className="flex items-center justify-between mb-6 px-2 ">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">
              {activeCategory.emoji} {activeCategory.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 px-10">
              {productList.length} organic products
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium
              text-green-700 hover:text-white hover:bg-green-400 px-3 py-2  transition-colors rounded-sm"
          >
            <Home size={14} />
            Home
          </Link>
        </div>

        <div className="flex gap-6 items-start">
          <aside
            className="hidden md:flex flex-col w-75 shrink-0
            bg-white rounded-sm border border-gray-100 p-3 sticky top-4"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-widest
              text-gray-400 px-3 mb-2"
            >
              Categories
            </p>
            <nav className="flex flex-col gap-4.5">
              {CATEGORIES.map((cat) => (
                <CategoryItem
                  key={cat.slug}
                  cat={cat}
                  isActive={cat.slug === activeCategory.slug}
                />
              ))}
            </nav>
          </aside>

          <div
            className="md:hidden flex gap-2 overflow-x-auto pb-2
            -mx-4 px-4 mb-4 scrollbar-none w-full"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
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
              </button>
            ))}
          </div>

          
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


