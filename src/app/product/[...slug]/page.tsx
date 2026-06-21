// app/product/[category_slug]/page.tsx

import ProductDetailPage from "@/src/components/client/product/ProductDetailsPage";
import { getProductByCategorySlug } from "@/src/lib/server actions/product.server.action";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string[];
  }>;
}) {
  const { slug } = await params;

  const [category, productName] = slug;

  const { product, relatedProducts, variantRows } =
    await getProductByCategorySlug(category,productName);


  if (!product || !variantRows) notFound();

  return (
    <ProductDetailPage
      product={product}
      variantRows={variantRows}
      relatedProducts={relatedProducts}
    />
  );
}
