import { revalidateTag } from "next/cache";

export const revalidateCacheTag = (tag: string, profile = "max") => {
  if (!tag?.trim()) return;
  revalidateTag(tag, profile);
};
