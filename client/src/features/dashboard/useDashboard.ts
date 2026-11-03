import { useQuery } from "@tanstack/react-query";

import { getDashboardOverview } from "../../lib/api/dashboardApi";

export const DASHBOARD_QUERY_KEY = [
  "dashboard",
  "overview",
] as const;

export function useDashboard() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: getDashboardOverview,

    // Dashboard data should become stale quickly
    // because contracts and analysis can change frequently.
    staleTime: 5_000,

    // When the dashboard component mounts again,
    // fetch fresh server data if the cached data is stale.
    refetchOnMount: true,

    // If user switches back to the application,
    // refresh stale dashboard data.
    refetchOnWindowFocus: true,

    // Retry temporary backend/network failures.
    retry: 2,
  });
}