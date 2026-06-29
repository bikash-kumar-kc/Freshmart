import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getCategories } from "../lib/api calls/client/products/getCategories";

export const useGetCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn:getCategories,
  });
};


