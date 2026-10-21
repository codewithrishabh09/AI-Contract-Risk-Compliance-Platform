import uuid
from datetime import datetime

from pydantic import BaseModel


class ProcessingJobResponse(BaseModel):
    id: uuid.UUID
    contract_version_id: uuid.UUID
    requested_by: uuid.UUID | None
    job_type: str
    status: str
    attempt_count: int
    max_attempts: int
    error_code: str | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime


class ProcessingJobStatusResponse(BaseModel):
    id: uuid.UUID
    contract_version_id: uuid.UUID
    job_type: str
    status: str
    attempt_count: int
    max_attempts: int
    error_code: str | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime