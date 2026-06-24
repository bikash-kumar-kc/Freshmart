"use client";

import { QUERY_KEYS } from "../app/constants/queryKeys";
import { getFeaturedProducts } from "../lib/server actions/feature.server.action";

import { useSuspenseQuery } from '@tanstack/react-query'

export function useGetFeaturedProducts() {
  return useSuspenseQuery({
    queryKey: [QUERY_KEYS.FEATURED_PRODUCT],
    queryFn: getFeaturedProducts,
  })
}