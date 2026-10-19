"use client";

import { useGetOfferedProducts } from "@/src/hooks/useGetOfferedProducts";
// import { ProductCard } from "../PopularCard";
// import Link from "next/link";
import { ProductCard } from "./unifiedProductCard/UnifiedProductCard";
import { fromFlatProduct } from "./unifiedProductCard/normalizeProduct";

const OfferedProductsComponent = () => {
  const {
    data: offeredProductsInfo,
    isLoading: offeredProductsLoading,
    isError,
    error,
  } = useGetOfferedProducts();

  const offeredProducts = offeredProductsInfo?.offeredProducts;

  if (offeredProductsLoading) {
    return <p className="text-gray-500 text-center">loading...</p>;
  }

  if (isError) {
    return <p className="text-red-600 text-center">{error.message}</p>;
  }

  if (!offeredProducts) {
    return <p className="text-red-600">failed to get popular products</p>;
  }

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 mt-6 lg:mt-0 ">
      <h2 className="px-4 text-2xl font-semibold sm:text-3xl lg:px-0 ">
        Special Offers
      </h2>
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scroll-px-4
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
        sm:grid sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-[30px]
        sm:overflow-visible sm:px-4 sm:pb-0 lg:px-0"
      >
        {offeredProducts.map((p) => (
          <div
            key={p.id}
            className="w-[68%] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <ProductCard product={fromFlatProduct(p)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferedProductsComponent;
