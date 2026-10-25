import type { DashboardOverview } from "../../types/dashboard";
import { apiRequest } from "./api";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>(
    "/dashboard/overview",
  );
}
