import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class AuditLogResponse(BaseModel):
    id: uuid.UUID

    user_id: uuid.UUID | None

    contract_id: uuid.UUID | None

    contract_version_id: uuid.UUID | None

    action: str
    resource_type: str
    resource_id: uuid.UUID | None

    description: str | None

    metadata_json: dict | None

    ip_address: str | None

    user_agent: str | None

    created_at: datetime


class AuditSummaryResponse(BaseModel):
    total_events: int
    authentication_events: int
    contract_events: int
    analysis_events: int
    security_events: int


class AuditLogListResponse(BaseModel):
    items: list[AuditLogResponse] = Field(
        default_factory=list,
    )

    page: int
    page_size: int

    total: int
    total_pages: int

    has_next: bool
    has_previous: bool

    summary: AuditSummaryResponse