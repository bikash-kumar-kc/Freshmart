type CategorySkeletonProps = {
  count?: number;
};

function ProductCardSkeleton() {
  return (
    // same box as HoverRevealCard: w-full on mobile, w-60 (240px) from sm up
    <div className="flex w-full flex-col gap-1 sm:w-60">
      {/* Image: aspect-square, rounded-sm */}
      <div className="skeleton aspect-square w-full rounded-sm" />

      {/* Name: text-lg = 28px line height, centered */}
      <div className="flex h-7 items-center justify-center">
        <div className="skeleton h-5 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

function CategorySkeleton({ count = 5 }: CategorySkeletonProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {/* Title: same box as the real h2 (text-2xl = 32px line height) */}
      <div className="px-4 lg:px-0">
        <div className="skeleton h-8 w-48 rounded-md" />
      </div>

      {/* Row: same classes as the real row, overflow-hidden instead of scroll on mobile */}
      <div
        className="flex min-w-0 w-full flex-row flex-nowrap items-center gap-3
          overflow-hidden px-4 pb-2
          sm:flex-wrap sm:justify-between sm:gap-4 sm:space-y-2
          sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`w-[55%] shrink-0 sm:w-auto sm:shrink ${
              index > 2 ? "hidden sm:block" : ""
            }`}
          >
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductsSuspenseFallback() {
  return (
    <div className="m-auto w-full min-w-0 max-w-7xl">
      <div className="mt-8 flex w-full min-w-0 flex-col gap-5">
        <CategorySkeleton count={5} />
        <CategorySkeleton count={5} />
      </div>
    </div>
  );
}