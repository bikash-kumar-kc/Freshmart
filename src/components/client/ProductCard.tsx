import Image from "next/image";
import { useState } from "react";

interface IPRODUCTTYPE{
    id:number,
    name:string,
    price:number,
    unit:string,
    image:string,
    alt:string
}

const products = [
  {
    id: 1,
    name: "Hass avocado",
    price: 1.29,
    unit: "per piece",
    image:
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80",
    alt: "Hass avocados",
  },
  {
    id: 2,
    name: "Baby spinach",
    price: 4.99,
    unit: "142g bag",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
    alt: "Baby spinach leaves",
  },
  {
    id: 3,
    name: "Cherry tomatoes",
    price: 5.49,
    unit: "250g",
    image:
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&q=80",
    alt: "Cherry tomatoes",
  },
  {
    id: 4,
    name: "Rainbow carrots",
    price: 3.29,
    unit: "500g bunch",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80",
    alt: "Rainbow carrots",
  },
  {
    id: 1,
    name: "Hass avocado",
    price: 1.29,
    unit: "per piece",
    image:
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=600&q=80",
    alt: "Hass avocados",
  },
  {
    id: 2,
    name: "Baby spinach",
    price: 4.99,
    unit: "142g bag",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80",
    alt: "Baby spinach leaves",
  },
  {
    id: 3,
    name: "Cherry tomatoes",
    price: 5.49,
    unit: "250g",
    image:
      "https://images.unsplash.com/photo-1561136594-7f68413baa99?w=600&q=80",
    alt: "Cherry tomatoes",
  },
  {
    id: 4,
    name: "Rainbow carrots",
    price: 3.29,
    unit: "500g bunch",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&q=80",
    alt: "Rainbow carrots",
  },
];

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function HeartIcon({ filled }:{filled:boolean}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "#D85A30" : "none"}
      stroke={filled ? "#D85A30" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ProductCard({ product }: { product: IPRODUCTTYPE }) {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  function handleCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className=" bg-white border border-black/10 rounded-md overflow-hidden flex flex-col
    transition-transform duration-200 ease-out
    hover:scale-[1.02]">
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          className="object-cover"
        />

        {/* Wishlist */}
        <button
          onClick={() => setWished((w) => !w)}
          aria-label={
            wished ? "Remove from wishlist" : "Add to wishlist"
          }
          className="
            absolute top-2.5 right-2.5
            w-8 h-8
            rounded-full
            bg-white/90
            flex items-center justify-center
            text-[#555]
            cursor-pointer
            p-0
          "
        >
          <HeartIcon filled={wished} />
        </button>

<div className="absolute left-1 top-2 flex flex-col items-end gap-1">
          <span
            className="
              bg-[rgba(27,52,4,0.82)]
              text-[#e02209]
              text-[10px]
              font-medium
              px-[9px]
              py-[3px]
              rounded-full
              tracking-[0.3px]
            "
          >
            Offer 
          </span>

        </div>
        {/* Overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-col items-end gap-1">
          <span
            className="
              bg-[rgba(27,52,4,0.82)]
              text-[#C0DD97]
              text-[10px]
              font-medium
              px-[9px]
              py-[3px]
              rounded-full
              tracking-[0.3px]
            "
          >
            Improves eye health
          </span>

          <span
            className="
              bg-[rgba(27,52,4,0.6)]
              text-[#EAF3DE]
              text-[10px]
              px-[9px]
              py-[3px]
              rounded-full
            "
          >
            {product.unit}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-[14px] py-3 flex items-center justify-between">
        <div>
          <p className="m-0 text-sm font-medium text-[#1a1a1a]">
            {product.name}
          </p>

         <div className="flex gap-2 justify-center text-center "> 
            <p className="mt-[2px] mb-0 text-[13px] text-[#666]">
           
            ${product.price.toFixed(2)}
          </p>
          <p className=" mt-[2px] text-[13px] text-[#d11010] text-center line-through ">
           $1.33
          </p>
          </div>
        </div>

        {/* Cart */}
        <button
          onClick={handleCart}
          aria-label="Add to cart"
          className={`
            w-9 h-9
            rounded-[10px]
            flex items-center justify-center
            cursor-pointer
            text-[#C0DD97]
            shrink-0
            transition-colors duration-200
            ${added ? "bg-[#27500A]" : "bg-[#3B6D11]"}
          `}
        >
          {added ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <CartIcon />
          )}
        </button>
      </div>
    </div>
  );
}



export default function OrganicProductCards({types}:{types:string}) {
  return (
    <div
      style={{
       
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      className=" w-full flex flex-col gap-6"
    >
        <h2 className="text-4xl font-bold ">{types==="Offers"?'Offers':"Popular Now"}</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 30,
        }}
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}