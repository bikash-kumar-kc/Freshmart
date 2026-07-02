import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { CategoryItem } from "../CategoryItem";
import { CATEGORIES } from "../categories";
import { Suspense } from "react";
import ProductPage from "./ProductPage";
import CategoryProductSkeleton from "@/components/skeleton/CategoryProductSkeleton";

export default async function page({
  params,
}: {
  params: Promise<{ cat: string[] }>;
}) {
  const { cat } = await params;
  const [ca, productId] = cat;
  const activeCategory = CATEGORIES.find((c) => c.slug === ca);
  if (!activeCategory) notFound();

  return (
    <main className="bg-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto  py-6">
        <div className="flex items-center justify-between mb-6 px-2 ">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">
              {activeCategory.emoji} {activeCategory.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 px-10">
              organic products
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
            <nav className="flex flex-col gap-4.5 cursor-pointer">
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
            -mx-4 px-4 mb-4 scrollbar-none w-full cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                className={`
                  shrink-0 flex items-center gap-1.5 px-3 py-2
                  rounded-sm text-sm font-medium border transition-all cursor-pointer
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

          <Suspense fallback={<CategoryProductSkeleton />}>
            <ProductPage
              cat={(activeCategory as { dbName: string }).dbName}
              productId={productId}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
