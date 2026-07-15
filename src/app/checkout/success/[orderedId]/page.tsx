"use client";
import { clearCartItems } from "@/src/store/carts/slice";
import { useAppDispatch } from "@/src/store/hook";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const SuccessPage = ()=>{
 const params = useParams<{ orderedId: string }>();
  const orderId = params.orderedId;
  const useEffectCalledRef = useRef<boolean | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!useEffectCalledRef.current)
      if (orderId) {
        dispatch(clearCartItems());
        useEffectCalledRef.current = true;
      }
  }, [orderId, dispatch]);

  if (!orderId) {
    return (
      <div className="w-full max-w-7xl m-auto bg-amber-50">
        <div className="w-full min-h-screen flex justify-center items-center">
          <p className="text-gray-500">OrderId not found !</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        {/* success icon */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">Order placed!</h1>
        <p className="text-gray-500">
          Your payment was
          successful. Your order is being processed.
        </p>

        {/* order note — webhook writes the order async */}
        <p className="text-sm text-gray-400">
          You will find your order in Order History shortly.
        </p>

        {orderId ? (
          <div className="flex gap-3 mt-2">
            <Link
              href="/orders"
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
            >
              View orders
            </Link>
            <Link
              href="/"
              className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div>
            <p>Your order is processing...</p>
            <Link
              href="/orderstatus"
              className="px-4 py-2 bg-orange-400 text-white text-sm rounded-lg hover:bg-orange-300 transition"
            >
              Visit to order history
            </Link>
            <p className="text-red-800 text-[8px]">
              If you did not see order placed, please contact to customer
              support !!!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}


const Page = () => {
 return (
    <Suspense fallback={<p>payment success page is loading...</p>}>
        <SuccessPage/>
    </Suspense>
 )
};

export default Page;