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

export const getOrderHistory = tool
