import type {
  ContractUploadResponse,
  ProcessingJobStatusResponse,
} from "../../types/contractUpload";

import { apiRequest } from "./api";

export async function uploadNewContract(
  title: string,
  contractType: string,
  description: string,
  file: File,
  changeSummary?: string,
): Promise<ContractUploadResponse> {
  const formData = new FormData();

  formData.append(
    "title",
    title,
  );

  formData.append(
    "contract_type",
    contractType,
  );

  if (description.trim()) {
    formData.append(
      "description",
      description.trim(),
    );
  }

  if (changeSummary?.trim()) {
    formData.append(
      "change_summary",
      changeSummary.trim(),
    );
  }

  formData.append(
    "file",
    file,
  );

  return apiRequest<ContractUploadResponse>(
    "/contracts/upload",
    {
      method: "POST",
      body: formData,
    },
  );
}


export async function uploadContractVersion(
  contractId: string,
  file: File,
  changeSummary?: string,
): Promise<ContractUploadResponse> {
  const formData = new FormData();

  if (changeSummary?.trim()) {
    formData.append(
      "change_summary",
      changeSummary.trim(),
    );
  }

  formData.append(
    "file",
    file,
  );

  return apiRequest<ContractUploadResponse>(
    `/contracts/${encodeURIComponent(
      contractId,
    )}/versions`,
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
    `/processing-jobs/${encodeURIComponent(
      jobId,
    )}`,
  );
}