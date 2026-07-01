"use client";
import Header from "../components/server/Header";
import { SessionProvider } from "next-auth/react";
import NotificationPanel from "../components/server/notificationPanel";
import { Suspense, useCallback, useState } from "react";
import ImageSlider from "../components/client/messageBanner";
import OrganicProductCards from "../components/client/ProductCard";
import Footer from "../components/server/Footer";
import BannerCarouselSkeleton from "@/components/skeleton/BannerCarouselSkeleton";
import BannerCarousel from "../components/client/bannerCarousel";
import PaginationComponent from "../components/client/pagination/Pagination";
import ProductsCategories from "../components/client/product/ProductsCategories/ProductsCategories";
import ProductsSuspenseFallback from "../components/client/product/ProductsCategories/Fallback";
import SpecialProductsSkeleton from "@/components/skeleton/SpecialProductSkeleton";
import OfferedProducts from "../components/client/product/OfferedProducts";
import PopularProducts from "../components/client/product/PopularProducts";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenNotificationPanel = useCallback(() => {
    setIsOpen((prevs) => !prevs);
  }, []);

  return (
    <div className="w-full flex flex-col flex-1 items-center  bg-amber-50 ">
      <SessionProvider>
        {" "}
        <Header handleNotificationPanelOpen={handleOpenNotificationPanel} />
        <NotificationPanel isOpen={isOpen} />
        <main className="w-full max-w-7xl mx-auto mt-10">
          {/* // banner */}

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


          {/* <section>
            <h2 className="text-xl font-semibold mb-4">
              Healthy Living Journal
            </h2>
          </section> */}
        </main>
        <Suspense fallback={<p>loading...</p>}>
          <PaginationComponent />
        </Suspense>
        <Footer />
      </SessionProvider>
    </div>
  );
}
