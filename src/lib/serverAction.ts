"use server";
import { eq } from "drizzle-orm";
import { db } from "../db/config";
import { users } from "../db/schema";
import { IREGISTERTYPES } from "../app/register/page";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

interface ISUBSCRIPTIONTYPES {
  sub: PushSubscription;
  userId: string;
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

export const registerUser = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = data;

    if (!email || !password) {
      throw new Error("Email or password is required !");
    }

    const [isExist] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email));

    if (isExist?.id) {
      throw new Error("User with this email already exist !");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    if (!hashPassword) throw new Error("Failed to hashed password !");

    const uniqueId = nanoid();

    const newUser = await db
      .insert(users)
      .values({ id: uniqueId, email, password: hashPassword ,name:"Bikash"+ Date.now()})
      .returning();

    if (!newUser) {
      throw new Error("Failed to create new User !");
    }

    return { id: newUser[0].id, email: newUser[0].email };
  } catch (error) {
    console.log("Failed to register user !");
    throw error;
  }
};
