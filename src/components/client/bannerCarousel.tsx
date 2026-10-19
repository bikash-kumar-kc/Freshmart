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
// import BannerProductCard from "../server/bannerCard";
import { ProductCard } from "./product/unifiedProductCard/UnifiedProductCard";
import { fromFlatProduct } from "./product/unifiedProductCard/normalizeProduct";

const BannerCarousel = () => {
  const { data: FeaturedProductsResponse } = useGetFeaturedProducts();
  const FeaturedProducts = FeaturedProductsResponse?.featuredProducts;

  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className="ml-0 sm:-ml-4">
        {FeaturedProducts?.map((prod, index) => {
          return (
            <CarouselItem key={index} className="basis-full pl-0 sm:pl-4 h-125">
              <div className="relative w-full h-full overflow-hidden rounded-none lg:rounded-[10px]">
                <Image
                  src="/pic_2_banner.jpg"
                  alt={prod.thumbnail as string}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover rounded-none lg:rounded-[10px]"
                />

                <div className="z-10 origin-bottom-left  absolute left-8 bottom-5 flex gap-4">
                  <ProductCard product={fromFlatProduct(prod)} />
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="hidden md:inline-flex border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />
      <CarouselNext className="hidden md:inline-flex border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />
    </Carousel>
  );
};

export default BannerCarousel;
