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

webpush.setVapidDetails(
  process.env.VAPID_MAILTO,
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
