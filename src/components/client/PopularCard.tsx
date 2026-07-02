"use client";

import { useAppDispatch } from "@/src/store/faviourites/hook";
import { addFavorite, removeFavorite } from "@/src/store/faviourites/slice";
import Image from "next/image";
import { useState } from "react";

interface IProductTypes {
  id: string;
  slug: string;
  thumbnail: string;
  name: string;
  description: string;
  isOffered?: boolean;
  weightValue: number | null;
  weightUnit: string | null;
  price: number | null;
  discount?: number | null;
  category: string;
}

interface IFavoriteProduct {
  productId: string;
  slug: string;
  category: string;
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
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

function HeartIcon({ filled }: { filled: boolean }) {
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

export function ProductCard({
  product,
  type,
}: {
  product: IProductTypes;
  type: string;
}) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const dispatch = useAppDispatch();

  function handleCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const handleFavoriteToggle = ({
    productId,
    slug,
    category,
  }: IFavoriteProduct) => {
    if (!wished) {
      dispatch(addFavorite({ productId, slug, category }));
      console.log(
        `Favorite product added successfully ! productId:${productId}`,
      );
    }

    if (wished) {
      dispatch(removeFavorite({ productId }));
      console.log(
        `Favorite product added successfully ! productId:${productId}`,
      );
    }

    setWished((prevs) => !prevs);
  };

  return (
    <div
      className=" bg-white border border-black/10 rounded-md overflow-hidden flex flex-col
    transition-transform duration-200 ease-out
    hover:scale-[1.02]"
    >
      {/* Image */}
      <div className="relative h-50 overflow-hidden">
        <Image
          src={
            "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
          }
          alt={product.thumbnail}
          fill
          className="object-cover"
        />

        {/* Wishlist */}
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle({
              productId: product.id,
              slug: product.slug,
              category: product.category,
            });
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="
            absolute top-2.5 right-2.5
            w-8 h-8
            rounded-full
            bg-white/90
            flex items-center justify-center
            text-[#555]
            cursor-pointer
            p-0
          "
        >
          <HeartIcon filled={wished} />
        </button>

        {type && (
          <div className="absolute left-1 top-2 flex flex-col items-end gap-1">
            <span
              className="
              bg-[rgba(27,52,4,0.82)]
              text-[#ffffff]
              text-[10px]
              font-medium
              px-2.25
              py-0.75
              rounded-full
              tracking-[0.3px]
            "
            >
              {type}
            </span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col items-end gap-1">
          <span
            className="
              bg-[rgba(27,52,4,0.82)]
              text-[#C0DD97]
              text-[10px]
              font-medium
              px-2.25
              py-0.75
              rounded-full
              tracking-[0.3px]
            "
          >
            {product.description.split(".")[0].slice(0, 11)}
          </span>

          {product.weightUnit && product.weightValue && (
            <span
              className="
              bg-[rgba(27,52,4,0.6)]
              text-[#EAF3DE]
              text-[10px]
              px-2.25
              py-0.75
              rounded-full
            "
            >
              {product?.weightValue + product?.weightUnit}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-3.5 py-3 flex items-center justify-between">
        <div>
          <p className="m-0 text-sm font-medium text-[#1a1a1a]">
            {product.name}
          </p>

          <div className=" flex gap-2 items-end    ">
            <p className="mt-0.5 mb-0 px-1.5 text-[13px] text-[#666">
              {/* {product.discount
                ? (product.price as number) - product.discount
                : product.price} */}
              Rs {(product.price as number).toFixed(2)}
            </p>
            {type === "offer" && (
              <p className=" mt-0.5 text-[10px] text-[#d11010] text-center ">
                save: {product.discount ? product.discount : ""}
              </p>
            )}
          </div>
        </div>

        {/* Cart */}
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleCart();
          }}
          aria-label="Add to cart"
          className={`
            w-9 h-9
            rounded-[10px]
            flex items-center justify-center
            cursor-pointer
            text-[#C0DD97]
            shrink-0
            transition-colors duration-200
            ${added ? "bg-[#27500A]" : "bg-[#3B6D11]"}
          `}
        >
          {added ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
        </button>
      </div>
    </div>
  );
}
