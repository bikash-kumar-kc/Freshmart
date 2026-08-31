import { Suspense } from "react";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import ProductDetailClient from "@/src/components/client/product/ProductDetailClient";
import { getProductVarients } from "@/src/lib/server_actions/product-varients";

async function ProductVarients({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [vendorId, productName] = slug;
  const productPromise = getProductVarients(vendorId, productName);
  return <ProductDetailClient productPromise={productPromise} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductVarients params={params} />
    </Suspense>
  );
}
