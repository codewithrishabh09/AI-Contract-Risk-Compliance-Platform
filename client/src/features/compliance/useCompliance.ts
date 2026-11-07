import { useQuery } from "@tanstack/react-query";

import { getComplianceOverview } from "../../lib/api/complianceApi";

export function useComplianceOverview(
  contractId: string,
  versionId: string | null,
) {
  return useQuery({
    queryKey: [
      "compliance-overview",
      contractId,
      versionId,
    ],
    queryFn: () =>
      getComplianceOverview(
        contractId,
        versionId!,
      ),
    enabled:
      Boolean(contractId) &&
      Boolean(versionId),
    staleTime: 30_000,
  });
}