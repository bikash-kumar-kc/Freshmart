import { db } from "@/src/db/config";
import { products, productVariants } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { ProductCard } from "../ProductCard";

async function getProductsByCategory(dbName: string) {
  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.category, dbName));

  if (productRows.length === 0) return [];

  const productIds = productRows.map((p) => p.id);
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, productIds));

  const variantsByProduct = new Map<string, typeof variantRows>();
  for (const v of variantRows) {
    const list = variantsByProduct.get(v.productId) ?? [];
    list.push(v);
    variantsByProduct.set(v.productId, list);
  }

  return productRows.map((p) => ({
    ...p,
    variants: variantsByProduct.get(p.id) ?? [],
  }));
}

const ProductPage = async ({cat}:{cat:string}) => {
  if (!cat?.trim()) return;

  const productList = await getProductsByCategory(cat);
  return (
    <div className="flex-1 min-w-0">
      {productList.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
                py-24 text-center"
        >
          <span className="text-4xl mb-3">🌱</span>
          <p className="text-sm font-medium text-gray-500">
            No products in this category yet
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4
                gap-3 sm:gap-4"
        >
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
