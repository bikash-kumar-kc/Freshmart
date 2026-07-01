"use client";

import { useGetOfferedProducts } from "@/src/hooks/useGetOfferedProducts";
import { ProductCard } from "../PopularCard";

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
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      className=" w-full flex flex-col gap-6"
    >
      <h2 className="text-4xl font-bold ">Offered Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 30,
        }}
      >
        {offeredProducts.map((p) => (
          <ProductCard key={p.id} product={p} type="offer" />
        ))}
      </div>
    </div>
  );
};

export default OfferedProductsComponent;
