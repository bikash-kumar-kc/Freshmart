"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, MapPin, ChevronDown, Home } from "lucide-react";
import { formatWeight } from "./utilities/helper.fun";
import { ImageGallery } from "./utilities/image.gallary";
import { FreshnessBadge } from "./utilities/FreshnessBadge";
import { calculateDiscountPercentage } from "./utilities/subProductCard";
import { GetProductResult } from "@/src/lib/server_actions/product.server.action";
import GoBackButton from "../buttons/GotoBackBtn";
import { usePathname } from "next/navigation";
import {
  addCartItem,
  ICartItem,
  removeCartItem,
} from "@/src/store/carts/slice";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import {
  isAllowedToAddedInCart,
  isProductInCart,
  productQuantity,
} from "@/src/store/carts/selectors";
import { toast } from "react-toastify";
import { ProductCard } from "./unifiedProductCard/UnifiedProductCard";
import { fromFlatProduct } from "./unifiedProductCard/normalizeProduct";
import QuantityControl from "@/src/app/cart/components/QuantityControl";

export default function ProductDetailPage({
  product,
  filteredVariantRow,
  relatedProducts,
  vendorProducts,
  productVarients,
  isFromProductVarients,
}: GetProductResult) {
  const pathname = usePathname();
  const [addedToCart, setAddedToCart] = useState(false);
  const [animate, setAnimate] = useState(false);

  const dispatch = useAppDispatch();
  const isProductOnCart = useAppSelector(isProductInCart(product?.id));
  const isAllowed = useAppSelector(isAllowedToAddedInCart);
  const productInfo = useAppSelector(productQuantity(product?.id));


  const suggestedProducts = isFromProductVarients
    ? (vendorProducts ?? [])
    : (relatedProducts ?? []);

  const varients = isFromProductVarients
    ? (productVarients ?? [])
    : [filteredVariantRow];

  const isOutOfStock =
    product?.status === "inactive" || filteredVariantRow?.stock === 0;

  const handleAddToCart = (data: ICartItem) => {
    if (isOutOfStock) return;
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
  };

  useEffect(() => {
    const key = `visited:${pathname}`;
    const alreadySeen = sessionStorage.getItem(key);

    if (!alreadySeen) {
      setAnimate(true);
      sessionStorage.setItem(key, "1");
    }
  }, [pathname]);

  useEffect(() => {
    if (!isProductOnCart) {
      return;
    }
    setAddedToCart(isProductOnCart);
  }, [isProductOnCart]);

  return (
    <main className="flex flex-col bg-[#F5F9F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between">
          <GoBackButton />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium
                     text-green-700 hover:text-white hover:bg-green-400
                     px-3 py-2 transition-colors rounded-sm"
          >
            <Home size={14} />
            Home
          </Link>
        </div>
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 ${animate ? "animate-fade-up" : ""}`}
        >
          <div>
            <ImageGallery
              images={product?.images ?? []}
              name={product?.name as string}
              id={product?.id as string}
            />
          </div>

          <div className="flex flex-col  ">
            <h1
              className="font-serif text-2xl sm:text-[28px] font-bold
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

            <div className="flex gap-3 ">
              {varients &&
                varients.length > 0 &&
                varients.map((v) => {
                  if (!v) {
                    return;
                  }

                  return (
                    <div
                      key={v.id}
                      className={`bg-white rounded-sm border flex gap-4 flex-col flex-1  p-4 mb-4 shadow-sm  border-green-500`}
                    >
                      <div>
                        <div className="relative">
                          {product?.isOffered && (
                            <span
                              className="
        absolute top-0 right-0
        bg-orange-500 text-white text-xs font-bold
        px-2 py-1 rounded-bl-lg
        shadow-md
      "
                            >
                              -
                              {calculateDiscountPercentage(
                                v?.price as number,
                                product?.discount as number,
                              )}
                              %
                            </span>
                          )}

                          {product?.isMostPopular && (
                            <span
                              className="
        absolute top-0 right-0
        bg-orange-500 text-white text-xs font-bold
        px-2 py-1 rounded-bl-lg
        shadow-md
      "
                            >
                              popular
                            </span>
                          )}

                          <div className="flex items-end gap-3 mb-1">
                            <span className="text-xl font-bold text-gray-900">
                              Rs {v?.price?.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-600">
                          Price per{" "}
                          {formatWeight(v?.weightValue, v?.weightUnit)} ·
                          Inclusive of all taxes
                        </p>
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          {isProductOnCart && !!productInfo && (
                            <QuantityControl
                              value={productInfo.quantity}
                              maxStock={productInfo.stock}
                              id={productInfo.productId}
                            />
                          )}
                          <button
                            onClick={(
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              e.preventDefault();
                              e.stopPropagation();

                              if (isAllowed) {
                                toast.info(
                                  "Your cart is saved , please checkout before creating new cart",
                                );
                                return;
                              }

                              const requiredDataToAddedOnCart: ICartItem = {
                                productId: product?.id as string,
                                varient: {
                                  varientId: v.id,
                                  weightUnit: v.weightUnit,
                                  weightValue: v.weightValue,
                                  price: v.price,
                                  stock: v.stock,
                                },
                                isOffered: product?.isOffered as boolean,
                                discountAmount: product?.discount as number,
                                quantity: 1,
                                category: product?.category as string,
                                thumbnail: product?.thumbnail as string,
                                productName: product?.name as string,
                                slug: product?.slug as string,
                                type: product?.type ?? "inventory",
                              };

                              handleAddToCart(requiredDataToAddedOnCart);
                            }}
                            className={`
                  flex-1 flex items-center justify-center gap-2
                  py-1 px-2 rounded-sm font-semibold text-sm
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
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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

        {suggestedProducts && suggestedProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl font-medium text-gray-900">
              {isFromProductVarients ? 'Related Vendor Products':'Similar Products'}
              </h2>
              <Link
                href={`/categories/${product?.category?.toLocaleLowerCase().split(' ').join('-')}`}
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
              {suggestedProducts.slice(0, 8).map((rp) => (
                <ProductCard key={rp.id} product={fromFlatProduct(rp)} />
              ))}
            </div>
          </div>
        )}

        {relatedProducts && relatedProducts.length === 0 && (
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
