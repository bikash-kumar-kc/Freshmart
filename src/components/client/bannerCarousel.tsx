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


const groceryImages = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1600&h=900&q=80",
];

const BannerCarousel = () => {
  
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent>
        {groceryImages.map((img, index) => (
          <CarouselItem key={index} className="basis-full w-300 h-125 rounded-2xl">
            <div className={` w-full h-full flex justify-center items-center rounded-2xl `}>
              <Image
                src={img}
                width={1280}
                height={20}
                alt={img as string}
                className={`h-full object-cover rounded-2xl`}
                priority={index == 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />

      <CarouselNext className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300" />
    </Carousel>
  );
};

export default BannerCarousel;
