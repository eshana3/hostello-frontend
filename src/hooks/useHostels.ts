import { useQuery } from "@tanstack/react-query";
import { fetchHostels } from "@/lib/api";
import type { HostelGroup } from "@/types";

export function useHostels() {
  return useQuery<HostelGroup[]>({
    queryKey: ["hostels"],
    queryFn: fetchHostels,
    staleTime: Infinity,
  });
}
