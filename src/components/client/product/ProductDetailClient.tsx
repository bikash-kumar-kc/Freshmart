// components/ProductDetailClient.tsx  — CLIENT component
"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import ProductDetailPage from "./ProductDetailsPage";
import { getProductByCategorySlug} from "@/src/lib/server actions/product.server.action";




interface Props {
  productPromise: ReturnType<typeof getProductByCategorySlug>;
}



export default function ProductDetailClient({ productPromise }: Props) {

  const { product, relatedProducts, variantRows } = use(productPromise);

  if (product) notFound();

  return (
    <ProductDetailPage
      product={product}
      variantRows={variantRows}
      relatedProducts={relatedProducts}
    />
  );
}