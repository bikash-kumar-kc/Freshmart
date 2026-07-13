import { getServerSession, Session } from "next-auth";
import { authOptions } from "../lib/auth/auth";

export const isUserLoggedIn = async (): Promise<{
  loggedIn: boolean;
  userId?: string;
  session?:Session
}> => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { loggedIn: false };
  }
  const userId = session.user.id;

  return { loggedIn: true, userId,session };
};
