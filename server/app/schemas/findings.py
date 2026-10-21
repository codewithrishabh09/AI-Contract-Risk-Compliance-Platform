import uuid
from decimal import Decimal

from pydantic import BaseModel, Field


class RiskFindingItem(BaseModel):
    id: uuid.UUID
    category: str
    title: str
    description: str
    severity: str
    recommendation: str | None
    evidence_text: str | None
    page_start: int | None
    page_end: int | None
    confidence_score: Decimal | None
    status: str


class RiskFindingListResponse(BaseModel):
    items: list[RiskFindingItem]

    page: int
    page_size: int
    total: int
    total_pages: int

    has_next: bool
    has_previous: bool