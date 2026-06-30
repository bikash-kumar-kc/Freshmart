type CategorySkeletonProps = {
  count?: number;
};

function CategorySkeleton({
  count = 10,
}: CategorySkeletonProps) {
  return (
    <section className="w-full mt-10 animate-[shimmer_4s_infinite]">
      {/* Category Title */}
      <div className="h-8 w-56 rounded-md bg-gray-200 animate-pulse mb-6" />

      {/* Products */}
      <div className="flex flex-wrap gap-15 mt-4 w-full justify-center">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="w-[220px] overflow-hidden rounded-2xl animate-[shimmer_4s_infinite]">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="h-[280px] w-full bg-gray-200 animate-pulse relative">
          <div className="absolute inset-0 shimmer" />
        </div>
      </div>

      {/* Name */}
      <div className="mt-4 h-5 w-3/4 rounded bg-gray-200 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
      </div>
    </div>
  );
}

export default function ProductsSuspenseFallback() {
  return (
    <div className="w-full">
      <CategorySkeleton count={5} />
      <CategorySkeleton count={5} />
    </div>
  );
}
