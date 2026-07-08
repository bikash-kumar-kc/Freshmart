
import Link from "next/link";

interface Props {
  searchParams: { session_id?: string };
}

export default async function SuccessPage(orderId:string) {
  // const sessionId = searchParams.session_id;

  // if (!sessionId) redirect("/");

  // const stripe: Stripe | undefined = getStripeClient();

  // if (!stripe) {
  //   redirect("/");
  // }

  // let session: Stripe.Checkout.Session;
  // try {
  //   session = await stripe.checkout.sessions.retrieve(sessionId);
  // } catch {
  //   redirect("/");
  // }

  // if (session.payment_status !== "paid") {
  //   redirect("/checkout/cancel");
  // }

  // const total = session.amount_total
  //   ? (session.amount_total / 100).toFixed(2)
  //   : "0.00";

  // const paymentIntentId = session.payment_intent as string;

  // let order: { id: string } | undefined;
  // try {
  //   order = await db
  //     .select({ id: orderHistory.id })
  //     .from(orderHistory)
  //     .where(eq(orderHistory.stripePaymentId, paymentIntentId))
  //     .get();
  // } catch {
  //   console.error("Failed to get order !");
  //   order = undefined;
  // }

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
          Your payment of{" "}
          <span className="font-medium text-gray-900">${total}</span> was
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
              href="/orders"
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
