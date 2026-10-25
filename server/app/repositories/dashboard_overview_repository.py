from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.models.contract import Contract
from app.models.contract_version import ContractVersion
from app.models.processing_job import ProcessingJob
from app.models.risk_finding import RiskFinding


class DashboardOverviewRepository:
    def __init__(self, db: Session):
        self.db = db

    def count_contracts(
        self,
        organization_id: UUID,
    ) -> int:
        statement = select(func.count(Contract.id)).where(
            Contract.organization_id == organization_id,
        )

        return int(self.db.scalar(statement) or 0)

    def count_pending_analysis(
        self,
        organization_id: UUID,
    ) -> int:
        statement = (
            select(func.count(ProcessingJob.id))
            .join(
                ContractVersion,
                ProcessingJob.contract_version_id
                == ContractVersion.id,
            )
            .join(
                Contract,
                ContractVersion.contract_id == Contract.id,
            )
            .where(
                Contract.organization_id == organization_id,
                ProcessingJob.status.in_(
                    ["QUEUED", "RUNNING"],
                ),
            )
        )

        return int(self.db.scalar(statement) or 0)

    def get_latest_analysis_per_contract(
        self,
        organization_id: UUID,
    ):
        latest_analysis = (
            select(
                AnalysisResult.id.label("analysis_id"),
                AnalysisResult.contract_version_id,
                AnalysisResult.overall_risk_score,
                AnalysisResult.risk_level,
                AnalysisResult.created_at,
                func.row_number()
                .over(
                    partition_by=ContractVersion.contract_id,
                    order_by=AnalysisResult.created_at.desc(),
                )
                .label("row_number"),
            )
            .join(
                ContractVersion,
                AnalysisResult.contract_version_id
                == ContractVersion.id,
            )
            .join(
                Contract,
                ContractVersion.contract_id == Contract.id,
            )
            .where(
                Contract.organization_id == organization_id,
            )
            .subquery()
        )

        return latest_analysis

    def get_risk_distribution(
        self,
        organization_id: UUID,
    ) -> dict[str, int]:
        latest_analysis = self.get_latest_analysis_per_contract(
            organization_id,
        )

        statement = (
            select(
                latest_analysis.c.risk_level,
                func.count().label("count"),
            )
            .where(
                latest_analysis.c.row_number == 1,
            )
            .group_by(
                latest_analysis.c.risk_level,
            )
        )

        rows = self.db.execute(statement).all()

        result = {
            "low": 0,
            "medium": 0,
            "high": 0,
            "critical": 0,
        }

        for risk_level, count in rows:
            if risk_level is None:
                continue

            normalized = str(risk_level).lower()

            if normalized in result:
                result[normalized] = int(count)

        return result

    def count_high_risk_contracts(
        self,
        organization_id: UUID,
    ) -> int:
        latest_analysis = self.get_latest_analysis_per_contract(
            organization_id,
        )

        statement = select(
            func.count(),
        ).where(
            latest_analysis.c.row_number == 1,
            latest_analysis.c.risk_level.in_(
                ["HIGH", "CRITICAL"],
            ),
        )

        return int(self.db.scalar(statement) or 0)

    def count_critical_findings(
        self,
        organization_id: UUID,
    ) -> int:
        statement = (
            select(func.count(RiskFinding.id))
            .join(
                AnalysisResult,
                RiskFinding.analysis_result_id
                == AnalysisResult.id,
            )
            .join(
                ContractVersion,
                AnalysisResult.contract_version_id
                == ContractVersion.id,
            )
            .join(
                Contract,
                ContractVersion.contract_id == Contract.id,
            )
            .where(
                Contract.organization_id == organization_id,
                RiskFinding.severity == "CRITICAL",
                RiskFinding.status == "OPEN",
            )
        )

        return int(self.db.scalar(statement) or 0)

    def get_recent_contracts(
        self,
        organization_id: UUID,
        limit: int = 5,
    ):
        contracts_statement = (
            select(Contract)
            .where(
                Contract.organization_id == organization_id,
            )
            .order_by(
                Contract.updated_at.desc(),
            )
            .limit(limit)
        )

        contracts = list(
            self.db.scalars(
                contracts_statement,
            ).all()
        )

        results = []

        for contract in contracts:
            latest_analysis_statement = (
                select(AnalysisResult)
                .join(
                    ContractVersion,
                    AnalysisResult.contract_version_id
                    == ContractVersion.id,
                )
                .where(
                    ContractVersion.contract_id
                    == contract.id,
                )
                .order_by(
                    AnalysisResult.created_at.desc(),
                )
                .limit(1)
            )

            analysis = self.db.scalar(
                latest_analysis_statement,
            )

            results.append(
                {
                    "contract": contract,
                    "analysis": analysis,
                }
            )

        return results

    def get_risk_trend(
        self,
        organization_id: UUID,
        days: int = 30,
    ):
        since = datetime.now(timezone.utc) - timedelta(
            days=days,
        )

        statement = (
            select(
                func.date(AnalysisResult.created_at).label(
                    "date",
                ),
                func.avg(
                    AnalysisResult.overall_risk_score,
                ).label("risk_score"),
            )
            .join(
                ContractVersion,
                AnalysisResult.contract_version_id
                == ContractVersion.id,
            )
            .join(
                Contract,
                ContractVersion.contract_id == Contract.id,
            )
            .where(
                Contract.organization_id == organization_id,
                AnalysisResult.created_at >= since,
            )
            .group_by(
                func.date(AnalysisResult.created_at),
            )
            .order_by(
                func.date(AnalysisResult.created_at),
            )
        )

        rows = self.db.execute(statement).all()

        return [
            {
                "date": str(row.date),
                "risk_score": float(row.risk_score),
            }
            for row in rows
        ]