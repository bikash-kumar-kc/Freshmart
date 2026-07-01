"use client";
import { useState } from "react";
import Image from "next/image";

const images = [
  "/info_banner_01.png",
  "/info_banner_02.png",
  "/info_banner_03.png",
  "/info_banner_04.png",
  "/info_banner_05.png",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full my-8 ">
      {/* Image */}
      <div className="relative w-full h-37.5 shadow-md">
        <Image
          src={images[current]}
          alt={`image-${current}`}
          fill
          className="object-cover rounded-sm"
          priority={false}
        />
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
              current === index ? "bg-green-600 scale-125" : "border border-green-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
