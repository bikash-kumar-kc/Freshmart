import {  useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getPopularProducts } from "../lib/api calls/server/getPopularProducts";

export const useGetPopularProducts = () => {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.POPULAR_PRODUCTS],
    queryFn:getPopularProducts,
  });
};

// export const useGetPopularProducts = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.POPULAR_PRODUCTS],
//     queryFn: getPopularProducts,
//   });
// };
