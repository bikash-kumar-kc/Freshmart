import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "./categories";
import Link from "next/link";

export async function CategoryItem({
  cat,
  isActive,
}: {
  cat: (typeof CATEGORIES)[number];
  isActive: boolean;
}) {
  return (
    <Link href={`/categories/${cat.slug}`}>
      <button
        className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left
        transition-all duration-150 group
        ${
          isActive
            ? "bg-green-700 text-white"
            : "hover:bg-green-50 text-gray-700"
        }
      `}
      >
        <span className="text-base leading-none shrink-0">{cat.emoji}</span>
        <span
          className={`text-sm font-medium flex-1 leading-none ${
            isActive ? "text-white" : "text-gray-700"
          }`}
        >
          {cat.label}
        </span>
        <ChevronRight
          size={13}
          className={`shrink-0 transition-opacity ${
            isActive
              ? "opacity-70 text-white"
              : "opacity-0 group-hover:opacity-40"
          }`}
        />
      </button>
    </Link>
  );
}
