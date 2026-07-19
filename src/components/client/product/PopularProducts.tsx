"use client";

import { useGetPopularProducts } from "@/src/hooks/useGetPopularProducts";
import { ProductCard } from "../PopularCard";
import Link from "next/link";

const PopularProducts = () => {
  const { data: popularProductsInfo, isError, error } = useGetPopularProducts();

  const popularProducts = popularProductsInfo?.popularProducts;

  if (isError) {
    return <p className="text-red-600 text-center">{error.message}</p>;
  }

  if (popularProducts.length === 0) {
    return <p></p>;
  }

  return (
    <div className=" w-full flex flex-col gap-6">
      <h2 className="text-3xl font-semibold ">Popular Now</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 30,
        }}
      >
        {popularProducts.map((p) => (
          <Link key={p.id} href={`/product/${p.category}/${p.slug}`}>
            <ProductCard product={p} type="Popular" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
