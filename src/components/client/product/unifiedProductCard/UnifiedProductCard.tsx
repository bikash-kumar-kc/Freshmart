"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { selectIsFavorite } from "@/src/store/faviourites/selectors";
import { addFavorite, removeFavorite } from "@/src/store/faviourites/slice";
import {
  addCartItem,
  ICartItem,
  removeCartItem,
} from "@/src/store/carts/slice";
import {
  isAllowedToAddedInCart,
  isProductInCart,
  productQuantity,
} from "@/src/store/carts/selectors";
import { IUnifiedProduct } from "@/src/types/product.types/productCard.types";
import QuantityControl from "@/src/app/cart/components/QuantityControl";

export function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CheckIcon() {
  return (
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
  );
}

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#D85A30" : "none"}
      stroke={filled ? "#D85A30" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

type CardMode = "default" | "favorite";

export function ProductCard({
  product,
  mode = "default",
  specialId,
  onRemoveFavorite,
}: {
  product: IUnifiedProduct;
  mode?: CardMode;
  specialId?: string;
  onRemoveFavorite?: (id: string) => void;
  type?: string;
}) {
  const [wished, setWished] = useState(mode === "favorite");
  const [added, setAdded] = useState(false);

  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(product.id));
  const isProductOnCart = useAppSelector(isProductInCart(product.id));
  const isAllowed = useAppSelector(isAllowedToAddedInCart);
  const productInfo = useAppSelector(productQuantity(product.id));

  const isOutOfStock = product.status === "out_of_stock" || product.stock === 0;

  useEffect(() => {
    if (mode === "default") setWished(!!isFavorite);
  }, [isFavorite, mode]);

  useEffect(() => {
    setAdded(!!isProductOnCart);
  }, [isProductOnCart]);

  function handleCart(data: ICartItem) {
    if (!data.productId) return;
    if (!added) {
      dispatch(addCartItem(data));
      setAdded(true);
      toast.success("To update the quantity, visit cart section ");
    } else {
      dispatch(removeCartItem({ productId: data.productId }));
      setAdded(false);
      toast.success("Product removed from cart successfully !");
    }
  }

  function handleTopRightButton(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (mode === "favorite") {
      onRemoveFavorite?.(product.id);
      return;
    }

    if (!wished) {
      dispatch(
        addFavorite({
          productId: product.id,
          slug: product.slug,
          category: product.category,
        }),
      );
    } else {
      dispatch(removeFavorite({ productId: product.id }));
    }
    setWished((prev) => !prev);
  }

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (isAllowed) {
      toast.info(
        "Your cart is saved , please checkout before creating new cart",
      );
      return;
    }

    handleCart({
      productId: product.id,
      varient: {
        weightUnit: product.weightUnit!,
        weightValue: product.weightValue!,
        price: product.price!,
        stock: product.stock,
      },
      isOffered: !!product.isOffered,
      discountAmount: product.discount ?? 0,
      quantity: 1,
      category: product.category,
      thumbnail: product.thumbnail,
      productName: product.name,
      slug: product.slug,
    });
  }

  return (
    <Link
      href={`/product/${product.category}/${product.slug}`}
      className={`group bg-white border rounded-md overflow-hidden flex flex-col
        transition-transform duration-200 ease-out hover:scale-[1.02]
        ${specialId === product.id ? "border-purple-500" : "border-black/10"}`}
    >
      <div className="relative h-50 overflow-hidden">
        <Image
          src={
            "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
          }
          alt={product.name}
          fill
          className={`object-cover ${isOutOfStock ? "opacity-60" : ""}`}
          sizes="240px"
        />

        <button
          onClick={handleTopRightButton}
          aria-label={
            mode === "favorite"
              ? "Remove from favorites"
              : wished
                ? "Remove from wishlist"
                : "Add to wishlist"
          }
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90
            flex items-center justify-center text-[#555] cursor-pointer p-0"
        >
          {mode === "favorite" ? (
            <Trash2 size={14} />
          ) : (
            <HeartIcon filled={wished} />
          )}
        </button>

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isMostPopular && (
            <span className="bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              Popular
            </span>
          )}
          {product.isOffered && product.discount ? (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              -{product.discount}%
            </span>
          ) : null}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              Out of stock
            </span>
          )}
        </div>

        {product.weightValue && product.weightUnit && (
          <div className="absolute bottom-2.5 right-2.5">
            <span className="bg-[rgba(27,52,4,0.6)] text-[#EAF3DE] text-[10px] px-2.25 py-0.75 rounded-full">
              {product.weightValue}
              {product.weightUnit}
            </span>
          </div>
        )}
      </div>

      <div className="px-3.5 py-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-sm font-medium text-[#1a1a1a] line-clamp-1">
            {product.name}
          </p>
          <div className="flex gap-2 items-end">
            <p className="mt-0.5 mb-0 text-[13px] text-[#666]">
              {product.price != null ? `Rs ${product.price.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>

        {isProductOnCart && !!productInfo && (
          <QuantityControl
            value={productInfo.quantity}
            maxStock={productInfo.stock}
            id={productInfo.productId}
          />
        )}

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label="Add to cart"
          className={`w-9 h-9 rounded-[10px] flex items-center justify-center
            cursor-pointer text-[#C0DD97] shrink-0 transition-colors duration-200
            ${added ? "bg-[#27500A]" : "bg-[#3B6D11]"}
            ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {added ? <CheckIcon /> : <CartIcon />}
        </button>
      </div>
    </Link>
  );
}
