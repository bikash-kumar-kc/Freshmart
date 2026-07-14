const ProductCardSkeleton = () => {
  return (
    <div
      className="
        bg-white rounded-sm border border-gray-100
        overflow-hidden animate-pulse flex flex-col
      "
    >
      {/* Image */}
      <div className="relative aspect-4/3 bg-gray-200">
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <div className="h-4 w-10 rounded-md bg-gray-300" />
          <div className="h-4 w-14 rounded-md bg-gray-300" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <div className="h-4 w-3/4 rounded bg-gray-200 mb-3" />

        <div className="mt-auto flex justify-between items-center">
          <div className="h-5 w-16 rounded bg-gray-300" />
          <div className="h-3 w-10 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;