import { manageError } from "@/src/utils/response";

export const isUserSubscribed = async (userId: string) => {
  if (!userId) return false;

  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to get user subscription status");
    }
    const data: { isSubscribed: boolean } = await response.json();
    if (!data?.isSubscribed) {
      return false;
    }
    return true;
  } catch (error) {
    const errMsg = manageError(error);
    console.log(errMsg ?? "Failed to check the user subscription status");
    return false;
  }
};
