import { db } from "@/src/db/config";
import { orderHistory, products } from "@/src/db/schema";
import { gte } from "drizzle-orm";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
 
interface ProductSignal {
  productId: string;
  category: string;
  recentOrders: number;   
  uniqueBuyers: number;   
}
 
export async function collectProductSignals(): Promise<ProductSignal[]> {
  const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_MS).toISOString();
 
  // fetch all orders from last 7 days
  const recentOrders = await db
    .select({
      userId: orderHistory.userId,
      items: orderHistory.items,
      placedAt: orderHistory.placedAt,
    })
    .from(orderHistory)
    .where(gte(orderHistory.placedAt, sevenDaysAgo));
    
 
  // fetch all products for category lookup
  const allProducts = await db
    .select({ id: products.id, category: products.category })
    .from(products);
 
  const categoryMap = new Map(allProducts.map((p) => [p.id, p.category]));
 
  // aggregate per product
  // items is: Array<{ productId, quantity, priceAtTime, variantId }>
  const signalMap = new Map<
    string,
    { recentOrders: number; uniqueBuyers: Set<string>; category: string }
  >();
 
  for (const order of recentOrders) {
    const items = order.items as Array<{ productId: string }>;
    for (const item of items) {
      const existing = signalMap.get(item.productId) ?? {
        recentOrders: 0,
        uniqueBuyers: new Set<string>(),
        category: categoryMap.get(item.productId) ?? "Unknown",
      };
      existing.recentOrders += 1;
      existing.uniqueBuyers.add(order.userId);
      signalMap.set(item.productId, existing);
    }
  }
 
  // convert to array
  return Array.from(signalMap.entries()).map(([productId, data]) => ({
    productId,
    category: data.category,
    recentOrders: data.recentOrders,
    uniqueBuyers: data.uniqueBuyers.size,
  }));
}