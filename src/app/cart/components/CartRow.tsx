"use client";
import { calculateDiscountPercentage } from "@/src/components/client/product/utilities/subProductCard";
import { ICartItem, removeCartItem } from "@/src/store/carts/slice";
import { Leaf, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import QuantityControl from "./QuantityControl";
import { useAppDispatch } from "@/src/store/hook";

function CartRow({ item }: { item: ICartItem }) {
  const lineTotal = item.varient.price * item.quantity;
  const dispatch = useAppDispatch();
  return (
    <div
      className="flex items-start gap-4 py-5 border-b border-gray-100
      last:border-0"
    >
      {/* thumbnail */}
      <Link
        href={`/products/${item.productId}`}
        className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24
          rounded-sm overflow-hidden bg-green-50 border border-gray-100
          hover:border-green-300 transition-colors"
      >
        <Image
          src={"https://loremflickr.com/120/120/almonds,nuts"}
          alt={item.productName}
          fill
          sizes="96px"
          className="object-cover"
        />
        {item.isOffered && (
          <span
            className="absolute top-1.5 left-1.5 bg-orange-500 text-white
            text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none"
          >
            -
            {calculateDiscountPercentage(
              item.varient.price,
              item.discountAmount,
            )}
            %
          </span>
        )}
      </Link>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span
              className="inline-flex items-center gap-1 text-[10px]
              font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-md
              mb-1"
            >
              <Leaf size={8} />
              {item.category}
            </span>
            <Link
              href={`/products/${item.productId}`}
              className="block text-sm font-semibold text-gray-900
                hover:text-green-700 transition-colors truncate pr-2"
            >
              {item.productName}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">
              {item.varient.weightValue}
              {item.varient.weightUnit} per unit
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center">
            <h3>Quantity</h3>
            <QuantityControl
              value={item.quantity}
              maxStock={item.varient.stock}
              id={item.productId}
            />
          </div>

          {/* remove */}
          <button
            onClick={() =>
              dispatch(removeCartItem({ productId: item.productId }))
            }
            className="shrink-0 p-1.5 rounded-lg text-gray-300
              hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-end mt-3 flex-wrap gap-2">
          <div className="text-right">
            <p className="text-base font-bold text-gray-900">
              Rs: {lineTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartRow;
