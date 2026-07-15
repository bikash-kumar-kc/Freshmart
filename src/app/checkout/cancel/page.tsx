import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        {/* cancel icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Payment cancelled
        </h1>
        <p className="text-gray-500">
          No charge was made. Your cart is still saved — you can try again
          whenever you will ready.
        </p>

        <div className="flex gap-3 mt-2">
          <Link
            href="/cart"
            className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
          >
            Back to cart
          </Link>
          <Link
            href="/"
            className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}