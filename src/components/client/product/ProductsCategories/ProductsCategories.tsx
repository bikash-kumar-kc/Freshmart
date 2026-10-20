"use client";
import { useGetProductsByCategories } from "@/src/hooks/useGetProductsByCategories";
import HoverRevealCard from "../../NormalProduct";
import { useSearchParams } from "next/navigation";

const ProductsCategories = () => {
  const searchParams = useSearchParams();
  const cats = searchParams.get("categories") ?? "Dairy & Eggs,Fruits";

  const { data: categoriesProducts } = useGetProductsByCategories(cats);

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
    <div className="w-full max-w-7xl m-auto min-w-0">
      <div className="w-full min-w-0 flex flex-col gap-5 mt-8">
        {categoriesProducts?.catBundle?.map((c) => (
          <div key={c.category} className="flex min-w-0 flex-col gap-2">
            <h2 className="px-4 text-2xl font-semibold lg:px-0">
              {c.category}
            </h2>

            <div
              className="flex min-w-0 w-full flex-row flex-nowrap items-center 
              overflow-x-auto px-4 pb-2 snap-x snap-proximity scroll-px-4
              touch-pan-x overscroll-x-contain
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:flex-wrap sm:justify-between  sm:gap-4 sm:space-y-2
              sm:overflow-visible sm:px-0 sm:pb-0 gap-3"
            >
              {c?.products.map((p, index) => (
                <div
                  key={p.productId + index}
                  className="w-[55%] shrink-0 snap-start [&>*]:w-full
                  sm:w-auto sm:shrink sm:[&>*]:w-auto"
                >
                  <HoverRevealCard
                    image={p.thumbnail}
                    name={p.productName}
                    cat={c.category}
                    productId={p.productId}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsCategories;
