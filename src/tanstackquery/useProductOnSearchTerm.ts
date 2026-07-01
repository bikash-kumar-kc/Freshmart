import { useQuery } from "@tanstack/react-query";
import { getProductOnSearchTerm } from "../lib/productOnSearchTerm";
import { QUERY_KEYS } from "../app/constants/queryKeys";


const useProductOnSearchTerm = (keyword: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_ON_SEARCH_TERM + keyword],
    queryFn: () => getProductOnSearchTerm(keyword),
    enabled: !!keyword,
  });
};

export default useProductOnSearchTerm;
