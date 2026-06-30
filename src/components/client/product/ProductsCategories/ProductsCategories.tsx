"use client";
import { useGetProductsByCategories } from "@/src/hooks/useGetProductsByCategories";
import HoverRevealCard from "../../NormalProduct";

const ProductsCategories = ({ cats }: { cats: string }) => {
  const {
    data: categoriesProducts,
    isLoading: productsLoading,
    error,
    isError,
  } = useGetProductsByCategories(cats);

  if (productsLoading) {
    return (
      <div className="w-full max-w-7xl m-auto ">
        <div className="w-full flex flex-col gap-5">
          <p className="text-gray-500 text-center">
            products are being loading...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl m-auto ">
        <div className="w-full flex flex-col gap-5">
          <p className="text-red-500 text-center">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!categoriesProducts) {
    return (
      <div className="w-full max-w-7xl m-auto ">
        <div className="w-full flex flex-col gap-5">
          <p className="text-red-500 text-center">products not found...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl m-auto ">
      <div className="w-full flex flex-col gap-5">
        {categoriesProducts?.catBundle?.map((c) => (
          <div key={c.category}>
            <h2>{c.category}</h2>
            <div className="w-full flex flex-wrap flex-row gap-2 justify-between items-center space-y-2">
              {c?.products.map((p) => (
                <HoverRevealCard
                  key={p.productId}
                  image={p.thumbnail}
                  name={p.productName}
                  cat={c.category}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCategories;
