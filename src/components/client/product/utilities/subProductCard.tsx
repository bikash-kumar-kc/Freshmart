import {
  IPRODUCTRESPONSE,
  IPRODUCTVARIENTS,
} from "@/src/lib/server actions/product.server.action";
import { discountedPrice, formatWeight } from "./helper.fun";
import Image from "next/image";
import Link from "next/link";

export const RelatedProductCard = ({
  product,
  variants,
}: {
  product: IPRODUCTRESPONSE;
  variants: IPRODUCTVARIENTS[];
}) => {
  const cheapest = variants.reduce(
    (min, v) => (v.price < min.price ? v : min),
    variants[0],
  );

  const finalPrice = product.isOffered
    ? discountedPrice(cheapest?.price ?? 0, product.discount)
    : (cheapest?.price ?? 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-gray-100
        overflow-hidden hover:border-green-300 hover:shadow-sm
        transition-all duration-200"
    >
      <div className="relative aspect-4/3 bg-green-50 overflow-hidden animate-fade-up">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover group-hover:scale-105
            transition-transform duration-300"
        />
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
            ${finalPrice.toFixed(2)}
          </span>
          {cheapest && (
            <span className="text-xs text-gray-400">
              / {formatWeight(cheapest.weightValue, cheapest.weightUnit)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
