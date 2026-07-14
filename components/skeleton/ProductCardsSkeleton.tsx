import ProductCardSkeleton from "./ProductCardSkeleton";

const ProductCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2  sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 15 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductCardsSkeleton;