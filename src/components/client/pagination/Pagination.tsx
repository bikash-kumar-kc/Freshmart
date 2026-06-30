"use client";
import { useGetCategories } from "@/src/hooks/useGetCategories";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

const PaginationComponent = ({ page='0' }: { page?: string }) => {
  console.log("here in pagination component")
  const { data: categoriesInfo, isLoading: loadingCategories } =
    useGetCategories();

    console.log("categoriesInfo")
    console.log(categoriesInfo)

  if (loadingCategories) {
    return (
      <div className="w-full max-w-7xl m-auto">
        <div className="w-full flex justify-end items-center bg-gray-500">
          <p>loading...</p>
        </div>
      </div>
    );
  }

  if (!categoriesInfo) {
    return;
  }

  const categoriesPerPage = 2;
  const totalPages = Math.ceil(
    categoriesInfo.categories.length / categoriesPerPage,
  );
  const currentPage = Number(page ?? 1);

  return (
    <div className="w-full max-w-7xl m-auto">
      <div className="w-full flex justify-end flex-row items-cente">
        <Pagination className="flex justify-end">
          <PaginationContent>
            {/* Previous */}
            {/* {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious>
                  <Link
                    href={{
                      pathname: "/",
                      query: {
                        page: currentPage - 1,
                        categories: categoriesInfo.categories
                          .slice((currentPage - 2) * 2, currentPage * 2 - 2)
                          .join(","),
                      },
                    }}
                  />
                </PaginationPrevious>
              </PaginationItem>
            )} */}

            {/* Pages */}
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;

              const pageCategories = categoriesInfo.categories.slice(
                index * categoriesPerPage,
                index * categoriesPerPage + categoriesPerPage,
              );

              return (
                <PaginationItem key={page}>
                  <PaginationLink isActive={page === currentPage}>
                    <Link
                      href={{
                        pathname: "/",
                        query: {
                          page,
                          categories: pageCategories.map(c=>c.trim()).join(","),
                        },
                      }}
                    >
                      {page}
                    </Link>
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next */}
            {/* {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext>
                  <Link
                    href={{
                      pathname: "/products",
                      query: {
                        page: currentPage + 1,
                        categories: categoriesInfo.categories
                          .slice(currentPage * 2, currentPage * 2 + 2)
                          .join(","),
                      },
                    }}
                  />
                </PaginationNext>
              </PaginationItem>
            )} */}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
