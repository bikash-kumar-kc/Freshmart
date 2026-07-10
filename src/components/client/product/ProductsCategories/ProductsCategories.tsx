"use client";
import { useGetProductsByCategories } from "@/src/hooks/useGetProductsByCategories";
import HoverRevealCard from "../../NormalProduct";
import { useSearchParams } from "next/navigation";

const ProductsCategories = () => {
  const searchParams = useSearchParams();
  const cats = searchParams.get("categories") ?? "Dairy & Eggs,Fruits";

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
            products are loading...
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
    <div className="w-full max-w-7xl m-auto  ">
      <div className="w-full flex flex-col gap-5 mt-8">
        {categoriesProducts?.catBundle?.map((c) => (
          <div key={c.category} className="flex flex-col gap-2">
            <h2 className="font-semibold text-2xl ">{c.category}</h2>
            <div className="w-full flex flex-wrap flex-row gap-4 justify-between items-center space-y-2">
              {c?.products.map((p,index) => (
                <HoverRevealCard
                  key={p.productId + index}
                  image={p.thumbnail}
                  name={p.productName}
                  cat={c.category}
                  productId={p.productId}
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
