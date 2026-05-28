"use client";
import { useQuery } from "@tanstack/react-query";
import { MOCK_IS_ADMIN } from "@/lib/mockAdmin";

export function useAdminCheck() {
  return { isAdmin: MOCK_IS_ADMIN };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    refetchInterval: 30000, // poll every 30 seconds
    staleTime: 0,
  });
}
