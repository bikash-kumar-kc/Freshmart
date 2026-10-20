import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Suspense } from "react";

import { CategoryItem } from "../CategoryItem";
import { CATEGORIES } from "../categories";
import ProductPage from "./ProductPage";
import CategoryPageSkeleton from "@/components/skeleton/CategoryProductSkeleton";

interface PageProps {
  params: Promise<{ cat: string[] }>;
}

export default async function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <PageContent params={params} />
    </Suspense>
  );
}

async function PageContent({ params }: PageProps) {
  const { cat } = await params;

  const [ca, productId] = cat;

  const activeCategory = CATEGORIES.find((c) => c.slug === ca);

  if (!activeCategory) {
    notFound();
  }

  return (
    <main className="bg-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 xl:px-0">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="font-serif text-xl sm:text-2xl font-semibold text-gray-900 truncate">
              {activeCategory.emoji} {activeCategory.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 sm:px-10">
              organic products
            </p>
          </div>

          <Link
            href="/"
            className="shrink-0 flex items-center gap-1.5 text-sm font-medium
            text-green-700 hover:text-white hover:bg-green-400
            px-3 py-2 transition-colors rounded-sm"
          >
            <Home size={14} />
            Home
          </Link>
        </div>

        {/* Stacked on mobile, side by side from md */}
        <div className="flex flex-col items-stretch md:flex-row md:items-start md:gap-6">
          {/* Desktop sidebar */}
          <aside
            className="hidden md:flex flex-col w-75 shrink-0
            bg-white rounded-sm border border-gray-100
            p-3 sticky top-4"
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

          {/* Mobile category chips */}
          <div
            className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4
              snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`shrink-0 snap-start flex items-center gap-1.5 px-3 py-2
                  rounded-sm text-sm font-medium border transition-all
                  ${
                    cat.slug === activeCategory.slug
                      ? "bg-green-700 text-white border-green-700"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </Link>
            ))}
          </div>

          <ProductPage cat={activeCategory.dbName} productId={productId} />
        </div>
      </div>
    </main>
  );
}