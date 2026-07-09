export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-sm ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
  </div>
);

export const OrderCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="h-4 w-36" />
      </div>

      {/* Body */}
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end px-5 py-3 border-t border-gray-100">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};
