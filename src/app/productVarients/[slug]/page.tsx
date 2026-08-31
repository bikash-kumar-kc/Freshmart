import { Suspense } from "react";
import ProductDetailsSkeleton from "@/components/skeleton/ProductDetailsSkeleton";
import { getProductVarients } from "@/src/lib/server_actions/product-varients";
import ProductVarientsDetails from "@/src/components/client/product/ProductVarients";

async function ProductVarients({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [vendorId, productName] = slug;
  const productPromise = getProductVarients(vendorId, productName);
  return <ProductVarientsDetails productPromise={productPromise} />;
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
