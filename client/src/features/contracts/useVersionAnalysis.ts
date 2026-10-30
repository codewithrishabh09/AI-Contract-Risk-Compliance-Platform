import { useQuery } from "@tanstack/react-query";

import { getContractRiskTrend } from "../../lib/api/versionAnalysisApi";

export function useContractRiskTrend(
  contractId: string,
  versionId: string | null,
) {
  return useQuery({
    queryKey: ["contract-risk-trend", contractId, versionId],
    queryFn: () => getContractRiskTrend(contractId, versionId!),
    enabled: Boolean(contractId) && Boolean(versionId),
  });
}