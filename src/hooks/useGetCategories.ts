import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getCategories } from "../lib/api calls/client/products/getCategories";

export const useGetCategories = () => {
  console.log("here in the query hook !")
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn:getCategories,
  });
};


