import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchTrendingProducts } from "@/lib/api";
import type { ProductFilters } from "@/types";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: fetchTrendingProducts,
    staleTime: 5 * 60 * 1000,
  });
}
