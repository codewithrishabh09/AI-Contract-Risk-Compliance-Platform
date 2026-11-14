import { apiRequest } from "./api";

export interface ProcessingJob {
  id: string;
  contract_version_id: string;
  requested_by: string | null;
  job_type: string;
  status: string;
  attempt_count: number;
  max_attempts: number;
  error_code: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessingJobListResponse {
  items: ProcessingJob[];
  total: number;
  page: number;
  page_size: number;
}

export interface GetJobsParams {
  page?: number;
  page_size?: number;
  status?: string;
  job_type?: string;
}

export interface ProcessingJobStatusResponse {
  id: string;
  contract_version_id: string;
  job_type: string;
  status: string;
  attempt_count: number;
  max_attempts: number;
  error_code: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getJobs(
  params: GetJobsParams = {},
): Promise<ProcessingJobListResponse> {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params.page_size !== undefined) {
    searchParams.set(
      "page_size",
      String(params.page_size),
    );
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  if (params.job_type) {
    searchParams.set("job_type", params.job_type);
  }

  const query = searchParams.toString();

  return apiRequest<ProcessingJobListResponse>(
    `/jobs${query ? `?${query}` : ""}`,
  );
}

export async function getJob(
  jobId: string,
): Promise<ProcessingJobStatusResponse> {
  return apiRequest<ProcessingJobStatusResponse>(
    `/jobs/${jobId}`,
  );
}