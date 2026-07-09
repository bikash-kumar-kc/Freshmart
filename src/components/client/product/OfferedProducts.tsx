"use client";

import { useGetOfferedProducts } from "@/src/hooks/useGetOfferedProducts";
import { ProductCard } from "../PopularCard";
import Link from "next/link";

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
      className=" w-full flex flex-col gap-6 mt-8"
    >
      <h2 className="text-3xl font-semibold">Special Offers</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 30,
        }}
      >
        {offeredProducts.map((p) => (
          <Link key={p.id} href={`/product/${p.category}/${p.slug}`}>
          <ProductCard key={p.id} product={p} type="Offer" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OfferedProductsComponent;
