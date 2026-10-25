from __future__ import annotations

from uuid import UUID

from sqlalchemy.orm import Session

from app.repositories.dashboard_overview_repository import (
    DashboardOverviewRepository,
)
from app.schemas.dashboard_overview import (
    DashboardOverviewResponse,
    DashboardRecentContract,
    DashboardRiskDistribution,
    DashboardTrendPoint,
)


class DashboardOverviewService:
    def __init__(self, db: Session):
        self.repository = DashboardOverviewRepository(db)

    def get_overview(
        self,
        organization_id: UUID,
    ) -> DashboardOverviewResponse:
        total_contracts = self.repository.count_contracts(
            organization_id,
        )

        high_risk_contracts = (
            self.repository.count_high_risk_contracts(
                organization_id,
            )
        )

        critical_findings = (
            self.repository.count_critical_findings(
                organization_id,
            )
        )

        pending_analysis = (
            self.repository.count_pending_analysis(
                organization_id,
            )
        )

        distribution = (
            self.repository.get_risk_distribution(
                organization_id,
            )
        )

        trend_rows = self.repository.get_risk_trend(
            organization_id,
        )

        recent_rows = self.repository.get_recent_contracts(
            organization_id,
            limit=5,
        )

        recent_contracts = []

        for item in recent_rows:
            contract = item["contract"]
            analysis = item["analysis"]

            recent_contracts.append(
                DashboardRecentContract(
                    id=contract.id,
                    title=contract.title,
                    contract_type=str(
                        contract.contract_type,
                    ),
                    status=str(contract.status),
                    risk_score=(
                        analysis.overall_risk_score
                        if analysis
                        else None
                    ),
                    risk_level=(
                        str(analysis.risk_level)
                        if analysis
                        else None
                    ),
                    updated_at=contract.updated_at,
                )
            )

        return DashboardOverviewResponse(
            total_contracts=total_contracts,
            high_risk_contracts=high_risk_contracts,
            critical_findings=critical_findings,
            pending_analysis=pending_analysis,
            risk_distribution=DashboardRiskDistribution(
                **distribution,
            ),
            risk_trend=[
                DashboardTrendPoint(**item)
                for item in trend_rows
            ],
            recent_contracts=recent_contracts,
        )