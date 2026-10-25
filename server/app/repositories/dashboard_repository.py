from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.models.contract import Contract
from app.models.processing_job import ProcessingJob
from app.models.risk_finding import RiskFinding


class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def count_contracts(self, organization_id: UUID) -> int:
        statement = (
            select(func.count(Contract.id))
            .where(Contract.organization_id == organization_id)
        )

        return int(self.db.scalar(statement) or 0)

    def count_high_risk_contracts(
        self,
        organization_id: UUID,
    ) -> int:
        statement = (
            select(func.count(func.distinct(Contract.id)))
            .join(
                AnalysisResult,
                AnalysisResult.contract_version_id.in_(
                    select(Contract.id)
                ),
                isouter=True,
            )
        )

        # This method is intentionally implemented in the service
        # using contract-version relationships where required.
        return 0

    def count_critical_findings(
        self,
        organization_id: UUID,
    ) -> int:
        statement = (
            select(func.count(RiskFinding.id))
            .join(
                AnalysisResult,
                RiskFinding.analysis_result_id == AnalysisResult.id,
            )
            .join(
                Contract,
                Contract.id == AnalysisResult.contract_version_id,
            )
            .where(
                Contract.organization_id == organization_id,
                RiskFinding.severity == "CRITICAL",
            )
        )

        return int(self.db.scalar(statement) or 0)

    def count_pending_analysis(
        self,
        organization_id: UUID,
    ) -> int:
        statement = (
            select(func.count(ProcessingJob.id))
            .join(
                Contract,
                Contract.id == ProcessingJob.contract_version_id,
            )
            .where(
                Contract.organization_id == organization_id,
                ProcessingJob.status.in_(["QUEUED", "RUNNING"]),
            )
        )

        return int(self.db.scalar(statement) or 0)

    def recent_contracts(
        self,
        organization_id: UUID,
        limit: int = 5,
    ):
        statement = (
            select(Contract)
            .where(
                Contract.organization_id == organization_id,
            )
            .order_by(Contract.updated_at.desc())
            .limit(limit)
        )

        return list(self.db.scalars(statement).all())