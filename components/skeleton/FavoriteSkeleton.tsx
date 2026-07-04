export function FavoriteCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-4/3 bg-gray-100" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded-xl mt-1" />
      </div>
    </div>
  );
}