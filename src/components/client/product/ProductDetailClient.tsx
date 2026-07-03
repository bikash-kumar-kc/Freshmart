"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import ProductDetailPage from "./ProductDetailsPage";
import { getProductByCategorySlug } from "@/src/lib/server actions/product.server.action";
import ReduxProvider from "@/src/app/providers/ReduxProvider";

interface Props {
  productPromise: ReturnType<typeof getProductByCategorySlug>;
}

export default function ProductDetailClient({ productPromise }: Props) {
  const { product, relatedProducts, filteredVariantRow } = use(productPromise);

  if (!product) notFound();

  return (
    <ReduxProvider>
      <ProductDetailPage
        product={product}
        filteredVariantRow={filteredVariantRow}
        relatedProducts={relatedProducts}
      />
    </ReduxProvider>
  );
}
