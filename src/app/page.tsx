"use client";
import Image from "next/image";
import SearchBar from "../components/client/SearchBar";
import Header from "../components/server/Header";
import { SessionProvider } from "next-auth/react";
import NotificationPanel from "../components/server/notificationPanel";
import { useCallback, useState } from "react";
import BannerCarousel from "../components/client/bannerCarousel";
import ImageSlider from "../components/client/messageBanner";
import OrganicProductCards from "../components/client/ProductCard";
import HoverRevealCard from "../components/client/NormalProduct";
import BlogCard from "../components/client/BlogCard";
import { blogs } from "../constants/blog.dummy";
import Footer from "../components/server/Footer";

export default function Home() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenNotificationPanel = useCallback(() => {
    setIsOpen((prevs) => !prevs);
  }, []);
  return (
    <div className="w-full flex flex-col flex-1 items-center  bg-amber-50 font-sans">
      <SessionProvider>
        {" "}
        <Header handleNotificationPanelOpen={handleOpenNotificationPanel} />
        <NotificationPanel isOpen={isOpen} />
        <main className="w-full max-w-7xl mx-auto mt-10">
          {/* // banner */}
          <BannerCarousel />
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

       
          <Footer/>

      </SessionProvider>
    </div>
  );
}
