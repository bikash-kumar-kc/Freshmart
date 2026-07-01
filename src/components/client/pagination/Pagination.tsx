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
  console.log("here in pagination component");
  const { data: categoriesInfo, isLoading: loadingCategories } =
    useGetCategories();

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
    categoriesInfo?.categories?.length / categoriesPerPage,
  );
  const currentPage = Number(page ?? 1);

  return (
    <div className="w-full max-w-7xl m-auto">
      <div className="w-full flex justify-end flex-row items-cente">
        <Pagination className="flex justify-end">
          <PaginationContent>
           

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
                    isActive={page === (currentPage ? currentPage : 1)}
                  >
                    <Link
                      href={{
                        pathname: "/",
                        query: {
                          page,
                          categories: pageCategories
                            .map((c) => c.trim())
                            .join(","),
                        },
                      }}
                      scroll={false}
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
