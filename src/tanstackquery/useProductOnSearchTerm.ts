import { useQuery } from "@tanstack/react-query";
import { getProductOnSearchTerm } from "../lib/productOnSearchTerm";
import { QUERY_QUERYNAME } from "../QueryConstants";

const useProductOnSearchTerm = (keyword: string) => {
  return useQuery({
    queryKey: [QUERY_QUERYNAME.PRODUCT_ON_SEARCH_TERM + keyword],
    queryFn: () => getProductOnSearchTerm(keyword),
    enabled: !!keyword,
  });
};

export default useProductOnSearchTerm;
