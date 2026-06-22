// app/product/[category_slug]/page.tsx

import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import ProductDetailClient from "@/src/components/client/product/ProductDetailClient";
import ProductDetailPage from "@/src/components/client/product/ProductDetailsPage";
import { getProductByCategorySlug } from "@/src/lib/server actions/product.server.action";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const { slug } = await params;

  const [category, productName] = slug;

 const productPromise = getProductByCategorySlug(category,productName);


  
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailClient productPromise={productPromise} />
    </Suspense>
  );
}
