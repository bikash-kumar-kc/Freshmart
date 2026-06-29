"use client";

import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getFeaturedProducts } from "../lib/api calls/client/products/featuredProducts";

import { useSuspenseQuery } from '@tanstack/react-query'

export function useGetFeaturedProducts() {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCT],
    queryFn: getFeaturedProducts,
  })
}