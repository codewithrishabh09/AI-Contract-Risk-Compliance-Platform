import type { ContractRiskTrend } from "../../types/versionAnalysis";
import { apiRequest } from "./api";

export async function getContractRiskTrend(
  contractId: string,
  versionId: string,
): Promise<ContractRiskTrend> {
  return apiRequest<ContractRiskTrend>(
    `/contracts/${encodeURIComponent(contractId)}/versions/${encodeURIComponent(versionId)}/risk-trend`,
  );
}