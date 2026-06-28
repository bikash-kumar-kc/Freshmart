import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET() {
  try {
    const featuredProducts = await db
      .select()
      .from(products)
      .where(and(eq(products.isFeatured, true), eq(products.status, "active")));

    return Response.json({ featuredProducts });
  } catch (error) {
    console.error(error);
  }
}
