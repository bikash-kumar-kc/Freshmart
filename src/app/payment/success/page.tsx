import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-sm bg-white p-10 shadow-xl text-center animate-fade-up">
       
        <h1 className="text-3xl font-bold text-green-700 animate-fade-up">
          Payment Successful
        </h1>

       <p className="text-gray-500 animate-fade-up">Thank you for trusting us !</p>

        <div className="mt-8 space-y-3 animate-fade-up group">
          <Link
            href="/"
            className="block w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Visit Your Order Status
          </Link>

          <p className="text-sm text-gray-400 group-hover:text-gray-700 duration-300">
            A confirmation email will be sent to you shortly.
          </p>
        </div>
      </div>
    </main>
  );
}