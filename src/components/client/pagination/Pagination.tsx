"use client";
import { useGetCategories } from "@/src/hooks/useGetCategories";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const PaginationComponent = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) ?? 1;
  const { data: categoriesInfo, isLoading: loadingCategories } =
    useGetCategories();

  if (loadingCategories) {
    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="w-full flex justify-end items-center bg-gray-500">
          {/* <p>loading...</p> */}
        </div>
      </div>
    );
  }

  if (!categoriesInfo) {
    return;
  }

  const categoriesPerPage = 2;
  const totalPages = Math.ceil(
    categoriesInfo?.categories?.length / categoriesPerPage,
  );
  const currentPage = Number(page ?? 1);

  return (
    <div className="w-full max-w-7xl m-auto relative py-4">
      <div className="w-full flex justify-end flex-row items-center mt-12  ">
        <Pagination className="flex justify-center">
          <PaginationContent className="flex gap-4">
            {/* Pages */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              const pageCategories = categoriesInfo.categories.slice(
                index * categoriesPerPage,
                index * categoriesPerPage + categoriesPerPage,
              );

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={{
                      pathname: "/",
                      query: {
                        page,
                        categories: pageCategories.join(","),
                      },
                    }}
                    scroll={false}
                    isActive={page === (currentPage ?? 1)}
                    className={`
    h-10 w-10 rounded-sm border transition-all duration-200
    ${
      page === (currentPage ?? 1)
        ? "bg-green-500 text-white shadow-md"
        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
    }
  `}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
