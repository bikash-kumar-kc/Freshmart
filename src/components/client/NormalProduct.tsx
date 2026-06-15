import Image from "next/image";

type ProductCardProps = {
  image: string;
  name: string;
};

export default function HoverRevealCard({
  image,
  name,
}: ProductCardProps) {
  return (
    <div className="group relative w-40 overflow-hidden rounded-xl ">
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
  );
}