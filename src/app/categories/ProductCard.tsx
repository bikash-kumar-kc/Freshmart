import Image from "next/image";
import Link from "next/link";
import { ICategoryProducts } from "@/src/types/product.types/categoryProduct.types";
import { cheapestVariant } from "@/src/utils/calculateCheapest";

export function ProductCard({
  product,
  specialId,
}: {
  product: ICategoryProducts;
  specialId: string;
}) {
  const variant = cheapestVariant(product.variants);
  const isOutOfStock =
    product.status === "out_of_stock" || !variant || variant.price === 0;

  return (
    <Link
      href={`/product/${product.category}/${product.slug}`}
      className={`group bg-white rounded-sm border 
        overflow-hidden hover:border-green-200 hover:shadow-sm
        transition-all duration-200 flex flex-col ${specialId === product.id ? "border-purple-500" : "border-gray-100"}`}
    >
      <div className="relative aspect-4/3 bg-green-50 overflow-hidden">
        <Image
          src={
            "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80"
          }
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300
            group-hover:scale-105 ${isOutOfStock ? "opacity-60" : ""} `}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffered && (
            <span
              className="bg-orange-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none"
            >
              -{product.discount}%
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

      <div className="p-3 flex flex-col flex-1">
        <p
          className="text-sm font-semibold text-gray-900 line-clamp-1
          group-hover:text-green-700 transition-colors mb-1"
        >
          {product.name}
        </p>
        {variant && (
          <div className="mt-auto flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">
              Rs. {variant.price}
            </span>
             <p className="text-[11px] text-gray-400 mb-2">
            {variant.weightValue}/{variant.weightUnit}
          </p>
          </div>
        )}
      </div>
    </Link>
  );
}
