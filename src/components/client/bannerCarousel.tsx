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
      <CarouselContent>
        {FeaturedProducts?.map((prod, index) => {
        
          return (
            <CarouselItem
  key={index}
  className="basis-full w-300 h-125 rounded-2xl"
>
  <div className="relative w-full h-full rounded-2xl overflow-hidden">
    <Image
      src="/pic_2_banner.jpg"
      alt={prod.thumbnail as string}
      fill
      priority={index === 0}
      sizes="1200px"
      className="object-cover rounded-2xl"
    />

    <div className="absolute left-8 top-1/2 -translate-y-8 z-10">
      {/* <BannerProductCard
        thumbnail=""
        productName={prod.name}
        category={prod.category}
        slug={prod.slug}
        isFeatured={prod.isFeatured}
        weightValue={prod.weightValue!}
        weightUnit={prod.weightUnit!}
        price={prod.price!}
        productId={prod.productId}
        stock={prod.stock}
      /> */}

      <ProductCard product={fromFlatProduct(prod)} />
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
