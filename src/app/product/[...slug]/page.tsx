import { Suspense } from "react";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import ProductDetailClient from "@/src/components/client/product/ProductDetailClient";
import { getProductByCategorySlug } from "@/src/lib/server_actions/product.server.action";

async function ProductDetails({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {

  const { slug } = await params;
  const [category, productName] = slug;
  const productPromise = getProductByCategorySlug(category, productName);
  return <ProductDetailClient productPromise={productPromise} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetails params={params} />
    </Suspense>
  );
}
