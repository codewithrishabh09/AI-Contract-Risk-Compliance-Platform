import uuid
from decimal import Decimal

from pydantic import BaseModel


class VersionRiskPoint(BaseModel):
    contract_version_id: uuid.UUID
    version_number: int

    overall_risk_score: Decimal | None
    risk_level: str | None
    analysis_status: str | None

    finding_count: int
    high_risk_findings: int
    critical_findings: int


class ContractRiskTrendResponse(BaseModel):
    contract_id: uuid.UUID
    versions: list[VersionRiskPoint]

    current_version_number: int | None
    previous_version_number: int | None

    risk_score_change: Decimal | None
    risk_direction: str