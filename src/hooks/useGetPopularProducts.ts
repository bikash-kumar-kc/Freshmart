import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getPopularProducts } from "../lib/server actions/getPopularProducts";


export const useGetPopularProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.POPULAR_PRODUCTS],
    queryFn:getPopularProducts,
  });
};


