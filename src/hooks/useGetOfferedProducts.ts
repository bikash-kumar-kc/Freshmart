import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import OfferedProducts from "../components/client/product/OfferedProducts";


export const useGetOfferedProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.OFFERED_PRODUCTS],
    queryFn:OfferedProducts,
  });
};

