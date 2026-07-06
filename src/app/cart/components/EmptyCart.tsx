import { Leaf, ShoppingBag } from "lucide-react";
import Link from "next/link";

function EmptyCart() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-20 px-4">
      <div
        className="w-20 h-20 rounded-full bg-green-100 flex items-center
        justify-center mb-5"
      >
        <ShoppingBag size={32} className="text-green-600" />
      </div>
      <h2 className="font-serif text-xl font-semibold text-gray-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-7">
        Looks like you have not added anything yet. Browse our organic products
        and fill your cart with freshness.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800
          text-white text-sm font-semibold px-6 py-3 rounded-2xl
          transition-colors"
      >
        <Leaf size={16} />
        Start shopping
      </Link>
    </div>
  );
}

export default EmptyCart;
