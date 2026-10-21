import uuid
from decimal import Decimal

from pydantic import BaseModel, Field


class RiskCategorySummary(BaseModel):
    category: str
    total: int
    low: int
    medium: int
    high: int
    critical: int


class ContractDashboardResponse(BaseModel):
    contract_id: uuid.UUID
    contract_version_id: uuid.UUID

    contract_title: str
    contract_type: str
    contract_status: str

    overall_risk_score: Decimal | None
    risk_level: str | None
    analysis_status: str | None

    total_findings: int
    open_findings: int
    high_risk_findings: int
    critical_findings: int

    categories: list[RiskCategorySummary] = Field(
        default_factory=list,
    )