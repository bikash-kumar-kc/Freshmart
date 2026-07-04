import Link from "next/link";
import { IFavoriteProductData } from "./types/favorite.type";
import Image from "next/image";
import { HeartIcon } from "@/src/components/client/PopularCard";
import { formatWeight } from "@/src/components/client/product/utilities/helper.fun";
import { Trash2 } from "lucide-react";

export function FavoriteCard({
  product,
  onRemove,
}: {
  product: IFavoriteProductData;
  onRemove: (id: string) => void;
}) {
  const isOutOfStock = product.status === "out_of_stock";

  return (
    <div
      className="group bg-white rounded-sm border border-gray-100
      overflow-hidden hover:border-green-200 hover:shadow-sm
      transition-all duration-200 flex flex-col"
    >
      <Link
        href={`/product/${product.category}/${product.slug}`}
        className="relative aspect-4/3 bg-green-50 overflow-hidden block"
      >
        <Image
          src="https://images.unsplash.com/photo-1518977676601-b53f82aba655"
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300
            group-hover:scale-105 ${isOutOfStock ? "opacity-60" : ""}`}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffered && product.discount && (
            <span
              className="bg-orange-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none"
            >
              -{product.discount}%
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

      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-green-700 font-medium mb-0.5">
          {product.category}
        </p>
        <Link
          href={`/product/${product.category}/${product.slug}`}
          className="text-sm font-semibold text-gray-900 line-clamp-1
            hover:text-green-700 transition-colors mb-auto"
        >
          {product.name}
        </Link>

        {product.price != null && (
          <div className="flex items-center justify-between gap-1.5 mt-2">
            <span className="text-sm font-bold text-gray-900">
              Rs {product.price.toFixed(2)}
            </span>

            {product.weightValue && product.weightUnit && (
              <span className="text-xs text-gray-400">
                {formatWeight(
                  product.weightValue as number,
                  product.weightUnit,
                )}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => onRemove(product.id)}
          className="mt-3 w-full flex items-center justify-center gap-1.5
            text-xs font-medium py-2 rounded-sm border border-red-100
            text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={12} />
          Remove
        </button>
      </div>
    </div>
  );
}
