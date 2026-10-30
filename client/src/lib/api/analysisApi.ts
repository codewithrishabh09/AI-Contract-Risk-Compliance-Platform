import type {
  AnalysisResult,
  RiskFindingFilters,
  RiskFindingListResponse,
} from "../../types/analysis";
import type { ProcessingJobStatusResponse } from "../../types/contractUpload";
import { apiRequest } from "./api";

export interface StartAnalysisResponse {
  job_id: string;
  contract_id: string;
  contract_version_id: string;
  status: string;
}

export async function startContractAnalysis(
  contractId: string,
  versionId: string,
): Promise<StartAnalysisResponse> {
  return apiRequest<StartAnalysisResponse>(
    `/contracts/${encodeURIComponent(contractId)}/versions/${encodeURIComponent(versionId)}/analyze`,
    {
      method: "POST",
    },
  );
}

export async function getAnalysisJobStatus(
  jobId: string,
): Promise<ProcessingJobStatusResponse> {
  return apiRequest<ProcessingJobStatusResponse>(
    `/jobs/${encodeURIComponent(jobId)}`,
  );
}

export async function getLatestContractAnalysis(
  contractId: string,
  versionId: string,
): Promise<AnalysisResult | null> {
  return apiRequest<AnalysisResult | null>(
    `/contracts/${encodeURIComponent(contractId)}/versions/${encodeURIComponent(versionId)}/analysis/latest`,
  );
}

export async function getRiskFindings(
  contractId: string,
  versionId: string,
  filters: RiskFindingFilters = {},
): Promise<RiskFindingListResponse> {
  const params = new URLSearchParams();

  if (filters.severity) {
    params.set("severity", filters.severity);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.page_size !== undefined) {
    params.set("page_size", String(filters.page_size));
  }

  const queryString = params.toString();

  const endpoint =
    `/contracts/${encodeURIComponent(contractId)}` +
    `/versions/${encodeURIComponent(versionId)}` +
    `/findings` +
    (queryString ? `?${queryString}` : "");

  return apiRequest<RiskFindingListResponse>(endpoint);
}