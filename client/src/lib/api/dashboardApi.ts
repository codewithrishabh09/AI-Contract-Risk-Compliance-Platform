import apiClient from "./apiClient";
import type { DashboardOverview } from "../../types/dashboard";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const response = await apiClient.get<DashboardOverview>(
    "/dashboard/overview",
  );

  return response.data;
}