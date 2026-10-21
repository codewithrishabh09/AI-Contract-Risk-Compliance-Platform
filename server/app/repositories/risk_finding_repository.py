import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import case

from app.models.risk_finding import RiskFinding

case(
    (RiskFinding.severity == "LOW", 1),
    else_=0,
)
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
    
    @staticmethod
    def get_dashboard_category_summary(
        session: Session,
        *,
        analysis_result_id: uuid.UUID,
    ):
        statement = (
            select(
                RiskFinding.category,
                func.count(RiskFinding.id).label("total"),
                func.sum(
                    func.case(
                        (RiskFinding.severity == "LOW", 1),
                        else_=0,
                    )
                ).label("low"),
                func.sum(
                    func.case(
                        (RiskFinding.severity == "MEDIUM", 1),
                        else_=0,
                    )
                ).label("medium"),
                func.sum(
                    func.case(
                        (RiskFinding.severity == "HIGH", 1),
                        else_=0,
                    )
                ).label("high"),
                func.sum(
                    func.case(
                        (RiskFinding.severity == "CRITICAL", 1),
                        else_=0,
                    )
                ).label("critical"),
            )
            .where(
                RiskFinding.analysis_result_id == analysis_result_id,
            )
            .group_by(
                RiskFinding.category,
            )
            .order_by(
                RiskFinding.category.asc(),
            )
        )

        return session.execute(statement).all()