// app/actions/search.ts
"use server";

import { db } from "@/src/db/config";
import { products } from "@/src/db/schema";
import { or, like } from "drizzle-orm";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  category: string;
  thumbnail: string;
  score: number;
}

function scoreProduct(
  product: { name: string; keywords: string; category: string },
  query: string
): number {
  const q = query.toLowerCase().trim();
  let score = 0;

  const title = product.name.toLowerCase();
  if (title === q) score += 15;
  else if (title.startsWith(q)) score += 10;
  else if (title.includes(q)) score += 6;

  const keywords = product.keywords.toLowerCase().split(",").map(k => k.trim());
  for (const kw of keywords) {
    if (kw === q) score += 8;
    else if (kw.startsWith(q)) score += 5;
    else if (kw.includes(q)) score += 3;
  }

  const category = product.category.toLowerCase();
  if (category === q) score += 4;
  else if (category.startsWith(q)) score += 2;
  else if (category.includes(q)) score += 1;

  return score;
}

export async function getProductOnSearchTerm(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  const likeQuery = `%${q}%`;

  const candidates = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      category: products.category,
      keywords: products.keywords,
      thumbnail: products.thumbnail,
      status: products.status,
    })
    .from(products)
    .where(
      or(
        like(products.name, likeQuery),
        like(products.keywords, likeQuery),
        like(products.category, likeQuery)
      )
    )
    .limit(50);

  return candidates
    .filter((p) => p.status === "active")
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      thumbnail: p.thumbnail,
      score: scoreProduct(p, q),
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}