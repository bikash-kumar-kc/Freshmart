import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import ProductDetailClient from "@/src/components/client/product/ProductDetailClient";
import { getProductByCategorySlug } from "@/src/lib/server actions/product.server.action";
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
