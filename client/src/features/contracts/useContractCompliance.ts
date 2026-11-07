import { useQuery } from "@tanstack/react-query";

import { getContractDashboard } from "../../lib/api/dashboardApi";

export function useContractCompliance(
  contractId: string,
  versionId: string | null,
) {
  return useQuery({
    queryKey: ["contract-compliance", contractId, versionId],
    queryFn: () =>
      getContractDashboard(
        contractId,
        versionId!,
      ),
    enabled: Boolean(contractId) && Boolean(versionId),
    staleTime: 30_000,
  });
}