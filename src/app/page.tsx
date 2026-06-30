"use client";
import Header from "../components/server/Header";
import { SessionProvider } from "next-auth/react";
import NotificationPanel from "../components/server/notificationPanel";
import { Suspense, useCallback, useState } from "react";
import ImageSlider from "../components/client/messageBanner";
import OrganicProductCards from "../components/client/ProductCard";
import HoverRevealCard from "../components/client/NormalProduct";
import Footer from "../components/server/Footer";
import BannerCarouselSkeleton from "@/components/skeleton/BannerCarouselSkeleton";
import BannerCarousel from "../components/client/bannerCarousel";
import PaginationComponent from "../components/client/pagination/Pagination";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenNotificationPanel = useCallback(() => {
    setIsOpen((prevs) => !prevs);
  }, []);

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const categories = searchParams.get("categories");
  console.log(page);
  console.log(categories);
  return (
    <div className="w-full flex flex-col flex-1 items-center  bg-amber-50 font-sans">
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

          <OrganicProductCards types={"Popular Now"} />
          <OrganicProductCards types={"Offers"} />
          <div className="flex flex-wrap gap-15 mt-4 w-full justify-cente">
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
            <HoverRevealCard
              image={
                "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
              }
              name={"Hass avocados"}
            />
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Healthy Living Journal
            </h2>
          </section>
        </main>
        <PaginationComponent />
        <Footer />
      </SessionProvider>
    </div>
  );
}
