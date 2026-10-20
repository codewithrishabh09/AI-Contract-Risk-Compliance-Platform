import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.risk_finding import RiskFinding


class RiskFindingRepository:
    """Repository for contract risk findings."""

    @staticmethod
    def create(
        session: Session,
        *,
        risk_finding: RiskFinding,
    ) -> RiskFinding:
        session.add(risk_finding)
        session.flush()

        return risk_finding

    @staticmethod
    def list_by_analysis_result(
        session: Session,
        *,
        analysis_result_id: uuid.UUID,
    ) -> list[RiskFinding]:
        statement = (
            select(RiskFinding)
            .where(
                RiskFinding.analysis_result_id
                == analysis_result_id
            )
            .order_by(
                RiskFinding.created_at.asc()
            )
        )

        return list(session.scalars(statement).all())