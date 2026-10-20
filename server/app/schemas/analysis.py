from decimal import Decimal
from typing import Any

from pydantic import (
    BaseModel,
    Field,
    field_validator,
    model_validator,
)

ALLOWED_LEVELS = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}
ALLOWED_ANALYSIS_STATUSES = {"COMPLETED", "NEEDS_REVIEW", "FAILED"}


def _normalize_choice(value: Any, allowed: set[str], name: str) -> str:
    normalized = str(value).strip().upper().replace(" ", "_")

    if normalized not in allowed:
        raise ValueError(
            f"{name} must be one of {sorted(allowed)}, got {value!r}"
        )

    return normalized


class RiskFindingInput(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=200)
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

    @field_validator("category", "title", mode="before")
    @classmethod
    def _strip_and_truncate(cls, value: Any, info) -> Any:
        if not isinstance(value, str):
            return value

        limit = 80 if info.field_name == "category" else 200
        return value.strip()[:limit]

    @field_validator("severity", mode="before")
    @classmethod
    def _normalize_severity(cls, value: Any) -> str:
        return _normalize_choice(value, ALLOWED_LEVELS, "severity")

    @model_validator(mode="after")
    def _fix_page_range(self) -> "RiskFindingInput":
        if (
            self.page_start is not None
            and self.page_end is not None
            and self.page_end < self.page_start
        ):
            self.page_end = self.page_start

        return self


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

    @field_validator("risk_level", mode="before")
    @classmethod
    def _normalize_risk_level(cls, value: Any) -> str:
        return _normalize_choice(value, ALLOWED_LEVELS, "risk_level")

    @field_validator("status", mode="before")
    @classmethod
    def _normalize_status(cls, value: Any) -> str:
        return _normalize_choice(
            value,
            ALLOWED_ANALYSIS_STATUSES,
            "status",
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