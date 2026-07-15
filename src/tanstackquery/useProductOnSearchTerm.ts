import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getProductOnSearchTerm } from "../lib/search/productOnSearchTerm";

const useProductOnSearchTerm = (keyword: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_ON_SEARCH_TERM + keyword],
    queryFn: () => getProductOnSearchTerm(keyword),
    enabled: !!keyword,
  });
};

export default useProductOnSearchTerm;
