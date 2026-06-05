import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { db } from "@/src/db/config";
import { orderHistory, freqProducts, suggestedCarts } from "@/src/db/schema";
import { eq, and, gte } from "drizzle-orm";

export const POST = verifySignatureAppRouter(async (req: Request) => {
  const { userId, cartId, productIds } = await req.json();

  const fortyEightHoursAgo = new Date(
    Date.now() - 48 * 60 * 60 * 1000,
  ).toISOString();

  // fetch orders placed by this user in the last 48hrs
  const recentOrders = await db
    .select({ items: orderHistory.items })
    .from(orderHistory)
    .where(
      and(
        eq(orderHistory.userId, userId),
        gte(orderHistory.placedAt, fortyEightHoursAgo),
      ),
    );

  // flatten all purchased productIds from recent orders
  const purchasedProductIds = new Set(
    recentOrders.flatMap((order) =>
      (order.items as Array<{ productId: string }>).map((i) => i.productId),
    ),
  );

  await Promise.all(
    productIds.map(async (productId: string) => {
      const wasBought = purchasedProductIds.has(productId);
      if (wasBought) {
        await db
          .update(freqProducts)
          .set({
            status: "active",
            notificationSentAt: null,
          })
          .where(
            and(
              eq(freqProducts.userId, userId),
              eq(freqProducts.productId, productId),
            ),
          );

        await db
          .update(freqProducts)
          .set({
            status: "inactive",
          })
          .where(
            and(
              eq(freqProducts.userId, userId),
              eq(freqProducts.productId, productId),
            ),
          );
      } else {
        await db
          .update(freqProducts)
          .set({
            status: "inactive",
          })
          .where(
            and(
              eq(freqProducts.userId, userId),
              eq(freqProducts.productId, productId),
            ),
          );
      }
    }),
  );

  const allBought = productIds.every((id: string) =>
    purchasedProductIds.has(id),
  );

  const noneBought = productIds.every(
    (id: string) => !purchasedProductIds.has(id),
  );

  await db
    .update(suggestedCarts)
    .set({
      status: allBought ? "accepted" : noneBought ? "dismissed" : "accepted",
      // partially accepted carts are treated as accepted
    })
    .where(eq(suggestedCarts.id, cartId));

  return new Response("ok", { status: 200 });
});
