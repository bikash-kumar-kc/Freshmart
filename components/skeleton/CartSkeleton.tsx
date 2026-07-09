export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden rounded-sm bg-gray-200 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

export const CartRowSkeleton = () => (
  <div className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0">
    <Skeleton className="w-24 h-24 rounded-md shrink-0" />

    <div className="flex-1 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-24" />

      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  </div>
);