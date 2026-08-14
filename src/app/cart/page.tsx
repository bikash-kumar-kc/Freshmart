"use client";
import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import {
  getAllItemsFromCart,
  statusOfCart,
  totalCalculation,
  totalItemsCart,
} from "@/src/store/carts/selectors";
import EmptyCart from "./components/EmptyCart";
import CartRow from "./components/CartRow";
import { clearCartItems, removeCartItem } from "@/src/store/carts/slice";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  clearSavedOrder,
  createOrder,
} from "@/src/lib/server_actions/product.server.action";
import { useEffect, useRef, useState } from "react";
import LocationDialog from "./components/AddressDialog";
import { paymentInitiator } from "@/src/lib/server_actions/payment.server.action";
import { PushOptIn } from "@/src/components/client/PushOptIn";
import { isUserSubscribed } from "@/src/lib/api calls/client/user/checkUserSubscribed";

type CartItem = {
  productId: string;
  vendorId?: string;
  type?: "display" | "inventory";
  varient: {
    varientId: string;
    weightUnit: string;
    weightValue: number;
    price: number;
    stock: number;
  };
  isOffered: boolean;
  discountAmount: number;
  quantity: number;
  thumbnail: string;
  category: string;
  productName: string;
  slug: string;
};

export default function CartPage() {
  // state...
  const totalCartProducts = useAppSelector(totalItemsCart);
  const allCartProducts = useAppSelector(getAllItemsFromCart);
  const cartAmountSummary = useAppSelector(totalCalculation);
  const statusCart = useAppSelector(statusOfCart);
  const dispatch = useAppDispatch();
  const alreadyNotify = useRef<boolean | null>(null);

  const isFromDb = statusCart?.type === "db";

  const [checkOutLoading, setCheckOutLoading] = useState<boolean>(false);
  const [saveCartLoading, setSaveCartLoading] = useState<boolean>(false);
  const [isSubscribed, setSubscribed] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<"inventory" | "display">(
    "inventory",
  );

  const [placingOrderFor, setPlacingOrderFor] = useState<string | null>(null);

  const cartItems: CartItem[] = allCartProducts?.items.cartItems ?? [];

  const inventoryItems = cartItems.filter((i) => i.type !== "display");

  // console.log(cartItems)

  const displayGroups = cartItems
    .filter((i) => i.type === "display")
    .reduce(
      (acc, item) => {
        console.log("dfghjk");
        const key = item.vendorId ?? "unknown";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, CartItem[]>,
    );

  // router
  const router = useRouter();

  // user session...
  const { data: session, status } = useSession();

  const handleClearAll = async () => {
    try {
      if (isFromDb) {
        await clearSavedOrder({
          userId: session?.user.id as string,
          orderId: statusCart.orderId,
        });
      }
      dispatch(clearCartItems());

      toast.success("Cart Clear successfully.");
    } catch (error) {
      if (error instanceof Error)
        toast.error(error.message ? error.message : "Failed to clear cart !");
    }
  };

  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen((prevs) => !prevs);
  };

  const calculateGroupSummary = (items: CartItem[]) => {
    const subtotal = items.reduce(
      (sum, i) => sum + i.varient.price * i.quantity,
      0,
    );
    const totalSaving = items.reduce(
      (sum, i) => sum + (i.discountAmount ?? 0) * i.quantity,
      0,
    );
    return { subtotal, totalSaving, total: subtotal - totalSaving };
  };

  const handlePlaceDisplayOrder = async (
    vendorId: string,
    items: CartItem[],
  ) => {
    if (status !== "authenticated") {
      router.push("/auth/login?redirect=/cart");
      toast.info("Please log in before placing an order!");
      return;
    }

    setPlacingOrderFor(vendorId);
    try {
      const res = await fetch("/api/display-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          items: items.map((i) => ({
            productVariantId: i.varient.varientId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to place order");
        return;
      }

      toast.success("Order placed! The vendor has been notified.");

      items.forEach((item) => {
        dispatch(removeCartItem({ productId: item.productId }));
      });
    } catch {
      toast.error("Failed to place order — please try again.");
    } finally {
      setPlacingOrderFor(null);
    }
  };

  const handleCheckout = async (type: "save_cart" | "process_checkout") => {
    if (status === "authenticated") {
      try {
        if (!allCartProducts?.items.cartItems) return;

        if (type === "save_cart") {
          setSaveCartLoading((prevs) => !prevs);
        }

        if (isFromDb) {
          await createOrder({
            userId: session.user.id!,
            type: "checkout",
            isFromDb: isFromDb,
            items: inventoryItems.map((i) => {
              return {
                productId: i.productId,
                weightValue: i.varient.weightValue,
                weightUnit: i.varient.weightUnit as "g" | "kg" | "ml" | "l",
                quantity: i.quantity,
                slug: i.slug,
                vendorId: i.vendorId ?? null,
              };
            }),
            totalDiscount: cartAmountSummary?.tda as number,
            totalPrice: cartAmountSummary?.tpwod as number,
            totalPriceAfterDiscount: cartAmountSummary?.tpwd as number,
            isDiscountCharge: cartAmountSummary?.isDeliveryCharged as boolean,
          });

          toast.info("Stock reserved for save cart !");

          // payment process...
          const paymentProcessInfo = await paymentInitiator({
            userId: session.user.id!,
            ordereId: statusCart.orderId,
          });

          if (!paymentProcessInfo.success) {
            toast.error(paymentProcessInfo.reason);
            return;
          }

          if (paymentProcessInfo.success) {
            window.location.href = paymentProcessInfo.url;
          }
          return;
        }

        const requiredItems: {
          productId: string;
          weightValue: number;
          weightUnit: "g" | "kg" | "ml" | "l";
          quantity: number;
          slug: string;
          vendorId: string | null;
        }[] = inventoryItems.map((i) => {
          return {
            productId: i.productId,
            weightValue: i.varient.weightValue,
            weightUnit: i.varient.weightUnit as "g" | "kg" | "ml" | "l",
            quantity: i.quantity,
            slug: i.slug,
            vendorId: i.vendorId ?? null,
          };
        });

        const userId = session.user.id!;

        const orderType: "checkout" | "save" =
          type === "save_cart" ? "save" : "checkout";
        const requiredDataToOrder = {
          userId: userId,
          items: requiredItems,
          type: orderType,
          totalDiscount: cartAmountSummary?.tda as number,
          totalPrice: cartAmountSummary?.tpwod as number,
          totalPriceAfterDiscount: cartAmountSummary?.tpwd as number,
          isDiscountCharge: cartAmountSummary?.isDeliveryCharged as boolean,
        };

        const orderCreatedInfo: {
          success: boolean;
          totalItemsInserted: number;
          orderId: string;
          type: string;
        } = await createOrder(requiredDataToOrder);

        if (orderCreatedInfo.type === "save") {
          toast.success("Cart saved successfully !");
          setTimeout(() => {
            dispatch(clearCartItems());
          }, 1000);
          router.push("/");

          return;
        }

        // payment process :
        const paymentProcessInfo = await paymentInitiator({
          userId: userId,
          ordereId: orderCreatedInfo.orderId,
        });

        if (!paymentProcessInfo.success) {
          toast.error(
            paymentProcessInfo.reason === "amount_too_small"
              ? "Amount must be greater than Rs: 200"
              : "issue in payment",
          );
          return;
        }

        toast.success(
          `For total: ${orderCreatedInfo.totalItemsInserted} products ordered created successfully`,
        );

        if (paymentProcessInfo.success) {
          window.location.href = paymentProcessInfo.url;
        }

        // dispatch(clearCartItems()); // clear the store if payment successed

        // handleToggleOpen();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        toast.error("Failed to create ordered !");
      } finally {
        if (type === "save_cart") {
          setSaveCartLoading((prevs) => !prevs);
        } else {
          setCheckOutLoading((prevs) => !prevs);
        }
      }
    } else {
      router.push("/auth/login?redirect=/cart");
      toast.info("Please, logged in before payment processed!");
    }
  };

  useEffect(() => {
    if (!alreadyNotify.current && allCartProducts?.totalItems != 0)
      if (isFromDb) {
        toast.info("This is your save cart. Please, processed for payment !");
        alreadyNotify.current = true;
      }
  }, [isFromDb, allCartProducts?.totalItems]);

  useEffect(() => {
    if (session?.user.id) {
      (async () => {
        const isSubscribed = await isUserSubscribed(session?.user.id as string);
        console.log("isSubscribed", isSubscribed);
        setSubscribed(!!isSubscribed);
      })();
    }
  }, [session?.user.id]);

  if (allCartProducts?.totalItems === 0) {
    return (
      <main className="bg-[#F5F9F0] min-h-screen">
        <div className="max-w-7xl  min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyCart />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F5F9F0] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className=" text-2xl sm:text-3xl font-bold
              text-gray-900"
            >
              Your cart
            </h1>

            <div className="flex  gap-2 justify-center items-center mt-0.5">
              {totalCartProducts ? (
                <p className="text-sm text-gray-500 ">
                  {totalCartProducts.totalItemsCart}{" "}
                  {totalCartProducts.totalItemsCart === 1 ? "item" : "items"}
                </p>
              ) : (
                ""
              )}

              {statusCart && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] mt-1
              font-medium text-black-700 bg-yellow-100 rounded-md px-2 py-0.5
              "
                >
                  {statusCart.type}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {!isSubscribed && <PushOptIn />}
            {totalCartProducts
              ? totalCartProducts?.totalItemsCart > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1.5 text-sm font-medium
                text-red-500 hover:text-red-700 px-3 py-2 rounded-sm
                hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                    Clear all
                  </button>
                )
              : ""}
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-sm border border-gray-100 p-1 w-fit">
          <button
            onClick={() => setViewMode("inventory")}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
              viewMode === "inventory"
                ? "bg-[#3B6D11] text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setViewMode("display")}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
              viewMode === "display"
                ? "bg-[#3B6D11] text-white"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Display
          </button>
        </div>

        {viewMode === "inventory" && (
          <div className="flex flex-col relative lg:flex-row gap-6 items-start">
            {inventoryItems.length > 0 ? (
              <>
                <div className="flex-1 min-w-0 w-full">
                  <div className="bg-white rounded-[8px] border border-gray-100 px-5">
                    {inventoryItems.map((item) => (
                      <CartRow key={item.productId} item={item} />
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-3 gap-3 mt-4">
                    {[
                      {
                        icon: <Truck size={15} className="text-gray-900" />,
                        label: "Free delivery",
                        sub: "On orders over $30",
                      },
                      {
                        icon: <RotateCcw size={15} className="text-gray-900" />,
                        label: "Easy returns",
                        sub: "Within 24 hours",
                      },
                      {
                        icon: <Shield size={15} className="text-gray-900" />,
                        label: "100% organic",
                        sub: "Certified farms",
                      },
                    ].map((b) => (
                      <div
                        key={b.label}
                        className="flex flex-col items-center text-center
                      bg-green-200 rounded-[8px] p-3 border border-gray-100 hover:shadow-sm duration-200"
                      >
                        <div className="mb-1.5">{b.icon}</div>
                        <p
                          className="text-xs font-semibold text-gray-700
                      leading-none"
                        >
                          {b.label}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1">
                          {b.sub}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-85 shrink-0 lg:sticky lg:top-25 ">
                  <div className="bg-white rounded-sm border hover:shadow-sm border-gray-100 p-5">
                    <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                      Order summary
                    </h2>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        {totalCartProducts && (
                          <span className="text-gray-500">
                            Subtotal (
                            {totalCartProducts?.totalItemsCart === 1
                              ? totalCartProducts?.totalItemsCart + " item"
                              : totalCartProducts?.totalItemsCart +
                                " items"}{" "}
                            )
                          </span>
                        )}
                        <span className="font-medium text-gray-900">
                          {cartAmountSummary?.tpwod}
                        </span>
                      </div>

                      {cartAmountSummary?.totalSaving
                        ? cartAmountSummary?.totalSaving > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-green-600">
                                Total savings
                              </span>
                              <span className="font-medium text-green-600">
                                Rs {cartAmountSummary.totalSaving.toFixed(2)}
                              </span>
                            </div>
                          )
                        : ""}

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Charge</span>
                        {cartAmountSummary && (
                          <span
                            className={`font-medium ${
                              !cartAmountSummary?.isDeliveryCharged
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {cartAmountSummary.isDeliveryCharged ? 100 : "Free"}
                          </span>
                        )}
                      </div>
                    </div>

                    {cartAmountSummary && (
                      <div className="border-t border-gray-100 pt-4 mb-4">
                        <div className="flex justify-between">
                          <span className="text-base font-bold text-gray-900">
                            Total
                          </span>
                          <div className="text-right">
                            <span className="text-xl font-bold text-gray-900">
                              Rs{" "}
                              {cartAmountSummary?.isDeliveryCharged
                                ? (cartAmountSummary.tpwd as number) + 100
                                : cartAmountSummary.tpwd}
                            </span>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Taxes included
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleToggleOpen()}
                        className="w-full flex items-center justify-center gap-2
                    bg-[#C8742A] hover:bg-[#A85E1C] text-white font-bold
                    text-sm py-4 rounded-sm transition-all duration-200
                    shadow-md hover:shadow-lg"
                      >
                        {checkOutLoading
                          ? "Payment processing..."
                          : "Proceed to checkout"}
                        {checkOutLoading ? "" : <ArrowRight size={16} />}
                      </button>
                      {!isFromDb && (
                        <button
                          onClick={() => handleCheckout("save_cart")}
                          className="w-full flex items-center justify-center gap-2
                    bg-[#2ac83a] hover:bg-[#1ca83d] text-white font-bold
                    text-sm py-4 rounded-sm transition-all duration-200
                    shadow-md hover:shadow-lg"
                        >
                          {saveCartLoading ? "saving cart..." : "Save Cart"}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      {["Visa", "MC", "Stripe", "GPay"].map((p) => (
                        <div
                          key={p}
                          className={`px-2 py-1 rounded-md border border-gray-100
                        bg-gray-50 text-[9px] font-bold text-gray-400 ${p === "Stripe" ? "text-white bg-green-600" : ""}`}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      Secure checkout powered by Stripe
                    </p>
                  </div>

                  <Link
                    href="/"
                    className="mt-4 flex items-center justify-center gap-1.5
                  text-sm text-green-700 hover:text-green-900 font-medium
                  transition-colors"
                  >
                    <Leaf size={13} />
                    Continue shopping
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="h-100 w-full flex justify-center items-center flex-col gap-2">
                <p className="text-gray-500">
                  no order for inventory products...
                </p>
                <Link href="/">
                  <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
                    Visit Home
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {viewMode === "display" && (
          <div className="space-y-6">
            {Object.entries(displayGroups).map(([vendorId, items]) => {
              const summary = calculateGroupSummary(items);
              return (
                <div
                  key={vendorId}
                  className="bg-white rounded-[8px] border border-gray-100 overflow-hidden"
                >
                  <div className="px-5 pt-4 pb-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      Vendor order
                    </p>
                  </div>

                  <div className="px-5">
                    {items.map((item) => (
                      <CartRow key={item.productId} item={item} />
                    ))}
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        Rs {summary.subtotal.toFixed(2)}
                      </span>
                    </div>
                    {summary.totalSaving > 0 && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600">Total savings</span>
                        <span className="font-medium text-green-600">
                          Rs {summary.totalSaving.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                      <span>Total</span>
                      <span>Rs {summary.total.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={() => handlePlaceDisplayOrder(vendorId, items)}
                      disabled={placingOrderFor === vendorId}
                      className="w-full mt-4 flex items-center justify-center gap-2
                        bg-[#2ac847] hover:bg-[#1ca81e] text-white font-bold
                        text-sm py-4 rounded-sm transition-all duration-200
                        shadow-md hover:shadow-lg disabled:opacity-60"
                    >
                      {placingOrderFor === vendorId
                        ? "Placing order..."
                        : "Place order"}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      No payment collected now — settle directly with the vendor
                      on delivery.
                    </p>
                  </div>
                </div>
              );
            })}

            {Object.keys(displayGroups).length === 0 && (
              <div className="h-[50vh] w-full flex justify-center items-center flex-col gap-2">
                <p className="text-gray-500">
                  no order for display products...
                </p>
                <Link href="/">
                  <button className="px-3 py-2 bg-green-500 hover:bg-green-700 duration-100 text-white rounded-sm">
                    Visit Home
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        <LocationDialog
          toggleDialog={handleToggleOpen}
          dialogStatus={open}
          handleCheckOut={(data) => handleCheckout(data)}
          handleCheckLoading={() => setCheckOutLoading((prevs) => !prevs)}
        />
      </div>
    </main>
  );
}
