import BlogCard, { BlogCardProps } from "./BlogCard";
 
interface BlogGridProps {
  posts: BlogCardProps[];
}
 
export default function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center text-gray-400 py-20">
        No articles yet — check back soon.
      </p>
    );
  }
 
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.slug} {...post} />
      ))}
    </div>
  );
}