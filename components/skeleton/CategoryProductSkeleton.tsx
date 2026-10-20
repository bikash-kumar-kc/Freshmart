const shimmerOverlay =
  "absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent";

const Bone = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
    <div className={shimmerOverlay} />
  </div>
);

// Same structure and sizes as the real ProductCard
function GridCardSkeleton() {
  return (
    <div className="w-full bg-white border border-black/10 rounded-md overflow-hidden flex flex-col">
      <Bone className="h-40 sm:h-50 rounded-none" />

      <div className="px-2.5 py-2 sm:px-3.5 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Bone className="h-4 w-3/4 rounded mb-3" />
          <Bone className="h-3 w-1/3 rounded" />
        </div>
        <Bone className="w-9 h-9 rounded-[10px] shrink-0" />
      </div>
    </div>
  );
}

const CategoryPageSkeleton = () => {
  return (
    <div className="bg-amber-50 min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 xl:px-0">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="min-w-0">
            <Bone className="h-7 w-40 sm:h-8 sm:w-52 rounded" />
            <Bone className="mt-2 h-3 w-28 rounded sm:ml-10" />
          </div>

          <Bone className="h-10 w-24 shrink-0 rounded-sm" />
        </div>

        {/* Stacked on mobile, side by side from md */}
        <div className="flex flex-col items-stretch md:flex-row md:items-start md:gap-6">
          {/* Desktop sidebar */}
          <aside
            className="hidden md:flex flex-col w-75 shrink-0
            bg-white rounded-sm border border-gray-100 p-3 sticky top-4"
          >
            <Bone className="h-3 w-20 rounded mb-4" />

            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm"
                >
                  <Bone className="h-8 w-8 rounded-full shrink-0" />
                  <Bone className="flex-1 h-4 rounded" />
                </div>
              ))}
            </div>
          </aside>

          {/* Mobile category chips */}
          <div className="md:hidden flex gap-2 overflow-hidden pb-2 -mx-4 px-4 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bone key={i} className="shrink-0 h-10 w-28 rounded-sm" />
            ))}
          </div>

          {/* Products: same grid as ProductPage */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <GridCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageSkeleton;