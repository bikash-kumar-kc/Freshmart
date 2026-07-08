"use server"
import { db } from "@/src/db/config";
import { users } from "@/src/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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
      .values({
        id: uniqueId,
        email,
        password: hashPassword,
        name: "Bikash" + Date.now(),
      })
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
