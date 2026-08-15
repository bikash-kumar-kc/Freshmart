import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  productId: string;
  thumbnail: string;
  productName: string;
  category: string;
  slug: string;
  price?: number;
  originalPrice?: number;
  isFeatured?: boolean;
  weightValue: number;
  weightUnit: string;
  stock: number;
};

export default function ProductCard({
  productName,
  category,
  slug,
  price,
  isFeatured,
  weightValue,
  weightUnit,
}: ProductCardProps) {
  return (
    <div className="group w-53.75 overflow-hidden rounded-sm bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${category}/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={
              "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80"
            }
            alt={productName}
            fill
            sizes="215px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold  text-amber-700">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-[12px] font-medium uppercase tracking text-green-800">
            {category}
          </span>

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
            {productName}
          </h3>

          <div className="mt-2 flex justify-between items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">
              Rs {price?.toFixed(2) ?? "20.00"}
            </span>

            <span className="text-[10px] text-gray-500">
              {weightValue}
              {weightUnit}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
