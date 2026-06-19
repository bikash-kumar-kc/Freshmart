"use server";

import { db } from "@/src/db/config";
import { notfications } from "@/src/db/schema";
import { and, count, eq } from "drizzle-orm";

interface IUnreadNotificationTypes {
  totalCount: number;
}

export const countUnreadNotifications = async (
  id: string,
): Promise<IUnreadNotificationTypes> => {
  try {
    if (!id) {
      throw new Error("User Id is required !");
    }
    const [response] = await db
      .select({ count: count() })
      .from(notfications)
      .where(and(eq(notfications.userId, id), eq(notfications.isShown, false)));
    console.log("response.count",response.count)
    return {
      totalCount: response.count,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error on reading unread notifications : ", error.message);
    }

    throw error;
  }
};
