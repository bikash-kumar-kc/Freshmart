"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Leaf,
  Home,
  ShoppingCart,
  Star,
  ChevronRight,
  Tag,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: string;
  isMostPopular: boolean;
  isFeatured: boolean;
  isOffered: boolean;
  discount: number;
  freshnessTags: string[];
  status: string;
};

type ProductVariant = {
  id: string;
  productId: string;
  weightValue: number;
  weightUnit: string;
  price: number;
  stock: number;
};

type ProductWithVariants = Product & { variants: ProductVariant[] };

// ─────────────────────────────────────────────
// Category definitions — all 10
// ─────────────────────────────────────────────
const CATEGORIES = [
  { key: "vegetables",    label: "Vegetables",       emoji: "🥦" },
  { key: "fruits",        label: "Fruits",            emoji: "🍎" },
  { key: "dairy-eggs",    label: "Dairy & Eggs",      emoji: "🥛" },
  { key: "grains-cereals",label: "Grains & Cereals",  emoji: "🌾" },
  { key: "pulses-lentils",label: "Pulses & Lentils",  emoji: "🫘" },
  { key: "spices-herbs",  label: "Spices & Herbs",    emoji: "🌿" },
  { key: "nuts-seeds",    label: "Nuts & Seeds",      emoji: "🥜" },
  { key: "oils-ghee",     label: "Oils & Ghee",       emoji: "🫙"  },
  { key: "beverages",     label: "Beverages",         emoji: "🍵" },
  { key: "snacks-bakery", label: "Snacks & Bakery",   emoji: "🍞" },
];

