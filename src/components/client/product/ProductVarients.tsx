"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import ProductDetailPage from "./ProductDetailsPage";
import { getProductVarients } from "@/src/lib/server_actions/product-varients";

interface Props {
  productPromise: ReturnType<typeof getProductVarients>;
}

export default function ProductVarientsDetails({ productPromise }: Props) {
  const { product, vendorProducts, productVarients } = use(productPromise);
  if (!product) notFound();

  return (
    <ProductDetailPage
      product={product}
      vendorProducts={vendorProducts}
      productVarients={productVarients}
      isFromProductVarients={true}
    />
  );
}
