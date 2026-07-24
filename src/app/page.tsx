"use client";
import { Suspense } from "react";
import ImageSlider from "../components/client/messageBanner";
import BannerCarouselSkeleton from "@/components/skeleton/BannerCarouselSkeleton";
import BannerCarousel from "../components/client/bannerCarousel";
import PaginationComponent from "../components/client/pagination/Pagination";
import ProductsCategories from "../components/client/product/ProductsCategories/ProductsCategories";
import ProductsSuspenseFallback from "../components/client/product/ProductsCategories/Fallback";
import SpecialProductsSkeleton from "@/components/skeleton/SpecialProductSkeleton";
import OfferedProducts from "../components/client/product/OfferedProducts";
import PopularProducts from "../components/client/product/PopularProducts";
import NotificationLayout from "../components/client/NotificationLayout";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1 items-center  bg-amber-50 ">
       
          <NotificationLayout />
          <main className="w-full max-w-7xl mx-auto mt-10">
            <Suspense fallback={<BannerCarouselSkeleton />}>
              <BannerCarousel />
            </Suspense>

            <ImageSlider />

            <Suspense fallback={<SpecialProductsSkeleton />}>
              <PopularProducts />
            </Suspense>

            <Suspense fallback={<SpecialProductsSkeleton />}>
              <OfferedProducts />
            </Suspense>

            <Suspense fallback={<ProductsSuspenseFallback />}>
              <ProductsCategories />
            </Suspense>
          </main>
          <Suspense fallback={<p>loading...</p>}>
            <PaginationComponent />
          </Suspense>
    </div>
  );
}
