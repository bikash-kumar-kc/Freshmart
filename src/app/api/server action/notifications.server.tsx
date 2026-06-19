"use server";

import { db } from "@/src/db/config";
import { notfications } from "@/src/db/schema";
import { authOptions } from "@/src/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

interface IUnreadNotificationTypes {
  totalCount: number;
}

const checkUserLoggedIn = async (): Promise<boolean> => {
  try {
    const data = await getServerSession(authOptions);
    console.log(data);
    if (data?.user.id) {
      return true;
    } else return false;
  } catch (error) {
    throw error;
  }
};

const isUserValid = async (id: string): Promise<boolean> => {
  if (!id) return false;
  try {
    const data = await getServerSession(authOptions);

    if (data?.user.id && data?.user.id === id) {
      return true;
    } else return false;
  } catch (error: unknown) {
    throw error;
  }
};

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
    console.log("response.count", response.count);
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

export const updateNotificationsStatus = async (id: string) => {
  if (!id) return;

  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(id);
    if (!isValidUser) throw new Error("Unauthorized !");

    await db
      .update(notfications)
      .set({ isShown: true })
      .where(eq(notfications.userId, id));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};
