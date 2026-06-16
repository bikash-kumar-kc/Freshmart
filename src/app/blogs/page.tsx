// ─────────────────────────────────────────────
// app/blog/page.tsx — sample usage
// ─────────────────────────────────────────────

import { BlogCardProps } from "@/src/components/client/BlogCard";
import BlogGrid from "@/src/components/client/BlogList";


const MOCK_POSTS: BlogCardProps[] = [
  {
    slug: "organic-vegetables-more-nutrients",
    title: "Why organic vegetables have more nutrients than conventional ones",
    excerpt:
      "Studies show organically grown produce contains higher concentrations of polyphenols and antioxidants. We break down what the science actually says.",
    thumbnail: "https://loremflickr.com/800/450/vegetables,organic",
    category: "Nutrition",
    author: { name: "Sita Rai" },
    publishedAt: "2026-06-10T08:00:00Z",
    readTimeMinutes: 5,
  },
  {
    slug: "soil-health-organic-farming",
    title: "The soil beneath your food: how organic farming rebuilds the earth",
    excerpt:
      "Conventional farming depletes topsoil 10x faster than nature can rebuild it. Organic practices restore microbial life and produce healthier crops.",
    thumbnail: "https://loremflickr.com/800/450/soil,farming",
    category: "Farming",
    author: { name: "Bikash Tamang" },
    publishedAt: "2026-06-05T08:00:00Z",
    readTimeMinutes: 7,
  },
  {
    slug: "pesticide-free-food-children",
    title: "Pesticide-free food for your children: what every parent should know",
    excerpt:
      "Children's developing nervous systems are more sensitive to pesticide residues. A practical guide to which foods matter most to buy organic.",
    thumbnail: "https://loremflickr.com/800/450/vegetables,organic",
    category: "Family",
    author: { name: "Priya Maharjan" },
    publishedAt: "2026-05-28T08:00:00Z",
    readTimeMinutes: 6,
  },
  {
    slug: "organic-vegetables-more-nutrients",
    title: "Why organic vegetables have more nutrients than conventional ones",
    excerpt:
      "Studies show organically grown produce contains higher concentrations of polyphenols and antioxidants. We break down what the science actually says.",
    thumbnail: "https://loremflickr.com/800/450/vegetables,organic",
    category: "Nutrition",
    author: { name: "Sita Rai" },
    publishedAt: "2026-06-10T08:00:00Z",
    readTimeMinutes: 5,
  },
  {
    slug: "soil-health-organic-farming",
    title: "The soil beneath your food: how organic farming rebuilds the earth",
    excerpt:
      "Conventional farming depletes topsoil 10x faster than nature can rebuild it. Organic practices restore microbial life and produce healthier crops.",
    thumbnail: "https://loremflickr.com/800/450/soil,farming",
    category: "Farming",
    author: { name: "Bikash Tamang" },
    publishedAt: "2026-06-05T08:00:00Z",
    readTimeMinutes: 7,
  },
  {
    slug: "pesticide-free-food-children",
    title: "Pesticide-free food for your children: what every parent should know",
    excerpt:
      "Children's developing nervous systems are more sensitive to pesticide residues. A practical guide to which foods matter most to buy organic.",
    thumbnail: "https://loremflickr.com/800/450/vegetables,organic",
    category: "Family",
    author: { name: "Priya Maharjan" },
    publishedAt: "2026-05-28T08:00:00Z",
    readTimeMinutes: 6,
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-medium text-gray-900
        dark:text-[#f5f5f5] mb-2">
        From the farm
      </h1>
      <p className="text-gray-500 dark:text-[#a3a3a3] mb-10">
        Articles on organic food, sustainable farming, and healthy living.
      </p>
      <BlogGrid posts={MOCK_POSTS} />
    </main>
  );
}