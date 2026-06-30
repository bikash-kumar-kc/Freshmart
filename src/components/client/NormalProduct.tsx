"use client";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  image: string;
  name: string;
  cat: string;
};


function toSlug(str:string):string {
  return str
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function HoverRevealCard({
  image,
  name,
  cat,
}: ProductCardProps) {
  const slug = toSlug(cat)
  return (
    <Link href={`/categories/${slug}`}>
      <div className="group relative w-40 overflow-hidden rounded-x">
        {/* Image */}
        <div className="relative h-40 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Sliding Box */}
        <div
          className="
          absolute inset-x-0 bottom-0
          translate-y-full
          bg-green-800 backdrop-blur-sm
          px-3 py-2
          transition-transform duration-300 ease-out
          group-hover:translate-y-0
        "
        >
          <h3 className="text-md font-semibold text-center text-gray-100">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
