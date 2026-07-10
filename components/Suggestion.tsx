import { ISearchResult } from "@/src/types/searchBar.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export interface ISuggestionTypes {
  suggestions: ISearchResult[] | [];
  showLoading: boolean;
  RemoveSuggestion: () => void;
}
const Suggestion = ({ suggestions, showLoading,RemoveSuggestion }: ISuggestionTypes) => {
  const router = useRouter();
  const handleOnClick = useCallback(
    (slug: string, category: string) => {
      router.push(`/product/${category}/${slug}`);
    },
    [router],
  );

  if (showLoading) {
    return (
      <div className="mt-2 bg-white rounded-lg py-3">
        <div className="flex flex-col gap-3">
          {/* Show 5 skeleton items */}
          {[...Array(5)].map((_, idx) => (
            <SkeletonItem key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="mt-2 bg-white text-black rounded-lg p-3 ">
        <p className="text-xs font-medium">
          No suggestions found. Try searching something else!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-700 rounded-lg border border-gray-100 py-3 shadow-sm shadow-gray-200">
      <div className="flex flex-col gap-2">
        {suggestions?.map((suggestion, idx) => {
          return (
            <div
              key={suggestion?.productId || idx}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 cursor-pointer h-fit"
              onClick={() => {
                handleOnClick(suggestion.slug, suggestion.category);
                RemoveSuggestion();
              }}
            >
              <div className="relative w-8 h-8">
                <Image
                  src={suggestion.thumbnail}
                  alt={suggestion.productName}
                  fill
                  className="rounded-full"
                />
              </div>
              <p className="text-xs mobile:md:text-sm md:text-[1rem] font-medium ">
                {suggestion.productName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkeletonItem = () => (
  <div className="flex items-center gap-2 px-3 animate-pulse">
    {/* Circle skeleton for image */}
    <div className="w-8 h-8 bg-gray-200 rounded-full relative overflow-hidden">
      <div className="absolute inset-0 shimmer"></div>
    </div>
    {/* Text skeleton */}
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded relative overflow-hidden w-full">
        <div className="absolute inset-0 shimmer"></div>
      </div>
    </div>
  </div>
);

export default Suggestion;
