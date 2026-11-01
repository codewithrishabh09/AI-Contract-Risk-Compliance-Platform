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
        statement = (
            select(func.count(Contract.id))
            .where(
                Contract.organization_id == organization_id,
            )
        )

        return int(
            self.db.scalar(statement) or 0
        )

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
                ContractVersion.contract_id
                == Contract.id,
            )
            .where(
                Contract.organization_id
                == organization_id,
                ProcessingJob.status.in_(
                    [
                        "QUEUED",
                        "RUNNING",
                    ]
                ),
            )
        )

        return int(
            self.db.scalar(statement) or 0
        )

    def get_latest_analysis_per_contract(
        self,
        organization_id: UUID,
    ):
        """
        Return a subquery containing the latest analysis
        result for every contract in the organization.

        One contract can have:
            Contract
              -> Version 1
              -> Version 2
              -> Version 3
                    ↓
                multiple analyses

        Dashboard should use only the latest analysis for
        each contract.
        """

        latest_analysis = (
            select(
                AnalysisResult.id.label(
                    "analysis_id",
                ),
                AnalysisResult.contract_version_id.label(
                    "contract_version_id",
                ),
                AnalysisResult.overall_risk_score.label(
                    "overall_risk_score",
                ),
                AnalysisResult.risk_level.label(
                    "risk_level",
                ),
                AnalysisResult.status.label(
                    "analysis_status",
                ),
                AnalysisResult.created_at.label(
                    "analysis_created_at",
                ),
                func.row_number().over(
                    partition_by=ContractVersion.contract_id,
                    order_by=(
                        AnalysisResult.created_at.desc(),
                        AnalysisResult.id.desc(),
                    ),
                ).label(
                    "row_number",
                ),
            )
            .join(
                ContractVersion,
                AnalysisResult.contract_version_id
                == ContractVersion.id,
            )
            .join(
                Contract,
                ContractVersion.contract_id
                == Contract.id,
            )
            .where(
                Contract.organization_id
                == organization_id,
            )
            .subquery()
        )

        return latest_analysis

    def get_risk_distribution(
        self,
        organization_id: UUID,
    ) -> dict[str, int]:
        latest_analysis = (
            self.get_latest_analysis_per_contract(
                organization_id,
            )
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

        rows = self.db.execute(
            statement,
        ).all()

        result = {
            "low": 0,
            "medium": 0,
            "high": 0,
            "critical": 0,
        }

        for risk_level, count in rows:
            if risk_level is None:
                continue

            normalized = str(
                risk_level,
            ).lower()

            if normalized in result:
                result[normalized] = int(
                    count,
                )

        return result

    def count_high_risk_contracts(
        self,
        organization_id: UUID,
    ) -> int:
        latest_analysis = (
            self.get_latest_analysis_per_contract(
                organization_id,
            )
        )

        statement = (
            select(
                func.count(),
            )
            .select_from(
                latest_analysis,
            )
            .where(
                latest_analysis.c.row_number == 1,
                func.upper(
                    latest_analysis.c.risk_level,
                ).in_(
                    [
                        "HIGH",
                        "CRITICAL",
                    ]
                ),
            )
        )

        return int(
            self.db.scalar(statement) or 0
        )

    def count_critical_findings(
        self,
        organization_id: UUID,
    ) -> int:
        """
        Count OPEN CRITICAL findings belonging only to
        the latest analysis of each contract.

        Older contract versions / analyses are intentionally
        excluded from the organization dashboard metric.
        """

        latest_analysis = (
            self.get_latest_analysis_per_contract(
                organization_id,
            )
        )

        statement = (
            select(
                func.count(RiskFinding.id),
            )
            .select_from(RiskFinding)
            .join(
                latest_analysis,
                RiskFinding.analysis_result_id
                == latest_analysis.c.analysis_id,
            )
            .where(
                latest_analysis.c.row_number == 1,
                RiskFinding.severity == "CRITICAL",
                RiskFinding.status == "OPEN",
            )
        )

        return int(
            self.db.scalar(statement) or 0
        )

    def get_recent_contracts(
        self,
        organization_id: UUID,
        limit: int = 5,
    ):
        """
        Return recently updated contracts together with their
        latest analysis without running one analysis query
        per contract.

        This avoids the previous N+1 query pattern.
        """

        latest_analysis = (
            self.get_latest_analysis_per_contract(
                organization_id,
            )
            .alias("latest_analysis")
        )

        statement = (
            select(
                Contract,
                latest_analysis,
            )
            .outerjoin(
                latest_analysis,
                (
                    Contract.id
                    == select(
                        ContractVersion.contract_id,
                    )
                    .where(
                        ContractVersion.id
                        == latest_analysis.c.contract_version_id,
                    )
                    .correlate(Contract)
                    .scalar_subquery()
                ),
            )
            .where(
                Contract.organization_id
                == organization_id,
            )
            .where(
                (
                    latest_analysis.c.row_number
                    == 1
                )
                | (
                    latest_analysis.c.row_number.is_(None)
                )
            )
            .order_by(
                Contract.updated_at.desc(),
            )
            .limit(limit)
        )

        rows = self.db.execute(
            statement,
        ).all()

        results = []

        for row in rows:
            contract = row[0]

            analysis = None

            if row[1] is not None:
                analysis_row = row[1]

                if (
                    analysis_row.row_number == 1
                ):
                    analysis = self.db.get(
                        AnalysisResult,
                        analysis_row.analysis_id,
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
        since = (
            datetime.now(timezone.utc)
            - timedelta(days=days)
        )

        statement = (
            select(
                func.date(
                    AnalysisResult.created_at,
                ).label("date"),
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
                ContractVersion.contract_id
                == Contract.id,
            )
            .where(
                Contract.organization_id
                == organization_id,
                AnalysisResult.created_at >= since,
                AnalysisResult.overall_risk_score.is_not(None),
            )
            .group_by(
                func.date(
                    AnalysisResult.created_at,
                ),
            )
            .order_by(
                func.date(
                    AnalysisResult.created_at,
                ),
            )
        )

        rows = self.db.execute(
            statement,
        ).all()

        return [
            {
                "date": str(row.date),
                "risk_score": float(
                    row.risk_score,
                ),
            }
            for row in rows
        ]