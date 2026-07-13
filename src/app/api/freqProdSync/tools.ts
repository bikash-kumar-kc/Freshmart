import { tool } from "ai";
import z from "zod";
import { db } from "@/src/db/config";
import {
  users,
  orderInsights,
  freqProducts,
  suggestedCarts,
} from "@/src/db/schema";
import { eq, and, gte, lt, isNull } from "drizzle-orm";
import webpush from "web-push";
import qstash from "../../../qstash/client";

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export const getDueFreqProducts = tool({
  description: `
    Fetch all freq_products rows across all users that are due for restock.
    Call this ONCE at the very start of the job.
     A row is included when ALL of the following are true:
    - status = 'active'
    - next_expected_at is today or tomorrow ONLY
      (not overdue from last week — only the 1-day window matters)
    - notification_sent_at IS NULL
      (once a notification is sent, this product is skipped forever
       until the 48hr expiry check clears it by setting it back to NULL)
 
    Use the returned list to drive all subsequent tool calls.
    Do not call this again mid-loop.
    `,

  inputSchema: z.object({}),

  execute: async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setUTCDate(today.getUTCDate() + 2);

    const result = await db
      .select({
        userId: freqProducts.userId,
        productId: freqProducts.productId,
        nextExpectedAt: freqProducts.nextExpectedAt,
        lastBoughtAt: freqProducts.lastBoughtAt,
      })
      .from(freqProducts)
      .where(
        and(
          eq(freqProducts.status, "active"),
          gte(freqProducts.nextExpectedAt, today.toISOString()),
          lt(freqProducts.nextExpectedAt, dayAfterTomorrow.toISOString()),
          isNull(freqProducts.notificationSentAt),
        ),
      );

    return result;
  },
});

export const checkExistingCart = tool({
  description: `
 Check if a pending suggested cart already exists for this user.
  Check if a pending suggested cart already exists for this user.
  If this returns { exists: true } — skip this user entirely.
    Do not call buildSuggestedCart or sendRestockNotification for them.
      If this returns { exists: false } — proceed to buildSuggestedCart.
  This is a safety net against QStash retries delivering the job twice.
`,
  inputSchema: z.object({
    userId: z.string().describe("The user id to check"),
  }),
  execute: async ({ userId }) => {
    const existing = await db
      .select({ id: suggestedCarts.id })
      .from(suggestedCarts)
      .where(
        and(
          eq(suggestedCarts.userId, userId),
          eq(suggestedCarts.status, "pending"),
        ),
      )
      .get();

    return { exists: !!existing };
  },
});

export const buildSuggestedCart = tool({
  description: `
     Build and save a suggested cart for a user containing all their
    due-for-restock products in one cart.
     IMPORTANT: Group all due productIds for the same userId and pass
    them together in one call. Do not call this once per product —
    call it once per user with all their due products as an array.

       This tool will:
       - Fetch avg_quantity from order_insights for each productId
    - Round avg_quantity to the nearest whole number (minimum 1)
        - Build the cart items array
        - Write one row to suggested_carts with status = 'pending'
    - Return the cartId for use in sendRestockNotification
 The reason field per item is auto-generated from nextExpectedAt.
     `,

  inputSchema: z.object({
    userId: z.string().describe("The user id"),
    dueProducts: z
      .array(
        z.object({
          productId: z.string(),
          nextExpectedAt: z
            .string()
            .describe("ISO 8601 — used to generate reason text"),
        }),
      )
      .describe("All products due for restock for this user"),
  }),

  execute: async ({ userId, dueProducts }) => {
    const insightRows = await Promise.all(
      dueProducts.map((p) =>
        db
          .select({
            productId: orderInsights.productId,
            avgQuantity: orderInsights.avgQuantity,
          })
          .from(orderInsights)
          .where(
            and(
              eq(orderInsights.userId, userId),
              eq(orderInsights.productId, p.productId),
            ),
          )
          .get(),
      ),
    );

    const items = dueProducts.map((p, i) => {
      const insight = insightRows[i];
      const quantity = Math.max(1, Math.round(insight?.avgQuantity ?? 1));
      const daysOverdue = Math.floor(
        (Date.now() - new Date(p.nextExpectedAt).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const reason =
        daysOverdue > 0
          ? `You usually restock this every few days — it's ${daysOverdue} day(s) overdue`
          : `Based on your purchase pattern, you'll likely need this soon`;

      return { productId: p.productId, quantity, reason };
    });

    // idempotent cart id — one per user per day
    const today = new Date().toISOString().slice(0, 10); // "2026-06-04"
    const cartId = `cart_${userId}_${today}`;

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    await db
      .insert(suggestedCarts)
      .values({
        id: cartId,
        userId,
        items,
        status: "pending",
        expiresAt,
      })
      .onConflictDoNothing();

    return { cartId, itemCount: items.length, expiresAt };
  },
});

export const sendRestockNotification = tool({
  description: `
     Send a push notification to the user with a link to their suggested cart.
     Call this once per user immediately after buildSuggestedCart succeeds.
     This tool will:
    1. Fetch the user's push_subscription from the users table
    2. If push_subscription is null — mark cart as 'notification_failed' and stop
    3. Fire the web-push notification with a deep-link: /checkout?cart=<cartId>
    4. If push fails with 410 Gone — null out push_subscription, mark cart
       as 'notification_failed', and stop
    5. On success — set notification_sent_at = now() on all freq_products
       rows for this user that were part of this cart
    6. Queue a QStash delayed message for 48hr expiry check
 
    Pass all productIds that were included in the cart so notification_sent_at
    can be set on each of them.
    `,
  inputSchema: z.object({
    userId: z.string().describe("The user id"),
    cartId: z.string().describe("The cart id from buildSuggestedCart"),
    productIds: z
      .array(z.string())
      .describe("All productIds included in the cart"),
  }),

  execute: async ({ userId, cartId, productIds }) => {
    const now = new Date().toISOString();

    // 1. fetch push subscription
    const user = await db
      .select({ pushSubscription: users.pushSubscription })
      .from(users)
      .where(eq(users.id, userId))
      .get();

    if (!user?.pushSubscription) {
      await db
        .update(suggestedCarts)
        .set({ status: "notification_failed" })
        .where(eq(suggestedCarts.id, cartId));

      return { success: false, reason: "no_push_subscription" };
    }

    const subscription = JSON.parse(user.pushSubscription);
    const payload = JSON.stringify({
      title: "Time to restock!",
      body: "Your cart is ready — tap to review and place your order.",
      url: `/checkout?cart=${cartId}`,
    });

    try {
      await webpush.sendNotification(subscription, payload);
    } catch (err: any) {
      if (err.statusCode === 410) {
        // subscription is dead — clean up
        await db
          .update(users)
          .set({ pushSubscription: null })
          .where(eq(users.id, userId));
        await db
          .update(suggestedCarts)
          .set({ status: "notification_failed" })
          .where(eq(suggestedCarts.id, cartId));

        return { success: false, reason: "subscription_expired_410" };
      }

      console.log(err);
    }

    await Promise.all(
      productIds.map((productId) =>
        db
          .update(freqProducts)
          .set({ notificationSentAt: now })
          .where(
            and(
              eq(freqProducts.userId, userId),
              eq(freqProducts.productId, productId),
            ),
          ),
      ),
    );

    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/agent/expiry-check`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, cartId, productIds }),
      delay: 60 * 60 * 48, // 48 hours in seconds
    });

    return { success: true, userId, cartId };
  },
});
