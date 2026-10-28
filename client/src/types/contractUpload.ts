export type DocumentStatus =
  | "PENDING"
  | "SCANNING"
  | "AVAILABLE"
  | "QUARANTINED"
  | "FAILED"
  | "DELETED";

export type ProcessingJobType =
  | "TEXT_EXTRACTION"
  | "CLAUSE_EXTRACTION"
  | "FULL_ANALYSIS"
  | "REANALYSIS";

export type ProcessingJobStatus =
  | "QUEUED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";

export interface ContractVersionResponse {
  id: string;
  contract_id: string;
  version_number: number;
  uploaded_by: string;
  change_summary: string | null;
  created_at: string;
}

export interface DocumentResponse {
  id: string;
  contract_version_id: string;
  original_filename: string;
  storage_provider: string;
  content_type: string;
  file_size_bytes: number;
  sha256_checksum: string | null;
  status: DocumentStatus;
  created_at: string;
}

export interface ProcessingJobStatusResponse {
  id: string;
  contract_version_id: string;
  job_type: ProcessingJobType;
  status: ProcessingJobStatus;
  attempt_count: number;
  max_attempts: number;
  error_code: string | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContractUploadResponse {
  contract_version: ContractVersionResponse;
  document: DocumentResponse;
  processing_job: ProcessingJobStatusResponse;
}