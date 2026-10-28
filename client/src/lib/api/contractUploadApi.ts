import { apiRequest } from "./api";

import type {
  ContractUploadResponse,
  ProcessingJobStatusResponse,
} from "../../types/contractUpload";

export async function uploadContractVersion(
  contractId: string,
  file: File,
  changeSummary?: string,
): Promise<ContractUploadResponse> {
  const formData = new FormData();

  formData.append("file", file);

  if (changeSummary?.trim()) {
    formData.append(
      "change_summary",
      changeSummary.trim(),
    );
  }

  return apiRequest<ContractUploadResponse>(
    `/contracts/${contractId}/versions`,
    {
      method: "POST",
      body: formData,
    },
  );
}

export async function getProcessingJobStatus(
  jobId: string,
): Promise<ProcessingJobStatusResponse> {
  return apiRequest<ProcessingJobStatusResponse>(
    `/jobs/${jobId}`,
  );
}