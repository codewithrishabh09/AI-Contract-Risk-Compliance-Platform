import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult


class AnalysisResultRepository:
    """Repository for contract analysis results."""

    @staticmethod
    def get_by_id(
        session: Session,
        *,
        analysis_result_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = select(AnalysisResult).where(
            AnalysisResult.id == analysis_result_id
        )

        return session.scalar(statement)

    @staticmethod
    def get_latest_for_contract_version(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> AnalysisResult | None:
        statement = (
            select(AnalysisResult)
            .where(
                AnalysisResult.contract_version_id
                == contract_version_id
            )
            .order_by(AnalysisResult.created_at.desc())
            .limit(1)
        )

        return session.scalar(statement)

    @staticmethod
    def create(
        session: Session,
        *,
        analysis_result: AnalysisResult,
    ) -> AnalysisResult:
        session.add(analysis_result)
        session.flush()

        return analysis_result