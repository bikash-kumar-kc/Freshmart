"use client";

import  { useCallback, useState } from "react";
import { Search, X } from "lucide-react";
import useDebounce from "@/src/hooks/useDebounce";
import useProductOnSearchTerm from "@/src/tanstackquery/useProductOnSearchTerm";
import Suggestions, { ISuggestionTypes } from "@/components/Suggestion";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { debouncedTerm } = useDebounce(searchTerm, 500);
  const { data, isLoading } = useProductOnSearchTerm(debouncedTerm);

  const handleSearchSubmit = useCallback(() => {
    if (!searchTerm.trim()) return;
    router.push(`/displayProducts/${searchTerm}`);
  }, [router, searchTerm]);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex w-full border border-gray-300 rounded-[10px] lg:rounded-3xl overflow-hidden bg-white">
          <input
            type="text"
            value={searchTerm}
            placeholder="Search products..."
            className="w-full p-3 px-5 focus:outline-none text-black placeholder:text-gray-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            name="search-input"
          />
          {searchTerm?.length > 0 && (
            <button
              type="button"
              className="text-gray-600 flex items-center justify-center cursor-pointer mr-2"
              onClick={() => setSearchTerm("")}
            >
              <X />
            </button>
          )}
          <button
            type="submit"
            className="px-4 bg-[#ffeaef] text-gray-600 flex items-center justify-center cursor-pointer"
          >
            <Search />
          </button>
        </div>
      </form>

      {searchTerm.length > 0 && (
        <div className="absolute z-20 top-14 left-0 w-full">
          <Suggestions
            suggestions={data as ISuggestionTypes["suggestions"]}
            showLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
