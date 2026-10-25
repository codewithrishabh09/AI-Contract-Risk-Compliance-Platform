import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "../../lib/api/dashboardApi";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}