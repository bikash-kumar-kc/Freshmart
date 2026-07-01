"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, MapPin, ChevronDown} from "lucide-react";
import { discountedPrice, formatWeight } from "./utilities/helper.fun";
import { ImageGallery } from "./utilities/image.gallary";
import { FreshnessBadge } from "./utilities/FreshnessBadge";
import { RelatedProductCard } from "./utilities/subProductCard";
import { GetProductResult } from "@/src/lib/server actions/product.server.action";
import GoBackButton from "../buttons/GotoBackBtn";
import { usePathname } from "next/navigation";

export default function ProductDetailPage({
  product,
  variantRows,
  relatedProducts,
}: GetProductResult) {
  const pathname = usePathname();
  const [addedToCart, setAddedToCart] = useState(false);
  const [animate, setAnimate] = useState(false);

  const finalPrice = product?.isOffered
    ? discountedPrice(variantRows[0]?.price, product.discount as number)
    : variantRows[0]?.price;

  const isOutOfStock =
    product?.status === "inactive" || variantRows[0]?.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  useEffect(() => {
    const key = `visited:${pathname}`;
    const alreadySeen = sessionStorage.getItem(key);

    if (!alreadySeen) {
      setAnimate(true);
      sessionStorage.setItem(key, "1");
    }
  }, [pathname]);

  return (
    <main className="flex flex-col bg-[#F5F9F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GoBackButton />
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${animate ? "animate-fade-up" : ""}`}
        >
          <div>
            <ImageGallery
              images={product?.images ?? []}
              name={product?.name as string}
            />
          </div>

          <div className="flex flex-col  ">
            <h1
              className="font-serif text-2xl sm:text-[28px] font-semibold
              text-gray-900 leading-snug mb-1"
            >
              {product?.name}
            </h1>

            <div className="flex items-center gap-1.5 mb-4">
              <MapPin size={11} className="text-green-600 shrink-0" />
              <span className="text-xs text-gray-500">
                {product?.farmName} · {product?.originCountry}
              </span>
            </div>

            {product && product?.freshnessTags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.freshnessTags.map((tag) => (
                  <FreshnessBadge key={tag} tag={tag} />
                ))}
              </div>
            )}

            <div className="bg-white rounded-sm border border-gray-100 p-4 mb-4">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Price per{" "}
                {formatWeight(
                  variantRows[0]?.weightValue,
                  variantRows[0]?.weightUnit,
                )}{" "}
                · Inclusive of all taxes
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3.5 px-5 rounded-sm font-semibold text-sm
                  border-2 transition-all duration-200
                  ${
                    isOutOfStock
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : addedToCart
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-green-600 bg-white text-green-700 hover:bg-green-50"
                  }
                `}
              >
                <ShoppingCart size={16} />
                {addedToCart ? "Added ✓" : "Add to cart"}
              </button>

              <button
                disabled={isOutOfStock}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3.5 px-5 rounded-sm font-semibold text-sm
                  transition-all duration-200
                  ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#C8742A] hover:bg-[#A85E1C] text-white shadow-md hover:shadow-lg"
                  }
                `}
              >
                Buy now
              </button>
            </div>

            <div
              className="mt-4 bg-green-100 rounded-sm border border-gray-100
          p-6 lg:p-8"
            >
              <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
                {product?.description}
              </p>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-medium text-gray-900">
                Similar Products
              </h2>
              <Link
                href={`/products?category=${product?.category}`}
                className="text-xs font-medium text-green-700
                  hover:text-green-900 transition-colors flex items-center gap-1"
              >
                View all
                <ChevronDown size={12} className="-rotate-90" />
              </Link>
            </div>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
              gap-4"
            >
              {relatedProducts.slice(0, 8).map((rp) => (
                <RelatedProductCard
                  key={rp.id}
                  product={rp}
                  variants={variantRows}
                  isAnimate={animate}
                />
              ))}
            </div>
          </div>
        )}

        {relatedProducts.length === 0 && (
          <div className="h-100 w-full flex justify-center items-center flex-col gap-2">
            <p className="text-gray-500">no related products</p>
            <Link href="/">
              <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
                Visit Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
