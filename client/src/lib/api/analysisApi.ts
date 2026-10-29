import type {
  AnalysisResult,
} from "../../types/analysis";

import type {
  ProcessingJobStatusResponse,
} from "../../types/contractUpload";

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
    `/contracts/${encodeURIComponent(
      contractId,
    )}/versions/${encodeURIComponent(
      versionId,
    )}/analyze`,
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
    `/contracts/${encodeURIComponent(
      contractId,
    )}/versions/${encodeURIComponent(
      versionId,
    )}/analysis/latest`,
  );
}