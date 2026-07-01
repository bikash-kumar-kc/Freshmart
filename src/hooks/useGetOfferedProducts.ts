import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getOfferedProducts } from "../lib/api calls/client/products/offeredProducts";



export const useGetOfferedProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.OFFERED_PRODUCTS],
    queryFn:getOfferedProducts,
  });
};

