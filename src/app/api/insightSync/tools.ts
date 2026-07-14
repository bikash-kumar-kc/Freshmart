import { tool } from "ai";
import { z } from "zod";
import { db } from "@/src/db/config";

import { users, orderInsights, orders } from "@/src/db/schema";
import { eq, and, gte, isNotNull, ne } from "drizzle-orm";

// tool that gives user record to agent...
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

// tool that gives all the user order records...
export const getOrderHistory = tool({
  description: `
Analyze a single user's full order history (from getOrderHistory) and compute
a purchase-cadence insight for each product they've bought. Call this once per userId.

Today's date: use the current system date for all "today" comparisons below.

STEP 1 — Group and merge
For each product_id, collect all its order line items sorted by created_at ascending.
If two or more orders for the SAME product occur on the SAME calendar date
(ignore time-of-day), merge them into a single purchase event:
  - event date = that calendar date
  - event quantity = sum of quantities from the merged orders
This prevents same-day duplicate orders from being counted as separate purchases.

STEP 2 — Minimum data check
Skip a product entirely (do not call writeOrderInsight) if it has fewer than
3 distinct purchase events after merging. Still include it in the final
buy_count summary (see STEP 6).

STEP 3 — Use the last 4 events
If a product has more than 4 purchase events, use only the most recent 4
for all calculations below. Earlier events are ignored.

STEP 4 — Compute cadence stats
From the (up to 4) purchase events:
  - buy_count = total number of merged purchase events for this product (all-time, not just last 4)
  - Compute the gap in days between each consecutive pair of events.
  - avg_interval_days = mean of these gaps.
  - Compute how much the gaps vary using coefficient of variation:
      cv = standard_deviation(gaps) / avg_interval_days
  - avg_quantity = mean quantity across the (up to 4) events used.

STEP 5 — Decide if the product is "regular" (tolerance, not exact match)
A product counts as regular ONLY if BOTH are true:
  (a) cv <= 0.4  (gaps are consistent within 40% variation — do NOT require
      gaps to be exactly equal; real purchase timing always has some noise)
  (b) avg_interval_days > 0

If regular:
  - next_expected_date = date of the most recent purchase event + avg_interval_days
  - Additionally check staleness: if next_expected_date is more than
    (2 * avg_interval_days) days in the past relative to today, treat the
    pattern as broken/inactive — do NOT call writeOrderInsight for it, since
    the user has likely stopped buying this product regularly.
  - Otherwise, call writeOrderInsight exactly once for this product with:
    userId, productId, avgIntervalDays, buyCount, avgQuantity, weightUnit,
    weightValue, expectedNewOrderedDate = next_expected_date (ISO date string).

If not regular, or if it fails the minimum data / staleness checks: do NOT
call writeOrderInsight for that product.

STEP 6 — Always return a summary
Regardless of how many (if any) products qualified as regular, return a
JSON summary listing every product_id with its buy_count, so the caller
always has full visibility into purchase counts even when no insight rows
were written.

Never call writeOrderInsight more than once per product per run, and never
call getOrderHistory more than once for the same userId.
`,

  inputSchema: z.object({
    userId: z.string().describe("The user id from getUserList"),
  }),

  execute: async ({ userId }) => {
    const recentOrders = await db.query.orders.findMany({
      where: and(
        gte(orders.userId, userId),
        eq(orders.isPayment, true),
        eq(orders.isPaymentProcess, false),
        eq(orders.isOrdered, true),
        isNotNull(orders.orderStatus),
        ne(orders.orderStatus, "failed"),
      ),
      with: {
        items: {
          with: {
            product: {
              columns: {
                id: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return recentOrders;
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
    weightUnit: z.string().describe("unit of product"),
    weightValue: z.number().describe("Price for a given unit to product"),
    expectedNewOrderedDate: z
      .string()
      .describe("Next Expected date to purchase the product"),
  }),

  execute: async ({
    userId,
    productId,
    avgIntervalDays,
    buyCount,
    avgQuantity,
    weightUnit,
    weightValue,
    expectedNewOrderedDate,
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
        weightUnit,
        weightValue,
        nextExpectedDate: expectedNewOrderedDate,
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

// export const getLastComputedAt = tool({
//   description: `
//     Fetch the most recent last_computed_at timestamp from order_insights
//     for a given user. This is the dirty check watermark.
//     After calling getOrderHistory, call this tool.
//     Then compare:
//     - If ALL orders in the history have placedAt <= lastComputedAt:
//     → skip this user, move to the next one. Do not call writeOrderInsight.
//     - If ANY order has placedAt > lastComputedAt (or lastComputedAt is null):
// → new data exists, proceed to writeOrderInsight and upsertFreqProduct.
//   Returns null if the user has never been processed before.
//     `,
//   inputSchema: z.object({
//     userId: z.string().describe("The user id to check"),
//   }),
//   execute: async ({ userId }) => {
//     const result = await db
//       .select({
//         lastComputedAt: orderInsights.lastComputedAt,
//         productId: orderInsights.productId,
//       })
//       .from(orderInsights)
//       .where(eq(orderInsights.userId, userId))
//       .orderBy(orderInsights.lastComputedAt);
//     // .limit(1)
//     // .get()

//     return result ?? null;
//   },
// });

// export const upsertFreqProduct = tool({
//   description: `
//     Upsert a row in the freq_products table for a single product of a single user.
//     Call this immediately after writeOrderInsight for the same productId.
//     You must compute the following before calling:
//     - lastBoughtAt: the most recent placedAt date from order history
//       where this product appears.
//     - nextExpectedAt: lastBoughtAt + avgIntervalDays.
//       If avgIntervalDays is null (bought only once), add 30 days as a default.
//       Format all dates as ISO 8601 strings: "2026-06-15T00:00:00Z"
//       Only upsert products where buyCount >= 2. A product bought only once
//     has no interval to compute — skip it.
//      Do not change the status field if a row already exists —
//     preserve whatever status is currently set (active, snoozed, etc).
//     Only set status to "active" on INSERT (first time this product is tracked).

//     `,
//   inputSchema: z.object({
//     userId: z.string().describe("The user id"),
//     productId: z.string().describe("The product id"),
//     lastBoughtAt: z.string().describe("ISO 8601 date of most recent purchase"),
//     nextExpectedAt: z
//       .string()
//       .describe("ISO 8601 date when restock is expected"),
//   }),

//   execute: async ({ userId, productId, lastBoughtAt, nextExpectedAt }) => {
//     const id = `${userId}_${productId}`;

//     const existing = await db
//       .select({ status: freqProducts.status })
//       .from(freqProducts)
//       .where(
//         and(
//           eq(freqProducts.userId, userId),
//           eq(freqProducts.productId, productId),
//         ),
//       )
//       .get();

//     await db
//       .insert(freqProducts)
//       .values({
//         id,
//         userId,
//         productId,
//         lastBoughtAt,
//         nextExpectedAt,
//         status: "active",
//       })
//       .onConflictDoUpdate({
//         target: [freqProducts.userId, freqProducts.productId],
//         set: {
//           lastBoughtAt,
//           nextExpectedAt,
//           status: existing?.status ?? "active",
//         },
//       });

//     return { success: true, userId, productId, nextExpectedAt };
//   },
// });

// export const updatePopularityScoresTool = tool({
//   description: `
//     Compute and update popularity scores for all products.
//     Call this ONCE at the very END of the Job 1 run,
//     after all user order insights have been processed.

//     This tool:
//     1. Reads all orders from the last 7 days
//     2. Counts recent orders and unique buyers per product
//     3. Normalizes scores (between 0 and 1) across all products
//     4. Marks the top 20% as popular candidates
//     5. Picks exactly 5 popular products — one per category
//        (if two from the same category qualify, the higher scorer wins)
//     6. Updates popularity_score and isMostPopular on all products

//     Do not call this more than once per Job 1 run.
//     Do not call this before all user insights are synced.
//   `,
//   inputSchema: z.object({}),
//   execute: async () => {

//     const signals = await collectProductSignals();

//     if (signals.length === 0) {
//       return {
//         success: true,
//         message: "No orders in last 7 days — all popularity scores reset to 0",
//         popularProducts: [],
//       };
//     }

//     // step 2 — score
//     const scored = computePopularityScores(signals);

//     // step 3 — threshold
//     const threshold = getTop20PercentThreshold(scored);

//     // step 4 — pick top 5
//     const top5 = pickTop5Popular(scored, threshold);
//     const top5Ids = new Set(top5.map((p) => p.productId));

//     // step 5 — write to DB
//     await writePopularityScores(scored, top5Ids);

//     return {
//       success: true,
//       threshold: threshold,
//       totalScored: scored.length,
//       popularProducts: top5.map((p) => ({
//         productId: p.productId,
//         category: p.category,
//         score: p.score,
//         recentOrders: p.recentOrders,
//         uniqueBuyers: p.uniqueBuyers,
//       })),
//     };
//   },
// });
