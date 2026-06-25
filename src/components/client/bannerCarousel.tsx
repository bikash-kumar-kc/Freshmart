"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useGetFeaturedProducts } from "@/src/hooks/usePromotionProducts";
import { ProductCard } from "./ProductCard";
import BannerProductCard from "../server/bannerCard";

const BannerCarousel = () => {
  const { data: FeaturedProducts } = useGetFeaturedProducts();

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {FeaturedProducts?.map((prod, index) => {
          // const { id, name, price, unit, image, alt } = prod;
          return (
            <CarouselItem
              key={index}
              className="basis-full w-300 h-125 rounded-2xl"
            >
              <div
                className={` w-full h-full flex justify-center items-center rounded-2xl `}
              >
                <Image
                  src={prod.thumbnail}
                  width={1280}
                  height={20}
                  alt={prod.thumbnail as string}
                  className={`h-full object-cover rounded-2xl`}
                  priority={index == 0}
                />

                <div className="relative py-10 bg-red-500">
                  <div className="absolute left-8 -top-25">
                    <BannerProductCard
                      thumbnail={prod.images[0]}
                      productName={prod.name}
                      category={prod.category}
                      slug={prod.slug}
                      isFeatured={prod.isFeatured}
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />

      <CarouselNext className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />
    </Carousel>
  );
};

export default BannerCarousel;
