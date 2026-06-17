"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Leaf,
  MapPin,
  Star,
  ChevronDown,
  Share2,
  Heart,
} from "lucide-react";
import { Product, ProductVariant } from "@/src/db/schema";
import { ProductDetailPageProps } from "./utilities/product.types";
import { discountedPrice, formatWeight } from "./utilities/helper.fun";
import { ImageGallery } from "./utilities/image.gallary";
import { FreshnessBadge } from "./utilities/FreshnessBadge";
import { VariantSelect } from "./utilities/VarientDropdown";
import { QuantityPicker } from "./utilities/QuantityPicker";
import { RelatedProductCard } from "./utilities/subProductCard";

export default function ProductDetailPage({
  product,
  variants,
  relatedProducts,
}: ProductDetailPageProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const finalPrice = product.isOffered
    ? discountedPrice(selectedVariant.price, product.discount)
    : selectedVariant.price;

  const isOutOfStock =
    product.status === "out_of_stock" || selectedVariant.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    // wire to your cart context here
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  // all images: thumbnail first then product images
  const allImages = [
    product.thumbnail,
    ...product.images.filter((img) => img !== product.thumbnail),
  ];

  return (
    <main className="flex flex-col bg-[#F5F9F0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT: images ── */}
          <div>
            <ImageGallery images={allImages} name={product.name} />
          </div>

          {/* ── RIGHT: product info ── */}
          {/* ── RIGHT: product info ── */}
          <div className="flex flex-col  ">
            {/* ── product name ── */}
            <h1
              className="font-serif text-2xl sm:text-[28px] font-semibold
              text-gray-900 leading-snug mb-1"
            >
              {product.name}
            </h1>

            {/* ── farm origin ── */}
            <div className="flex items-center gap-1.5 mb-4">
              <MapPin size={11} className="text-green-600 shrink-0" />
              <span className="text-xs text-gray-500">
                {product.farmName} · {product.originCountry}
              </span>
            </div>

            {/* ── freshness tags ── */}
            {product.freshnessTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.freshnessTags.map((tag) => (
                  <FreshnessBadge key={tag} tag={tag} />
                ))}
              </div>
            )}

            {/* ── price block ── */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
                {/* {product.isOffered && (
                  <>
                    <span className="text-base text-gray-400 line-through mb-0.5">
                      ${selectedVariant.price.toFixed(2)}
                    </span>
                    <span
                      className="text-xs font-bold text-white
                      bg-orange-500 px-2 py-0.5 rounded-lg mb-0.5"
                    >
                      {product.discount}% OFF
                    </span>
                  </>
                )} */}
              </div>
              <p className="text-xs text-gray-600">
                Price per{" "}
                {formatWeight(
                  selectedVariant.weightValue,
                  selectedVariant.weightUnit,
                )}{" "}
                · Inclusive of all taxes
              </p>
            </div>

            {/* ── variant select ── */}
            {/* <div className="mb-4">
              <VariantSelect
                variants={variants}
                selected={selectedVariant}
                onChange={(v) => {
                  setSelectedVariant(v);
                  setQuantity(1);
                }}
                hasDiscount={product.isOffered}
                discount={product.discount}
              />
            </div> */}

            {/* ── quantity ──
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Quantity
              </span>
              <QuantityPicker
                value={quantity}
                onChange={setQuantity}
                max={selectedVariant.stock}
              />
            </div> */}

            {/* ── CTA buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {/* add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3.5 px-5 rounded-2xl font-semibold text-sm
                  border-2 transition-all duration-200
                  ${
                    isOutOfStock
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : addedToCart
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-green-600 bg-white text-green-700 hover:bg-green-50"
                  }
                `}
              >
                <ShoppingCart size={16} />
                {addedToCart ? "Added ✓" : "Add to cart"}
              </button>

              {/* buy now */}
              <button
                disabled={isOutOfStock}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-3.5 px-5 rounded-2xl font-semibold text-sm
                  transition-all duration-200
                  ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#C8742A] hover:bg-[#A85E1C] text-white shadow-md hover:shadow-lg"
                  }
                `}
              >
                Buy now
              </button>
            </div>

            <div
              className="mt-4 bg-green-100 rounded-2xl border border-gray-100
          p-6 lg:p-8"
            >
              <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* ── related products ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl font-medium text-gray-900">
                  You might also like
                </h2>
                <Link
                  href={`/products?category=${product.category}`}
                  className="text-xs font-medium text-green-700
                  hover:text-green-900 transition-colors flex items-center gap-1"
                >
                  View all
                  <ChevronDown size={12} className="-rotate-90" />
                </Link>
              </div>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
              gap-4"
              >
                {relatedProducts.slice(0, 8).map((rp) => (
                  <RelatedProductCard
                    key={rp.id}
                    product={rp}
                    variants={rp.variants}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// Sample usage — app/products/[slug]/page.tsx
// ─────────────────────────────────────────────
export function SampleProductPage() {
  const SAMPLE_PRODUCT: Product = {
    id: "prod_vegetables_01",
    name: "Organic Potato",
    createdAt: "2026-01-01T00:00:00Z",
    slug: "potato-vegetables",
    category: "Vegetables",
    keywords: "potato,aalu,organic potato,vegetable",
    description:
      "Fresh organic potatoes grown without synthetic pesticides or chemical fertilizers in the fertile valleys of Nepal. These potatoes are harvested at peak ripeness for maximum flavor and nutrition. Rich in potassium, vitamin C, and dietary fiber — a wholesome staple for every kitchen. Our farmers use traditional crop rotation methods to maintain soil health and ensure every potato reaches you bursting with natural goodness.",
    thumbnail: "/pic_1_banner.jpg",
    images: ["/pic_1_banner.jpg", "/pic_2_banner.jpg", "/pic_3_banner.jpg"],
    icon: "https://loremflickr.com/200/200/potato",
    isMostPopular: true,
    isFeatured: false,
    isOffered: true,
    discount: 15,
    offerStartDate: "2026-06-01T00:00:00Z",
    offerEndDate: "2026-06-30T00:00:00Z",
    originCountry: "Nepal",
    farmName: "Himalayan Organic Farms",
    freshnessTags: ["farm-fresh", "newly-harvested"],
    featuredBanner: [],
    status: "active",
    expireAt: "2026-06-25T00:00:00Z",
    updatedAt: "2026-06-10T00:00:00Z",
  };

  const SAMPLE_VARIANTS: ProductVariant[] = [
    {
      id: "prod_vegetables_01_v1",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      productId: "prod_vegetables_01",
      weightValue: 500,
      weightUnit: "g",
      price: 1.2,
      stock: 45,
    },
    {
      id: "prod_vegetables_01_v2",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
      productId: "prod_vegetables_01",
      weightValue: 1000,
      weightUnit: "g",
      price: 2.1,
      stock: 30,
    },
  ];

  const RELATED: (Product & { variants: ProductVariant[] })[] = [
    {
      ...SAMPLE_PRODUCT,
      id: "prod_vegetables_02",
      name: "Organic Tomato",
      slug: "tomato-vegetables",
      thumbnail: "/pic_1_banner.jpg",
      images: [],
      isMostPopular: false,
      isOffered: false,
      discount: 0,
      variants: [
        {
          ...SAMPLE_VARIANTS[0],
          id: "v2_1",
          productId: "prod_vegetables_02",
          price: 1.5,
        },
        {
          ...SAMPLE_VARIANTS[1],
          id: "v2_2",
          productId: "prod_vegetables_02",
          price: 2.7,
        },
      ],
    },
    {
      ...SAMPLE_PRODUCT,
      id: "prod_vegetables_03",
      name: "Organic Carrot",
      slug: "carrot-vegetables",
      thumbnail: "/pic_2_banner.jpg",
      images: [],
      isMostPopular: true,
      isOffered: true,
      discount: 10,
      variants: [
        {
          ...SAMPLE_VARIANTS[0],
          id: "v3_1",
          productId: "prod_vegetables_03",
          price: 1.0,
        },
        {
          ...SAMPLE_VARIANTS[1],
          id: "v3_2",
          productId: "prod_vegetables_03",
          price: 1.8,
        },
      ],
    },
    {
      ...SAMPLE_PRODUCT,
      id: "prod_vegetables_04",
      name: "Organic Spinach",
      slug: "spinach-vegetables",
      thumbnail: "/pic_3_banner.jpg",
      images: [],
      isMostPopular: false,
      isOffered: false,
      discount: 0,
      variants: [
        {
          ...SAMPLE_VARIANTS[0],
          id: "v4_1",
          productId: "prod_vegetables_04",
          price: 1.8,
        },
        {
          ...SAMPLE_VARIANTS[1],
          id: "v4_2",
          productId: "prod_vegetables_04",
          price: 3.2,
        },
      ],
    },
    {
      ...SAMPLE_PRODUCT,
      id: "prod_vegetables_05",
      name: "Organic Onion",
      slug: "onion-vegetables",
      thumbnail: "/pic_4_banner.jpg",
      images: [],
      isMostPopular: false,
      isOffered: true,
      discount: 20,
      variants: [
        {
          ...SAMPLE_VARIANTS[0],
          id: "v5_1",
          productId: "prod_vegetables_05",
          price: 0.9,
        },
        {
          ...SAMPLE_VARIANTS[1],
          id: "v5_2",
          productId: "prod_vegetables_05",
          price: 1.6,
        },
      ],
    },
  ];

  return (
    <ProductDetailPage
      product={SAMPLE_PRODUCT}
      variants={SAMPLE_VARIANTS}
      relatedProducts={RELATED}
    />
  );
}
