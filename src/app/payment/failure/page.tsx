import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-10 shadow-xl text-center animate-fade-up">
       

        <h1 className="text-3xl font-bold text-red-400 animate-fade-up">
          Payment Failed
        </h1>

        <p className="mt-4 text-gray-600 leading-relaxed animate-fade-up">
          Problem on payment. Please, do as follow.
        </p>

        <div className="mt-8 space-y-3 ">
          <Link
            href="/checkout"
            className="block w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 animate-fade-up"
          >
            Try Again
          </Link>

          <Link
            href="/support"
            className="block w-full rounded-xl border-2 border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50 animate-fade-up"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </main>
  );
}