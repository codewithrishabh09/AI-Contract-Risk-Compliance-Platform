from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


ContractType = Literal[
    "NDA",
    "EMPLOYMENT",
    "SERVICE_AGREEMENT",
    "VENDOR_AGREEMENT",
    "DATA_PROCESSING_AGREEMENT",
    "PRIVACY_POLICY",
    "OTHER",
]

ContractStatus = Literal[
    "DRAFT",
    "UPLOADED",
    "PROCESSING",
    "ANALYZED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
    "ARCHIVED",
]


class ContractCreate(BaseModel):
    """Validate incoming contract creation requests."""

    title: str = Field(
        min_length=1,
        max_length=255,
        examples=["Software Services Agreement"],
    )

    contract_type: ContractType = Field(
        examples=["SERVICE_AGREEMENT"],
    )

    description: str | None = Field(
        default=None,
        max_length=5000,
    )


class ContractResponse(BaseModel):
    """Public representation of a contract."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    organization_id: UUID
    created_by: UUID
    title: str
    contract_type: ContractType
    status: ContractStatus
    description: str | None
    created_at: datetime
    updated_at: datetime


class ContractListResponse(BaseModel):
    """Paginated contract listing response."""

    items: list[ContractResponse]
    total: int = Field(ge=0)
    offset: int = Field(ge=0)
    limit: int = Field(ge=1, le=100)
