import { tool } from "ai";
import { randomUUID } from "crypto";
import z from "zod";
import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "@/src/db/config";
import { orderInsights, notfications } from "@/src/db/schema";


export const getDueOrderInsights = tool({
description: `
Fetch every order insight that is due for a restock reminder.

Call this exactly once at the beginning of the job.

A row qualifies when:

- nextExpectedDate is today
- isNotificationSend = false

Return every matching row.

Multiple rows may belong to the same user.

Do not call this tool more than once.
`,

  inputSchema: z.object({}),

  execute: async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    return db
      .select({
        userId: orderInsights.userId,
        productId: orderInsights.productId,
        avgQuantity: orderInsights.avgQuantity,
        nextExpectedDate: orderInsights.nextExpectedDate,
      })
      .from(orderInsights)
      .where(
        and(
          eq(orderInsights.isNotificationSend, false),
          gte(orderInsights.nextExpectedDate, today.toISOString()),
          lt(orderInsights.nextExpectedDate, tomorrow.toISOString())
        )
      );
  },
});



export const createNotificationTool = tool({
  description: `
Create one in-app notification for a user.

Call this exactly once per user.

Pass every due product belonging to that user.

Do not call this tool once per product.
`,

  inputSchema: z.object({
    userId: z.string(),
    productIds: z.array(z.string()),
  }),

  execute: async ({ userId, productIds }) => {
    const title = "Time to restock 🛒";
    const content =
      productIds.length === 1
        ? "One of your frequently purchased products is due for restocking."
        : `${productIds.length} of your frequently purchased products are due for restocking.`;

    await db.insert(notfications).values({
      id: randomUUID(),
      userId,
      type: "suggestion",
      title,
      content,
    });

    return {
      success: true,
    };
  },
});