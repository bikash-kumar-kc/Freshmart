export default function BannerCarouselSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl h-125 w-full bg-gray-200">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_4s_infinite] bg-linear-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
