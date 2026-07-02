import { IRequiredFieldTypes } from "@/src/lib/server actions/product.server.action";
import { formatWeight } from "./helper.fun";
import Image from "next/image";
import Link from "next/link";

export function calculateDiscountPercentage(
  price: number,
  discountAmount: number,
): number {
  if (price <= 0) return 0;

  return Math.floor((discountAmount / price) * 100);
}

export const RelatedProductCard = ({
  product,
  isAnimate,
}: {
  product: IRequiredFieldTypes;
  isAnimate: boolean;
}) => {
  

  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/product/${product.category}/${product.slug}`}
      className="group bg-white rounded-sm border border-gray-100
        overflow-hidden hover:border-green-300 hover:shadow-sm
        transition-all duration-200"
    >
      <div
        className={`relative aspect-4/3 bg-green-50 overflow-hidden ${isAnimate ? "animate-fade-up" : ""} `}
      >
        <Image
          src={
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80"
          }
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300
                  group-hover:scale-105 ${isOutOfStock ? "opacity-60" : ""}`}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffered && (
            <span
              className="bg-orange-500 text-white text-[10px] font-bold
                    px-1.5 py-0.5 rounded-md leading-none"
            >
              -
              {calculateDiscountPercentage(
                product.price,
                product?.discount as number,
              )}
              %
            </span>
          )}
          {product.isMostPopular && (
            <span
              className="bg-amber-400 text-white text-[10px] font-bold
                    px-1.5 py-0.5 rounded-md leading-none"
            >
              Popular
            </span>
          )}
          {isOutOfStock && (
            <span
              className="bg-gray-500 text-white text-[10px] font-bold
                    px-1.5 py-0.5 rounded-md leading-none"
            >
              Out of stock
            </span>
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-green-700 font-medium mb-0.5">
          {product.category}
        </p>
        <p
          className="text-sm font-medium text-gray-900 line-clamp-1
          group-hover:text-green-700 transition-colors"
        >
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-gray-900">
            Rs {product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            / {formatWeight(product.weightValue, product.weightUnit)}
          </span>
        </div>
      </div>
    </Link>
  );
};
