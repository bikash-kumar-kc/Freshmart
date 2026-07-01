import React from "react";

const CategoryProductSkeleton = () => {
  return (
    <div className="flex gap-4 flex-wrap">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="w-[200px] overflow-hidden rounded-sm bg-white shadow-sm"
        >
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
            <div className="mt-1 h-4 w-1/2 rounded bg-gray-200" />

            <div className="mt-3 flex items-baseline gap-2">
              <div className="h-4 w-12 rounded bg-gray-200" />
              <div className="h-3 w-10 rounded bg-gray-200" />
            </div>
          </div>

          {/* Add to cart button */}
          {/* <div className="px-4 pb-4">
            <div className="h-9 w-full rounded-xl bg-gray-200" />
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default CategoryProductSkeleton;
