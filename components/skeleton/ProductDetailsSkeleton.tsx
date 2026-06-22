export default function ProductDetailSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <main className="flex flex-col  min-h-screen">
        <div className=" px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
          {/* Back button */}
          <div className="h-9 w-24 bg-gray-200 rounded-lg mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div>
              <div className="aspect-4/3 w-full rounded-md bg-gray-200 border border-gray-100 px-10 py-10" />

              <div className="flex gap-2 mt-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-xl bg-gray-200 shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title */}
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-3" />

              {/* Farm name */}
              <div className="h-3 w-40 bg-gray-200 rounded mb-4" />

              {/* Freshness badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 w-16 rounded-full bg-gray-200" />
                <div className="h-6 w-24 rounded-full bg-gray-200" />
                <div className="h-6 w-20 rounded-full bg-gray-200" />
              </div>

              {/* Price card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
                <div className="h-9 w-28 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex-1 h-[54px] rounded-2xl bg-gray-200" />
                <div className="flex-1 h-[54px] rounded-2xl bg-gray-200" />
              </div>

              {/* Description */}
              <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-6 lg:p-8">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                  <div className="h-4 bg-gray-200 rounded w-4/6" />
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-5">
              <div className="h-7 w-60 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm border border-gray-100 overflow-hidden"
                >
                  {/* Same aspect ratio as RelatedProductCard */}
                  <div className="aspect-4/3 bg-gray-200" />

                  <div className="p-3">
                    <div className="h-10 w-50 bg-gray-200 rounded mb-2" />

                    <div className="h-4 w-full bg-gray-200 rounded mb-1" />

                    <div className="flex gap-2 mt-3">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                      <div className="h-4 w-12 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
