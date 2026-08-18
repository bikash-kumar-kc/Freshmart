"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/auth";
import { db } from "@/src/db/config";
import { and, count, eq } from "drizzle-orm";
import { orders } from "@/src/db/schema";

export const getTotalOrdersCount = async ({ userId }: { userId: string }) => {
  if (!userId) {
    return;
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session || session?.user.id !== userId) {
      return;
    }

    const [{ totalInventoryOrders }] = await db
      .select({ totalInventoryOrders: count(orders.id) })
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.isOrdered, true),
          eq(orders.isPayment, true),
          eq(orders.isPaymentProcess, false),
          eq(orders.type, "inventory"),
        ),
      );

    const [{ totalDisplayOrders }] = await db
      .select({ totalDisplayOrders: count(orders.id) })
      .from(orders)
      .where(
        and(
          eq(orders.userId, userId),
          eq(orders.isOrdered, true),
          eq(orders.isPaymentProcess, false),
          eq(orders.type, "display"),
        ),
      );

    return {
      totalOrders: totalInventoryOrders + totalDisplayOrders,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    console.log("Failed to get orders count !");
  }
};
