from decimal import Decimal

from pydantic import BaseModel, Field


class RiskFindingInput(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    severity: str
    recommendation: str | None = None
    evidence_text: str | None = None
    page_start: int | None = Field(default=None, ge=1)
    page_end: int | None = Field(default=None, ge=1)
    confidence_score: Decimal | None = Field(
        default=None,
        ge=0,
        le=1,
    )


class ContractAnalysisOutput(BaseModel):
    overall_risk_score: Decimal = Field(
        ge=0,
        le=100,
    )

    risk_level: str

    status: str = "NEEDS_REVIEW"

    summary: str

    findings: list[RiskFindingInput] = Field(
        default_factory=list
    )


class RiskFindingResponse(BaseModel):
    id: str
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


class AnalysisResultResponse(BaseModel):
    id: str
    contract_version_id: str
    overall_risk_score: Decimal | None
    risk_level: str
    status: str
    summary: str | None
    model_provider: str | None
    model_name: str | None
    prompt_version: str | None
    findings: list[RiskFindingResponse] = Field(
        default_factory=list
    )