import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type ProductCardProps = {
  thumbnail: string;
  productName: string;
  category: string;
  slug: string;
  price?: number;
  originalPrice?: number;
  isFeatured?: boolean;
  onAddToCart?: (slug: string) => void;
};

export default function ProductCard({
  thumbnail,
  productName,
  category,
  slug,
  price,
  originalPrice,
  isFeatured,
  onAddToCart,
}: ProductCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;

  return (
    <div className="group w-[215px] overflow-hidden rounded-sm bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/products/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={thumbnail}
            alt={productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
              Featured
            </span>
          )}

          {hasDiscount && (
            <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              -{Math.round(((originalPrice! - price) / originalPrice!) * 100)}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {category}
          </span>

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
            {productName}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              ${price?.toFixed(2) ?? '20.00'}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.(slug);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </div>
  );
}