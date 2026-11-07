import type { ComplianceOverview } from "../../types/compliance";

import { apiRequest } from "./api";

export async function getComplianceOverview(
  contractId: string,
  versionId: string,
): Promise<ComplianceOverview> {
  return apiRequest<ComplianceOverview>(
    `/contracts/${encodeURIComponent(contractId)}/versions/${encodeURIComponent(versionId)}/dashboard`,
  );
}