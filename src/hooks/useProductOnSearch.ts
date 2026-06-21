import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getProductByCategorySlug } from "../lib/server actions/product.server.action";

export const useProductOnSearch = (categorySlug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT_ON_SEARCH, categorySlug],
    queryFn: () => getProductByCategorySlug(categorySlug),
    enabled: !!categorySlug,
  });
};


