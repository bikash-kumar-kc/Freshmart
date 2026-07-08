import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { searchProducts } from "../lib/server_actions/searchBar.server.action";

export const useSearchBarResult = (searchQuery: string | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_BAR, searchQuery],
    queryFn: () => searchProducts(searchQuery as string),
    enabled: !!searchQuery,
  });
};