// ─────────────────────────────────────────────
// Mock products — 6 per category shown here
// replace with db fetch in real usage
// ─────────────────────────────────────────────
function getMockProducts(categoryKey: string): ProductWithVariants[] {
  const cat = CATEGORIES.find((c) => c.key === categoryKey);
  if (!cat) return [];

  const names: Record<string, string[]> = {
    vegetables:     ["Potato", "Tomato", "Spinach", "Carrot", "Broccoli", "Onion","Potato", "Tomato", "Spinach", "Carrot", "Broccoli", "Onion"],
    fruits:         ["Apple", "Banana", "Mango", "Orange", "Grapes", "Kiwi"],
    "dairy-eggs":   ["Cow Milk", "Curd", "Paneer", "Ghee", "Butter", "Free-Range Eggs"],
    "grains-cereals":["Brown Rice", "Rolled Oats", "Quinoa", "Wheat Flour", "Barley", "Red Rice"],
    "pulses-lentils":["Toor Dal", "Moong Dal", "Rajma", "Chana Dal", "Masoor Dal", "Whole Moong"],
    "spices-herbs": ["Turmeric", "Cumin Seeds", "Black Pepper", "Cardamom", "Coriander", "Saffron"],
    "nuts-seeds":   ["Almonds", "Cashews", "Walnuts", "Chia Seeds", "Pumpkin Seeds", "Pistachios"],
    "oils-ghee":    ["Coconut Oil", "Mustard Oil", "Sesame Oil", "A2 Cow Ghee", "Olive Oil", "Groundnut Oil"],
    beverages:      ["Green Tea", "Turmeric Latte", "Coconut Water", "Aloe Vera Juice", "Kombucha", "Ginger Tea"],
    "snacks-bakery":["Whole Wheat Bread", "Oat Cookies", "Granola Bars", "Makhana", "Rice Cakes", "Energy Bars"],
     vegetabless:     ["Potato", "Tomato", "Spinach", "Carrot", "Broccoli", "Onion"],
    fruitss:         ["Apple", "Banana", "Mango", "Orange", "Grapes", "Kiwi"],
    "dairy-eggss":   ["Cow Milk", "Curd", "Paneer", "Ghee", "Butter", "Free-Range Eggs"],
    "grains-cerealss":["Brown Rice", "Rolled Oats", "Quinoa", "Wheat Flour", "Barley", "Red Rice"],
    "pulses-lentilss":["Toor Dal", "Moong Dal", "Rajma", "Chana Dal", "Masoor Dal", "Whole Moong"],
    "spices-herbss": ["Turmeric", "Cumin Seeds", "Black Pepper", "Cardamom", "Coriander", "Saffron"],
    "nuts-seedss":   ["Almonds", "Cashews", "Walnuts", "Chia Seeds", "Pumpkin Seeds", "Pistachios"],
    "oils-ghese":    ["Coconut Oil", "Mustard Oil", "Sesame Oil", "A2 Cow Ghee", "Olive Oil", "Groundnut Oil"],
    beveragess:      ["Green Tea", "Turmeric Latte", "Coconut Water", "Aloe Vera Juice", "Kombucha", "Ginger Tea"],
    "snacks-bakerys":["Whole Wheat Bread", "Oat Cookies", "Granola Bars", "Makhana", "Rice Cakes", "Energy Bars"],
  };

  const productNames = names[categoryKey] ?? [];

  return productNames.map((name, i) => {
    const id = `prod_${categoryKey}_${String(i + 1).padStart(2, "0")}`;
    const isOffered = i % 3 === 0;
    const isMostPopular = i % 4 === 0;
    const price = parseFloat((1 + Math.abs(Math.sin(i * 7.3)) * 8).toFixed(2));
    const discountedPrice = isOffered
      ? parseFloat((price * 0.85).toFixed(2))
      : price;

    return {
      id,
      name: `Organic ${name}`,
      slug: `${name.toLowerCase().replace(/\s+/g, "-")}-${categoryKey}`,
      category: cat.label,
      thumbnail: `https://loremflickr.com/400/300/${encodeURIComponent(name.toLowerCase())},organic,food`,
      isMostPopular,
      isFeatured: i === 0,
      isOffered,
      discount: isOffered ? 15 : 0,
      freshnessTags: i % 2 === 0 ? ["farm-fresh"] : ["fresh"],
      status: i === 5 ? "out_of_stock" : "active",
      variants: [
        {
          id: `${id}_v1`,
          productId: id,
          weightValue: 500,
          weightUnit: "g",
          price: discountedPrice,
          stock: i === 5 ? 0 : 20 + i * 3,
        },
        {
          id: `${id}_v2`,
          productId: id,
          weightValue: 1000,
          weightUnit: "g",
          price: parseFloat((discountedPrice * 1.8).toFixed(2)),
          stock: i === 5 ? 0 : 10 + i,
        },
      ],
    };
  });
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function cheapestVariant(variants: ProductVariant[]): ProductVariant | null {
  if (!variants.length) return null;
  return variants.reduce((min, v) => (v.price < min.price ? v : min), variants[0]);
}

// ─────────────────────────────────────────────
// Product card
// ─────────────────────────────────────────────
function ProductCard({ product }: { product: ProductWithVariants }) {
  const [added, setAdded] = useState(false);
  const variant = cheapestVariant(product.variants);
  const isOutOfStock = product.status === "out_of_stock" || !variant || variant.stock === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-sm border border-gray-100
        overflow-hidden hover:border-green-200 hover:shadow-sm
        transition-all duration-200 flex flex-col animate-fade-up"
    >
      {/* image */}
      <div className="relative aspect-[4/3] bg-green-50 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300
            group-hover:scale-105
            ${isOutOfStock ? "opacity-60" : ""}`}
        />

        {/* badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isOffered && (
            <span className="bg-orange-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none">
              -{product.discount}%
            </span>
          )}
          {product.isMostPopular && (
            <span className="bg-amber-400 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none flex items-center gap-0.5">
              <Star size={8} className="fill-white" /> Popular
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-500 text-white text-[10px] font-bold
              px-1.5 py-0.5 rounded-md leading-none">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {/* info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-green-700 font-medium mb-0.5 flex
          items-center gap-1">
          <Leaf size={9} /> {product.category}
        </p>
        <p className="text-sm font-semibold text-gray-900 line-clamp-1
          group-hover:text-green-700 transition-colors mb-auto">
          {product.name}
        </p>

        {variant && (
          <p className="text-[11px] text-gray-400 mt-1">
            From {variant.weightValue}{variant.weightUnit}
          </p>
        )}

        {/* price + add */}
        <div className="flex items-center justify-between mt-2.5">
          <div>
            {variant && (
              <>
                <span className="text-base font-bold text-gray-900">
                  ${variant.price.toFixed(2)}
                </span>
                {product.isOffered && (
                  <span className="text-xs text-gray-400 line-through ml-1.5">
                    ${(variant.price / 0.85).toFixed(2)}
                  </span>
                )}
              </>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`
              flex items-center justify-center w-8 h-8 rounded-xl
              border transition-all duration-200 flex-shrink-0
              ${isOutOfStock
                ? "border-gray-200 text-gray-300 cursor-not-allowed"
                : added
                ? "border-green-500 bg-green-500 text-white"
                : "border-green-200 text-green-700 hover:bg-green-600 hover:border-green-600 hover:text-white"
              }
            `}
            aria-label={`Add ${product.name} to cart`}
          >
            {added
              ? <span className="text-[10px] font-bold">✓</span>
              : <ShoppingCart size={13} />
            }
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// Category sidebar item
// ─────────────────────────────────────────────
function CategoryItem({
  cat,
  isActive,
  onClick,
}: {
  cat: typeof CATEGORIES[number];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left
        transition-all duration-150 group
        ${isActive
          ? "bg-green-700 text-white"
          : "hover:bg-green-50 text-gray-700"
        }
      `}
    >
      <span className="text-base leading-none flex-shrink-0">{cat.emoji}</span>
      <span className={`text-sm font-medium flex-1 leading-none ${
        isActive ? "text-white" : "text-gray-700"
      }`}>
        {cat.label}
      </span>
      <ChevronRight
        size={13}
        className={`flex-shrink-0 transition-opacity ${
          isActive ? "opacity-70 text-white" : "opacity-0 group-hover:opacity-40"
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// Main products page
// ─────────────────────────────────────────────
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryKey = searchParams.get("category") ?? CATEGORIES[0].key;

  const activeCategory =
    CATEGORIES.find((c) => c.key === activeCategoryKey) ?? CATEGORIES[0];

  const products = getMockProducts(activeCategory.key);

  const setCategory = (key: string) => {
    router.push(`/products?category=${key}`, { scroll: false });
  };

  return (
    <main className="bg-amber-50 min-h-screen">
      <div className="max-w-7xl mx-auto  py-6">

        {/* ── top bar ── */}
        <div className="flex items-center justify-between mb-6 px-2 ">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900">
              {activeCategory.emoji} {activeCategory.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 px-10">
              {products.length} organic products
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium
              text-green-700 hover:text-white hover:bg-green-400 px-3 py-2  transition-colors rounded-sm"
          >
            <Home size={14} />
            Home
          </Link>
        </div>

        <div className="flex gap-6 items-start">

          {/* ── LEFT: category sidebar ── */}
          <aside className="hidden md:flex flex-col w-75 flex-shrink-0
            bg-white rounded-sm border border-gray-100 p-3 sticky top-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest
              text-gray-400 px-3 mb-2">
              Categories
            </p>
            <nav className="flex flex-col gap-4.5">
              {CATEGORIES.map((cat) => (
                <CategoryItem
                  key={cat.key}
                  cat={cat}
                  isActive={cat.key === activeCategory.key}
                  onClick={() => setCategory(cat.key)}
                />
              ))}
            </nav>

          </aside>

          {/* ── mobile: horizontal category scroll ── */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2
            -mx-4 px-4 mb-4 scrollbar-none w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`
                  flex-shrink-0 flex items-center gap-1.5 px-3 py-2
                  rounded-xl text-sm font-medium border transition-all
                  ${cat.key === activeCategory.key
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-200"
                  }
                `}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ── RIGHT: product grid ── */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center
                py-24 text-center">
                <span className="text-4xl mb-3">🌱</span>
                <p className="text-sm font-medium text-gray-500">
                  No products in this category yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4
                gap-3 sm:gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}