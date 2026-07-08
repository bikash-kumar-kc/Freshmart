import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  addCartItem,
  ICartItem,
  removeCartItem,
} from "@/src/store/carts/slice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { isAllowedToAddedInCart } from "@/src/store/carts/selectors";

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
  productId,
  slug,
  price,
  isFeatured,
  weightValue,
  weightUnit,
  thumbnail,
  stock,
}: ProductCardProps) {
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
      dispatch(removeCartItem({ productId: data.productId }));
      setAddedToCart(false);
      toast.success("Product removed from cart successfully !");
    }
  }

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
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {isFeatured && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
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

      {/* Add to cart */}
      <div className="px-4 pb-4">
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
              productId: productId,
              varient: {
                weightUnit: weightUnit,
                weightValue: weightValue,
                price: price!,
                stock: stock,
              },
              isOffered: false,
              discountAmount: 0,
              quantity: 1,
              category: category,
              thumbnail: thumbnail,
              productName: productName,
              slug: slug,
            };
            handleCart(requiredDataToAddedOnCart);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-green-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
          // disabled={isAllowed ? isAllowed : false}
        >
          <ShoppingCart size={16} />
          {addedToCart ? "Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
