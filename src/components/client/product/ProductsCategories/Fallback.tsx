type CategorySkeletonProps = {
  count?: number;
};


function CategorySkeleton({ count = 10 }: CategorySkeletonProps) {
  return (
    <section className="mt-10 w-full min-w-0">
      {/* Category Title */}
      <div className="skeleton mx-4 mb-4 h-8 w-56 rounded-md sm:mb-6 lg:mx-0" />

      {/* Products */}
      <div
        className="mt-4 flex w-full min-w-0 flex-nowrap gap-3 overflow-hidden px-4
          sm:flex-wrap sm:gap-15 sm:overflow-visible sm:px-0"
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
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-2xl sm:w-55">
      {/* Image */}
      <div className="skeleton h-52 w-full rounded-2xl sm:h-70" />

      {/* Name */}
      <div className="skeleton mt-4 h-5 w-3/4 rounded-md" />

      {/* Price */}
      <div className="skeleton mt-3 h-6 w-1/3 rounded-md" />

      {/* Button */}
      <div className="skeleton mt-4 h-10 w-full rounded-xl" />
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


