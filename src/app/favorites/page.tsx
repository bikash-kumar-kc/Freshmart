"use client";
import { useAppDispatch, useAppSelector } from "@/src/store/hook";
import { selectFavorites } from "@/src/store/faviourites/selectors";
import { IFavoriteProductData } from "./types/favorite.type";
import { useEffect, useState } from "react";
import { getProductBySlug } from "@/src/lib/api calls/client/products/getProductBySlug";
import { clearFavorites, removeFavorite } from "@/src/store/faviourites/slice";
import { Trash2 } from "lucide-react";
import { EmptyFavorites } from "./EmptyState";
import { FavoriteCardSkeleton } from "@/components/skeleton/FavoriteSkeleton";
import { FavoriteCard } from "./FavoriteCard";
import GoBackButton from "@/src/components/client/buttons/GotoBackBtn";
import { ProductCard } from "@/src/components/client/product/unifiedProductCard/UnifiedProductCard";
import { fromFlatProduct } from "@/src/components/client/product/unifiedProductCard/normalizeProduct";

const FavoritePage = () => {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector(selectFavorites);

  const [productData, setProductData] = useState<IFavoriteProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [failedIds, setFailedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!favoriteItems || favoriteItems.length === 0) {
      setProductData([]);
      return;
    }

    setLoading(true);

    Promise.all(
      favoriteItems.map((item) => getProductBySlug({ slug: item.slug })),
    ).then((results) => {
      const failed = favoriteItems
        .filter((_, i) => results[i] === null)
        .map((item) => item.productId);

      setFailedIds(failed);

      const products = results.map((e) => e.product);

      setProductData(products);
      setLoading(false);
    });
  }, [favoriteItems?.length, favoriteItems]);

  const handleRemove = (id: string) => {
    dispatch(removeFavorite({ productId: id }));
    setProductData((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAll = () => {
    dispatch(clearFavorites());
    setProductData([]);
    setFailedIds([]);
  };

  const count = favoriteItems?.length;

  return (
    <main className="bg-[#F5F9F0] min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <GoBackButton />

          {count
            ? count > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 text-sm font-medium
                text-red-500 hover:text-red-700 px-3 py-2 rounded-sm
                hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Clear all
                </button>
              )
            : ""}
        </div>

        {count === 0 && <EmptyFavorites />}

        {/* skeletons while loading */}
        {loading && count && count > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {Array.from({ length: count }).map((_, i) => (
              <FavoriteCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* failed notice */}
        {!loading && failedIds.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            {failedIds.length} product{failedIds.length > 1 ? "s" : ""} could
            not be loaded and may no longer be available.
          </p>
        )}

        {/* grid */}
        {!loading && productData.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            xl:grid-cols-5 gap-3 sm:gap-4"
          >
            {productData.map((product) => (
              // <FavoriteCard
              //   key={product.id}
              //   product={product}
              //   onRemove={handleRemove}
              // />
              <ProductCard
                key={product.id}
                product={fromFlatProduct(product)}
                mode="favorite"
                onRemoveFavorite={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default FavoritePage;
