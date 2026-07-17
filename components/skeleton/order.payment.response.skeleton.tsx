export default function OrderPaymentResponseSkeleton() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 animate-pulse">
      <div className="flex flex-col items-center gap-4 max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-gray-200" />

        {/* Title */}
        <div className="h-8 w-52 rounded-md bg-gray-200" />

        {/* Description */}
        <div className="space-y-2 w-full">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-4/5 mx-auto rounded bg-gray-200" />
        </div>

        {/* Note */}
        <div className="h-3 w-3/4 rounded bg-gray-200 mt-2" />

        {/* Buttons */}
        <div className="flex gap-3 mt-4 w-full justify-center">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
          <div className="h-10 w-40 rounded-lg bg-gray-200" />
        </div>
      </div>
    </main>
  );
}