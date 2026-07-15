import webpush from "web-push";
import { users, orderInsights } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { tool } from "ai";
import z from "zod";
import { db } from "@/src/db/config";



export const sendPushNotification = tool({
  description: `
Send a push notification informing the user that one or more
frequently purchased products are due for restocking.

Call this exactly once per user after createNotificationTool.

If sending succeeds,
mark every processed order_insights row as notified.

Never retry failures.
`,

  inputSchema: z.object({
    userId: z.string(),

    productIds: z.array(z.string()),
  }),

  execute: async ({ userId, productIds }) => {
    const user = await db
      .select({
        pushSubscription: users.pushSubscription,
      })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user?.pushSubscription) {
      return {
        success: false,
        reason: "no_push_subscription",
      };
    }

    const subscription = JSON.parse(user.pushSubscription);

    const payload = JSON.stringify({
      title: "🛒 Time to Restock!",
      body:
        productIds.length === 1
          ? "One of your frequently purchased products is due for restocking."
          : `${productIds.length} products are due for restocking.`,

      url: "/",
    });

    try {
      
      await webpush.sendNotification(subscription, payload);
    } catch (err: any) {
      if (err.statusCode === 410) {
        await db
          .update(users)
          .set({
            pushSubscription: null,
          })
          .where(eq(users.id, userId));

        return {
          success: false,
          reason: "subscription_expired",
        };
      }

      console.error(err);

      return {
        success: false,
        reason: "push_failed",
      };
    }

    await Promise.all(
      productIds.map((productId) =>
        db
          .update(orderInsights)
          .set({
            isNotificationSend: true,
          })
          .where(
            and(
              eq(orderInsights.userId, userId),
              eq(orderInsights.productId, productId),
            ),
          ),
      ),
    );

    return {
      success: true,
      userId,
      notifiedProducts: productIds.length,
    };
  },
});
