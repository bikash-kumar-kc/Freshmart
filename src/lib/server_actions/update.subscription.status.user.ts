"use server";
import { db } from "@/src/db/config";
import { users } from "@/src/db/schema";
import { manageError } from "@/src/utils/response";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { toast } from "react-toastify";
import { authOptions } from "../auth/auth";

interface ISubscriptionType {
  userId: string;
  subscription: string;
}

export const updateUserSubscriptionStatus = async ({
  userId,
  subscription,
}: ISubscriptionType) => {
  try {
    if (!userId?.trim() || !subscription) {
      toast.error("User Id or subscription is missing !");
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("User is not logged in");
    }

    const isActualUser = userId === session.user.id;
    if (!isActualUser) {
      throw new Error("Unauthorized");
    }

    const [user] = await db
      .select({ subscription: users.pushSubscription })
      .from(users)
      .where(eq(users.id, userId));

    if (user.subscription) {
      return;
    }

    await db
      .update(users)
      .set({ pushSubscription: subscription })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    const message = manageError(error);
    throw new Error(message);
  }
};
