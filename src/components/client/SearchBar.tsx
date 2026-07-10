"use client";

import { useCallback, useState } from "react";
import { Search, X } from "lucide-react";
import useDebounce from "@/src/hooks/useDebounce";
import Suggestions from "@/components/Suggestion";
import { useRouter } from "next/navigation";
import { useSearchBarResult } from "@/src/hooks/useSearchBar";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { debouncedTerm } = useDebounce(searchTerm, 500);
  const { data, isLoading } = useSearchBarResult(debouncedTerm);

  const handleSearchSubmit: React.SubmitEventHandler<HTMLFormElement> =
    useCallback(
      (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        setSearchTerm("")
        router.push(`/product/${searchTerm}`);
      },
      [router, searchTerm],
    );

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex w-full border border-gray-300 rounded-[10px] lg:rounded-3xl overflow-visible bg-white">
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
            disabled={!searchTerm.trim()}
            className="px-4 bg-[#ffeaef] text-gray-600 flex items-center justify-center cursor-pointer hover:bg-[#e27991] hover:text-white duration-200"
          >
            <Search />
          </button>
        </div>
      </form>

      {searchTerm.length > 0 && (
        <div className="absolute z-50 top-14 left-0 w-full">
          <Suggestions suggestions={data ?? []} showLoading={isLoading} RemoveSuggestion={()=>setSearchTerm("")} />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
