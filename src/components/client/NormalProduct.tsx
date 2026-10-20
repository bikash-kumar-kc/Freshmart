"use client";
import { CATEGORIES } from "@/src/app/categories/categories";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  image: string;
  name: string;
  cat: string;
  productId:string;
};

export default function HoverRevealCard({
  image,
  name,
  cat,
  productId,
}: ProductCardProps) {
  const { slug } = CATEGORIES.find((c) => c.dbName === cat) as { slug: string };
  
  return (
    <Link href={`/categories/${slug}/${productId}`} className="block w-full sm:w-60">
  <div className="group relative w-full overflow-hidden rounded-sm flex flex-col gap-1">
    <div className="relative aspect-square w-full">
          <Image
            src={
              "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80"
            }
            alt={name}
            fill
           sizes="(max-width: 640px) 55vw, 240px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </div>

        {/* Sliding Box */}
        <div
        //   className="
        //   absolute inset-x-0 bottom-0
        //   translate-y-full
        //   bg-green-800 backdrop-blur-sm
        //   px-3 py-2
        //   transition-transform duration-300 ease-out
        //   group-hover:translate-y-0
        // "
        // className=""
        >
          <h3 className="text-lg font-semibold text-center text-green-700 line-clamp-1">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
