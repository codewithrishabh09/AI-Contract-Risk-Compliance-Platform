from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class DashboardMetric(BaseModel):
    value: int | float
    change_percent: float | None = None


class DashboardRiskDistribution(BaseModel):
    low: int = 0
    medium: int = 0
    high: int = 0
    critical: int = 0


class DashboardTrendPoint(BaseModel):
    date: str
    risk_score: float


class DashboardRecentContract(BaseModel):
    id: UUID
    title: str
    contract_type: str
    status: str
    risk_score: Decimal | None = None
    risk_level: str | None = None
    updated_at: datetime


class DashboardOverviewResponse(BaseModel):
    total_contracts: int
    high_risk_contracts: int
    critical_findings: int
    pending_analysis: int

    risk_distribution: DashboardRiskDistribution

    risk_trend: list[DashboardTrendPoint]

    recent_contracts: list[DashboardRecentContract]