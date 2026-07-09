import {
  OrderCardSkeleton,
  Skeleton,
} from "@/components/skeleton/OrderSkeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-amber-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>

            <Skeleton className="h-5 w-36" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-28" />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
