"use client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

export function useAdminCheck() {
  const { user } = useAuth();
  return { isAdmin: user?.isAdmin === true };
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("hm_auth_token") : null;
      const res = await fetch("/api/admin/stats", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 0,
  });
}
