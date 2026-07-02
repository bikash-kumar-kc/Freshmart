type CategorySkeletonProps = {
  count?: number;
};


function CategorySkeleton({ count = 10 }: CategorySkeletonProps) {
  return (
    <section className="w-full mt-10">
      {/* Category Title */}
      <div className="skeleton h-8 w-56 rounded-md mb-6" />

      {/* Products */}
      <div className="flex flex-wrap gap-15 mt-4 w-full ">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="w-55 overflow-hidden rounded-2xl">
      {/* Image */}
      <div className="skeleton h-70 w-full rounded-2xl" />

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


