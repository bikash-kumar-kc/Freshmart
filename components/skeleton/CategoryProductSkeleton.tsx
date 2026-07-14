import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductCardsSkeleton from "./ProductCardsSkeleton";
// import CategoryProductSkeleton from "./CategoryProductSkeleton";

const CategoryPageSkeleton = () => {
  return (
    <main className="bg-amber-50 max-w-7xl m-auto py-4">
      <div className=" mx-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <div className="h-8 w-52 rounded bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>

            <div className="mt-2 h-3 w-28 rounded bg-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>

          <div className="h-10 w-24 rounded-sm bg-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop Sidebar */}
          <aside
            className="hidden md:flex flex-col w-75 shrink-0
            bg-white rounded-sm border border-gray-100
            p-3 sticky top-4"
          >
            <div className="h-3 w-20 rounded bg-gray-200 mb-4" />

            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>

                  <div className="flex-1 h-4 rounded bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile Categories */}
          <div
            className="md:hidden flex gap-2 overflow-x-auto
            pb-2 -mx-4 px-4 mb-4 w-full"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 h-10 w-28 rounded-sm bg-gray-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
            ))}
          </div>

          {/* Products */}
          <div className="flex-1 min-h-screen">
            {/* <CategoryProductSkeleton /> */}
            <ProductCardsSkeleton/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPageSkeleton;
