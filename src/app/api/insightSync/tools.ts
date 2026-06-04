import { tool } from "ai";
import { z } from "zod";
import { db } from "@/src/db/config";

import {
  users,
  orderHistory,
  orderInsights,
  freqProducts,
} from "@/src/db/schema";
import { eq, gt, and } from "drizzle-orm";

export const getUserList = tool({
  description: `
    Fetch all users from the database.
    Call this ONCE at the very start of the job.
    Use the returned user ids to drive all subsequent tools calls.
    Do not call this again mid-loop.
    `,
  inputSchema: z.object({}),
  execute: async () => {
    const result = await db
      .select({ id: users.id, email: users.email })
      .from(users);

    return result;
  },
});

export const getOrderHistory = tool({
  description: `
    Fetch the full order history for a single user.
    Call this once per user using the userId from getUserList.
     The returned items array contains every product the user has bought
    and when they bought it.Use this data to compute:
    - how many times each product was bought (buy_count)
    - average days between purchases (avg_interval_days)
    - average quantity per order (avg_quantity)
    Do not call this for the same userId more than once.

    `,

  inputSchema: z.object({
    userId: z.string().describe("The user id from getUserList"),
  }),

  execute: async ({ userId }) => {
    const result = await db
      .select({
        placedAt: orderHistory.placedAt,
        items: orderHistory.items,
      })
      .from(orderHistory)
      .where(eq(orderHistory.userId, userId))
      .orderBy(orderHistory.placedAt);

    return result;
  },
});

export const getLastComputedAt = tool({
  description: `
    Fetch the most recent last_computed_at timestamp from order_insights
    for a given user. This is the dirty check watermark.
    After calling getOrderHistory, call this tool.
    Then compare:
    - If ALL orders in the history have placedAt <= lastComputedAt:
    → skip this user, move to the next one. Do not call writeOrderInsight.
    - If ANY order has placedAt > lastComputedAt (or lastComputedAt is null):
→ new data exists, proceed to writeOrderInsight and upsertFreqProduct.
  Returns null if the user has never been processed before.
    `,
  inputSchema: z.object({
    userId: z.string().describe("The user id to check"),
  }),
  execute: async ({ userId }) => {
    const result = await db
      .select({
        lastComputedAt: orderInsights.lastComputedAt,
        productId: orderInsights.productId,
      })
      .from(orderInsights)
      .where(eq(orderInsights.userId, userId))
      .orderBy(orderInsights.lastComputedAt);
    // .limit(1)
    // .get()

    return result ?? null;
  },
});

export const writeOrderInsight = tool({
  description: `
    Upsert a computed insight row for a single product of a single user
    into the order_insights table.
     Call this once per unique productId found in the user's order history, If the product has some kind of frequency
    You must compute the following values yourself from getOrderHistory data
    before calling this tool:
    - avgIntervalDays: average number of days between consecutive purchases
      of this product. If only bought once, pass null.
    - buyCount: total number of times this product appears across all orders.
    - avgQuantity: average quantity per order for this product.
    Example: if milk appears in 3 orders with quantities [2, 2, 3]
    on dates [May 1, May 8, May 15]:
    - avgIntervalDays = 7
    - buyCount = 3
    - avgQuantity = 2.33
    If a row already exists for this userId + productId, it will be updated.
     If not, a new row will be inserted.
    `,

  inputSchema: z.object({
    userId: z.string().describe("The user Id"),
    productId: z.string().describe("The product id"),
    avgIntervalDays: z
      .number()
      .describe("Average days between purchases. It can be null"),
    buyCount: z.number().int().describe("Average quantity per order"),
    avgQuantity: z.number().describe("Average quantity per order"),
  }),

  execute: async ({
    userId,
    productId,
    avgIntervalDays,
    buyCount,
    avgQuantity,
  }) => {
    const now = new Date().toDateString();
    const id = `${userId}_${productId}`;

    await db
      .insert(orderInsights)
      .values({
        id,
        userId,
        productId,
        avgIntervalDays,
        buyCount,
        avgQuantity,
        lastComputedAt: now,
      })
      .onConflictDoUpdate({
        target: [orderInsights.userId, orderInsights.productId],
        set: {
          avgIntervalDays,
          buyCount,
          avgQuantity,
          lastComputedAt: now,
        },
      });

    return { success: true, userId, productId };
  },
});

export const upsertFreqProduct = tool({
  description: `
    Upsert a row in the freq_products table for a single product of a single user.
    Call this immediately after writeOrderInsight for the same productId.
    You must compute the following before calling:
    - lastBoughtAt: the most recent placedAt date from order history
      where this product appears.
    - nextExpectedAt: lastBoughtAt + avgIntervalDays.
      If avgIntervalDays is null (bought only once), add 30 days as a default.
      Format all dates as ISO 8601 strings: "2026-06-15T00:00:00Z"
      Only upsert products where buyCount >= 2. A product bought only once
    has no interval to compute — skip it.
     Do not change the status field if a row already exists —
    preserve whatever status is currently set (active, snoozed, etc).
    Only set status to "active" on INSERT (first time this product is tracked).
      
    `,
  inputSchema: z.object({
    userId: z.string().describe("The user id"),
    productId: z.string().describe("The product id"),
    lastBoughtAt: z.string().describe("ISO 8601 date of most recent purchase"),
    nextExpectedAt: z
      .string()
      .describe("ISO 8601 date when restock is expected"),
  }),

  execute: async ({ userId, productId, lastBoughtAt, nextExpectedAt }) => {
    const id = `${userId}_${productId}`;

    const existing = await db
      .select({ status: freqProducts.status })
      .from(freqProducts)
      .where(
        and(
          eq(freqProducts.userId, userId),
          eq(freqProducts.productId, productId),
        ),
      )
      .get();

    await db
      .insert(freqProducts)
      .values({
        id,
        userId,
        productId,
        lastBoughtAt,
        nextExpectedAt,
        status: "active",
      })
      .onConflictDoUpdate({
        target: [freqProducts.userId, freqProducts.productId],
        set: {
          lastBoughtAt,
          nextExpectedAt,
          status: existing?.status ?? "active",
        },
      });

    return { success: true, userId, productId, nextExpectedAt };
  },
});
