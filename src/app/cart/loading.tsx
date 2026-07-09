import { CartRowSkeleton } from "@/components/skeleton/CartSkeleton";
import { Skeleton } from "@/components/skeleton/OrderSkeleton";


export default function Loading() {
  return (
    <main className="bg-[#F5F9F0] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          <Skeleton className="h-10 w-28" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-lg border border-gray-100 px-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <CartRowSkeleton key={i} />
              ))}
            </div>

            {/* Benefits */}
            <div className="grid lg:grid-cols-3 gap-3 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-green-200 rounded-lg border border-gray-100 p-4 flex flex-col items-center"
                >
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24 mt-3" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:w-85 shrink-0">
            <div className="bg-white rounded-sm border border-gray-100 p-5">
              <Skeleton className="h-6 w-40 mb-6" />

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div className="flex justify-between" key={i}>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-5 pt-5">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-3 w-20 ml-auto" />
                  </div>
                </div>
              </div>

              <Skeleton className="h-12 w-full mt-6" />
              <Skeleton className="h-12 w-full mt-3" />

              <div className="flex justify-center gap-2 mt-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-12" />
                ))}
              </div>

              <Skeleton className="h-3 w-40 mx-auto mt-3" />
            </div>

            <div className="flex justify-center mt-4">
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
