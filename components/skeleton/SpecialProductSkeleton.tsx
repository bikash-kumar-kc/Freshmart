 function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-black/10 rounded-md overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-[200px] bg-gray-200 shimmer">
        {/* Wishlist */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-gray-300" />

        {/* Offer badge */}
        <div className="absolute left-2 top-2 w-14 h-5 rounded-full bg-gray-300" />

        {/* Bottom overlays */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col gap-2 items-end">
          <div className="w-28 h-5 rounded-full bg-gray-300" />
          <div className="w-16 h-5 rounded-full bg-gray-300" />
        </div>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3 flex items-center justify-between">
        <div className="flex-1">
          {/* Product name */}
          <div className="h-4 w-32 bg-gray-200 rounded shimmer skeleton mb-3" />

          {/* Prices */}
          <div className="flex gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded shimmer" />
            <div className="h-3 w-10 bg-gray-200 rounded shimmer" />
          </div>
        </div>

        {/* Cart button */}
        <div className="w-9 h-9 rounded-[10px] bg-gray-200 shimmer shrink-0" />
      </div>
    </div>
  );
}

const SpecialProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default SpecialProductsSkeleton;
