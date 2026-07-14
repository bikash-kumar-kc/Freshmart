import { db } from "@/src/db/config";
import { users } from "@/src/db/schema";
import { manageError } from "@/src/utils/response";
import { eq } from "drizzle-orm";


export const GET = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> },
) => {
  try {
    const { userId } = await params;
    if (!userId) {
      return Response.json(
        {
          success: false,
          message: "User Id is required !",
        },
        {
          status: 400,
        },
      );
    }

    const [user] = await db
      .select({ userId: users.id, subscription: users.pushSubscription })
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist",
        },
        {
          status: 400,
        },
      );
    }

    const isSubscribed = user.subscription;

    return Response.json(
      {
        success: true,
        message: isSubscribed
          ? "User has subscribed !"
          : "User has not subscribed",
        isSubscribed:!!isSubscribed,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const errMsg = manageError(error);
    return Response.json(
      {
        success: false,
        message: errMsg ?? "Failed to check subscription status",
      },
      {
        status: 500,
      },
    );
  }
};
