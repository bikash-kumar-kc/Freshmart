import Image from "next/image";
import React from "react";

const ImageComponent = ({isSignedIn=false}:{isSignedIn?:boolean}) => {
  return (
    <div className="hidden lg:flex lg:w-[60%] bg-amber-500 relative overflow-hidden group">
      {/* Image — brightness-50 by default, brightens to 100 on hover */}
      <Image
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=85"
        alt="Woman carrying organic vegetable basket"
        fill
        className="w-full h-full object-cover brightness-50 group-hover:brightness-100 transition-all duration-300"
        priority
      />

      {/* Gradient — fades out on hover along with brightness change */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent group-hover:from-black/20 transition-all duration-300" />

      {/* Tagline overlay */}
      <div className={`absolute bottom-10 ${isSignedIn ? 'left-10':'right-10'}  animate-fade-up`}>
        <p className="text-white text-2xl font-semibold leading-snug">
          Fresh from the farm,
          <br />
          straight to your door.
        </p>
        <p className="text-white/70 text-sm mt-2">
          Organic. Local. Delivered fast.
        </p>
      </div>
    </div>
  );
};

export default ImageComponent;
