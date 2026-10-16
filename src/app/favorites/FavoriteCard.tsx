"use client";

import Link from "next/link";
import { IFavoriteProductData } from "./types/favorite.type";
import Image from "next/image";
import { formatWeight } from "@/src/components/client/product/utilities/helper.fun";
import { ShoppingCart, Trash2 } from "lucide-react";
import {
  addCartItem,
  ICartItem,
  removeCartItem,
} from "@/src/store/carts/slice";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { useState } from "react";
import { isAllowedToAddedInCart } from "@/src/store/carts/selectors";
import { toast } from "react-toastify";
import { CartIcon } from "@/src/components/client/PopularCard";

export function FavoriteCard({
  product,
  onRemove,
}: {
  product: IFavoriteProductData;
  onRemove: (id: string) => void;
}) {
  const isOutOfStock = product.status === "out_of_stock";
  const [addedToCart, setAddedToCart] = useState(false);

  const dispatch = useAppDispatch();
  const isAllowed = useAppSelector(isAllowedToAddedInCart);

  function handleCart(data: ICartItem) {
    if (!data.productId) return;

    if (!addedToCart) {
      dispatch(addCartItem(data));
      setAddedToCart(true);
      toast.success("To update the quantity, visit cart section ");
    } else {
      dispatch(removeCartItem({ varientId: data.varient.varientId }));
      setAddedToCart(false);
      toast.success("Product removed from cart successfully !");
    }
  }

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

        <div className="flex flex-row w-full gap-2 items-center">
          <button
            onClick={() => onRemove(product.id)}
            className="mt-3  flex-1 flex justify-center gap-1.5
            text-xs font-medium py-2 rounded-sm border border-red-100
            text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
            {/* Remove */}
          </button>

          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();

              if (isAllowed) {
                toast.info(
                  "Your cart is saved , please checkout before creating new cart",
                );
                return;
              }
              const requiredDataToAddedOnCart: ICartItem = {
                productId: product.id,
                varient: {
                  varientId: product.varientId as string,
                  weightUnit: product.weightUnit!,
                  weightValue: product.weightValue!,
                  price: product.price!,
                  stock: product?.stock ?? 0,
                },
                isOffered: false,
                discountAmount: 0,
                quantity: 1,
                category: product.category,
                thumbnail: product.thumbnail,
                productName: product.name,
                slug: product.slug,
              };
              handleCart(requiredDataToAddedOnCart);
            }}
            className="flex-1 flex justify-center  rounded-sm bg-green-900 py-2 mt-3 text-white transition-colors hover:bg-green-600"
            // disabled={isAllowed ? isAllowed : false}
          >
            {addedToCart ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <CartIcon />
            )}
            {/* {addedToCart ? "Added to cart" : "Add to cart"} */}
          </button>
        </div>
      </div>
    </div>
  );
}
