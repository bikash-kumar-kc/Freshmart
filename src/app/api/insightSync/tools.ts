import { tool } from "ai";
import { z } from "zod";
import { db } from "@/src/db/config";

import {
  users,
  orderHistory,
  orderInsights,
  freqProducts,
} from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { collectProductSignals } from "./utilities/productSignal";
import { computePopularityScores } from "./utilities/normalityCalculation";
import { getTop20PercentThreshold } from "../popularityCheck/utilis/top20Percent";
import { pickTop5Popular } from "../popularityCheck/utilis/pickTop5Popular";
import { writePopularityScores } from "./utilities/popularityStatusUpdated";

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
    - if there is any product  that the user is buying in a regular interval.Like today is 12th june and then user is buying this product in every two days interval then call the write "writeOrderInsight" tool only at once. Here, considered the product must have at least 3 order that sync with the average days between purchases. The writeOrderInsight must be for each unique product not products at once.
    Do not call this for the same userId more than once.
    - note: one thing that take the latest 4 order history for each product and then find the frequency criteria.
    - note: considered one thing that is : like if a user buy a product in 8th then 10th then 12th then 14th but did not buy at 16th and then while calculating the frequncy product then considered today days and the interval remains same then processed otherwise skip.
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

export const updatePopularityScoresTool = tool({
  description: `
    Compute and update popularity scores for all products.
    Call this ONCE at the very END of the Job 1 run,
    after all user order insights have been processed.
 
    This tool:
    1. Reads all orders from the last 7 days
    2. Counts recent orders and unique buyers per product
    3. Normalizes scores (between 0 and 1) across all products
    4. Marks the top 20% as popular candidates
    5. Picks exactly 5 popular products — one per category
       (if two from the same category qualify, the higher scorer wins)
    6. Updates popularity_score and isMostPopular on all products
 
    Do not call this more than once per Job 1 run.
    Do not call this before all user insights are synced.
  `,
  inputSchema: z.object({}),
  execute: async () => {
  
    const signals = await collectProductSignals();
 
    if (signals.length === 0) {
      return {
        success: true,
        message: "No orders in last 7 days — all popularity scores reset to 0",
        popularProducts: [],
      };
    }
 
    // step 2 — score
    const scored = computePopularityScores(signals);
 
    // step 3 — threshold
    const threshold = getTop20PercentThreshold(scored);
 
    // step 4 — pick top 5
    const top5 = pickTop5Popular(scored, threshold);
    const top5Ids = new Set(top5.map((p) => p.productId));
 
    // step 5 — write to DB
    await writePopularityScores(scored, top5Ids);
 
    return {
      success: true,
      threshold: threshold,
      totalScored: scored.length,
      popularProducts: top5.map((p) => ({
        productId: p.productId,
        category: p.category,
        score: p.score,
        recentOrders: p.recentOrders,
        uniqueBuyers: p.uniqueBuyers,
      })),
    };
  },
});
