import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "../../lib/api/dashboardApi";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: getDashboardOverview,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}