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
  totalCalculation,
  totalItemsCart,
} from "@/src/store/carts/selectors";
import EmptyCart from "./components/EmptyCart";
import CartRow from "./components/CartRow";
import { clearCartItems } from "@/src/store/carts/slice";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IOrderItem } from "@/src/db/schema";
import {
  createOrder,
  ItemTypes,
} from "@/src/lib/server actions/product.server.action";

export default function CartPage() {
  // state...
  const totalCartProducts = useAppSelector(totalItemsCart);
  const allCartProducts = useAppSelector(getAllItemsFromCart);
  const cartAmountSummary = useAppSelector(totalCalculation);
  const dispatch = useAppDispatch();

  // router
  const router = useRouter();

  // user session...

  const { data: session, status } = useSession();
  const handleClearAll = () => {
    dispatch(clearCartItems());
    toast.success("Cart Clear successfully.");
  };

  const handleCheckout = async (type: "save_cart" | "process_checkout") => {
    if (status === "authenticated") {
      try {
        if (!allCartProducts) return;
        toast.info("User is logged in");
        const requiredItems: {
          productId: string;
          weightValue: number;
          weightUnit: "g" | "kg" | "ml" | "l";
          quantity: number;
        }[] = allCartProducts.items.map((i) => {
          return {
            productId: i.productId,
            weightValue: i.varient.weightValue,
            weightUnit: i.varient.weightUnit as "g" | "kg" | "ml" | "l",
            quantity: i.quantity,
          };
        });

        const userId = session.user.id!;

        const requiredDataToOrder = {
          userId: userId,
          items: requiredItems,
        };

        const orderCreatedInfo: {
          success: boolean;
          totalItemsInserted: number;
        } = await createOrder(requiredDataToOrder);

        if (type === "save_cart") {
          toast.success("Cart saved successfully !");
          return;
        }
        toast.success(
          `For total: ${orderCreatedInfo.totalItemsInserted} products ordered created successfully`,
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }

        toast.error("Failed to create ordered !");
      }
    } else {
      router.push("/auth/login?redirect=/cart");
      toast.info("Please, logged in before payment processed!");
    }
  };

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

            {totalCartProducts ? (
              <p className="text-sm text-gray-500 mt-0.5">
                {totalCartProducts.totalItemsCart}{" "}
                {totalCartProducts.totalItemsCart === 1 ? "item" : "items"}
              </p>
            ) : (
              ""
            )}
          </div>
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

        <div className="flex flex-col relative lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white rounded-[8px] border border-gray-100 px-5">
              {allCartProducts?.items.map((item) => (
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
                  <p className="text-[10px] text-gray-600 mt-1">{b.sub}</p>
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
                        : totalCartProducts?.totalItemsCart + " items"}{" "}
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
                        <span className="text-green-600">Total savings</span>
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
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2
                  bg-[#C8742A] hover:bg-[#A85E1C] text-white font-bold
                  text-sm py-4 rounded-sm transition-all duration-200
                  shadow-md hover:shadow-lg"
                >
                  Proceed to checkout
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => handleCheckout("save_cart")}
                  className="w-full flex items-center justify-center gap-2
                  bg-[#2ac83a] hover:bg-[#1ca83d] text-white font-bold
                  text-sm py-4 rounded-sm transition-all duration-200
                  shadow-md hover:shadow-lg"
                >
                  Save Cart
                </button>
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
        </div>
      </div>
    </main>
  );
}
