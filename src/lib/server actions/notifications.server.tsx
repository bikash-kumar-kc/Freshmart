"use server";

import { db } from "@/src/db/config";
import { notfications, NotificationTypes } from "@/src/db/schema";
import { authOptions } from "@/src/lib/auth";
import { and, count, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NotificationType } from "@/src/types/notificationTypes";
import { randomUUID } from "node:crypto";


interface IUnreadNotificationTypes {
  totalCount: number;
}

interface IGetAllNotificationsTypes {
  totalNotifications: number;
  notifications: NotificationTypes[] | [];
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

export const getAllNotifications = async (
  id: string,
): Promise<IGetAllNotificationsTypes> => {
  try {
    if (!id?.trim()) throw new Error("User id is missing !");
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(id);
    if (!isValidUser) throw new Error("Unauthorized !");

    const response = await db
      .select()
      .from(notfications)
      .where(
        and(eq(notfications.userId, id), eq(notfications.isDelete, false)),
      );

    return {
      totalNotifications: response.length,
      notifications: response,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }

    throw error;
  }
};

export const markedNotification = async (userId: string, notifId: string) => {
  try {
    if (!userId?.trim() || !notifId?.trim()) {
      throw new Error("UserId or notifId is missing !");
    }

    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(userId);
    if (!isValidUser) throw new Error("Unauthorized !");
    await db
      .update(notfications)
      .set({ isMarked: true })
      .where(
        and(eq(notfications.userId, userId), eq(notfications.id, notifId)),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};

export const markedNotifications = async (userId: string) => {
  try {
    if (!userId?.trim()) {
      throw new Error("UserId is missing !");
    }

    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(userId);
    if (!isValidUser) throw new Error("Unauthorized !");
    await db
      .update(notfications)
      .set({ isMarked: true })
      .where(
        and(eq(notfications.userId, userId), eq(notfications.isMarked, false)),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};

export const deleteNotification = async (userId: string, notifId: string) => {
  try {
    if (!userId?.trim() || !notifId?.trim()) {
      throw new Error("UserId or notifId is missing !");
    }

    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(userId);
    if (!isValidUser) throw new Error("Unauthorized !");
    await db
      .update(notfications)
      .set({ isDelete: true })
      .where(
        and(eq(notfications.userId, userId), eq(notfications.id, notifId)),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};

export const deleteNotifications = async (userId: string) => {
  try {
    if (!userId?.trim()) {
      throw new Error("UserId is missing !");
    }

    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) throw new Error("Unauthenticated !");
    const isValidUser = await isUserValid(userId);
    if (!isValidUser) throw new Error("Unauthorized !");
    await db
      .update(notfications)
      .set({ isDelete: true })
      .where(
        and(eq(notfications.userId, userId), eq(notfications.isDelete, false)),
      );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    throw error;
  }
};

export const createNotification = async ({
  userId,
  type,
  content,
  title,
}: {
  userId: string;
  type: NotificationType;
  content: string;
  title: string;
}) => {
  try {
    if (!userId?.trim() || !type?.trim()) {
      console.log("userId is required !");
      return;
    }

    const session = await getServerSession(authOptions);
    if (!session || session?.user.id !== userId) {
      console.log("User is not authenticated");
      return;
    }

    await db
      .insert(notfications)
      .values({
        id: randomUUID(),
        userId: userId,
        type,
        title,
        content,
      })
      .returning({ id: notfications.id });

    return {
      success: true,
      message: "Notification created successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log("Failed to create notification !");
  }
};
