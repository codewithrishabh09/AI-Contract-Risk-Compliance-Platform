import type {
  ContractDashboard,
  DashboardOverview,
} from "../../types/dashboard";
import { apiRequest } from "./api";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>("/dashboard/overview");
}

export async function getContractDashboard(
  contractId: string,
  versionId: string,
): Promise<ContractDashboard> {
  return apiRequest<ContractDashboard>(
    `/contracts/${encodeURIComponent(
      contractId,
    )}/versions/${encodeURIComponent(versionId)}/dashboard`,
  );
}