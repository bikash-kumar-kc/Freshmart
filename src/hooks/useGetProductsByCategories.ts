import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getProductsByCategories } from "../lib/api calls/client/products/getProductsByCategories";

export const useGetProductsByCategories = (cats: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTSBYCATEGORIES, cats],
    queryFn: () => getProductsByCategories(cats),
    enabled: !!cats,
  });
};
