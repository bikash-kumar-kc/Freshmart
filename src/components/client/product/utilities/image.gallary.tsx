import { useAppSelector } from "@/src/store/hook";
import { selectIsFavorite } from "@/src/store/faviourites/selectors";
import Image from "next/image";
import { useRef, useState } from "react";
import { HeartIcon } from "../../PopularCard";

export const ImageGallery = ({
  images,
  name,
  id,
}: {
  images: string[];
  name: string;
  id:string;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = mainRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

const spinachImages = [
  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
 
];
const isFavorite = useAppSelector(selectIsFavorite(id));
  return (
    <div className="flex flex-col gap-3">

      <div
        ref={mainRef}
        className="relative w-full aspect-4/3 rounded-md overflow-hidden
          bg-green-50 cursor-zoom-in border border-green-100"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={spinachImages[activeIdx]}
          alt={`${name} — image ${activeIdx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-200"
          style={{
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: zoomed ? "scale(1.8)" : "scale(1)",
          }}
        />

         {isFavorite && (
                  <span
                    className={`absolute top-0 right-1  text-white text-xs font-boldpx-2 py-1 rounded-bl-lgshadow-md`}
                  >
                    <HeartIcon filled={true} />
                  </span>
                )}

        {/* zoom hint */}
        {!zoomed && (
          <div
            className="absolute bottom-3 right-3 bg-black/40 text-white
            text-[10px] px-2 py-1 rounded-lg backdrop-blur-sm"
          >
            Hover to zoom
          </div>
        )}
      </div>

      {/* horizontal thumbnail strip */}
      {spinachImages.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin
          scrollbar-thumb-green-200"
        >
          {spinachImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`
                relative shrink-0 w-16 h-16 rounded-sm overflow-hidden
                border-2 transition-all duration-150
                ${
                  i === activeIdx
                    ? "border-green-600 ring-1 ring-green-400"
                    : "border-transparent hover:border-green-300"
                }
              `}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
