"use server";
import { eq } from "drizzle-orm";
import { db } from "../db/config";
import { users } from "../db/schema";

interface ISUBSCRIPTIONTYPES {
  sub: PushSubscription;
  userId: string;
}

interface IRESPONSETYPES {
  success: boolean;
  msg: string;
}
export const subscriptionNotify = async ({
  sub,
  userId,
}: ISUBSCRIPTIONTYPES) => {
  // get userId and if the request userId and current userId matched or not...

  if (!sub) {
    throw new Error("Failed to subscription !!!");
  }

  await db
    .update(users)
    .set({ pushSubscription: JSON.stringify(sub.toJSON()) })
    .where(eq(users.id, userId));
};

export const unsubscriptionNotify = async ({ userId }: { userId: string }) => {
  // CHECK USER...
  await db
    .update(users)
    .set({ pushSubscription: null })
    .where(eq(users.id, userId));

  return {
    success: true,
    msg: "unsubscribe successfully !",
  };
};
