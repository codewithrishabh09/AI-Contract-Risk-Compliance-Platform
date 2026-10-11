from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


DocumentStatus = Literal[
    "PENDING",
    "SCANNING",
    "AVAILABLE",
    "QUARANTINED",
    "FAILED",
    "DELETED",
]

ProcessingJobType = Literal[
    "TEXT_EXTRACTION",
    "CLAUSE_EXTRACTION",
    "FULL_ANALYSIS",
    "REANALYSIS",
]

ProcessingJobStatus = Literal[
    "QUEUED",
    "RUNNING",
    "SUCCEEDED",
    "FAILED",
    "CANCELLED",
]


class ContractVersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contract_id: UUID
    version_number: int
    uploaded_by: UUID
    change_summary: str | None
    created_at: datetime


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contract_version_id: UUID
    original_filename: str
    storage_provider: str
    content_type: str
    file_size_bytes: int = Field(ge=1)
    sha256_checksum: str | None
    status: DocumentStatus
    created_at: datetime


class ProcessingJobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    contract_version_id: UUID
    requested_by: UUID | None
    job_type: ProcessingJobType
    status: ProcessingJobStatus
    attempt_count: int
    max_attempts: int
    error_code: str | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ContractUploadResponse(BaseModel):
    contract_version: ContractVersionResponse
    document: DocumentResponse
    processing_job: ProcessingJobResponse