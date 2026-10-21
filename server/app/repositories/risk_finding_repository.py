import uuid

from sqlalchemy import case, func, select
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
                    case(
                        (RiskFinding.severity == "LOW", 1),
                        else_=0,
                    )
                ).label("low"),
                func.sum(
                    case(
                        (RiskFinding.severity == "MEDIUM", 1),
                        else_=0,
                    )
                ).label("medium"),
                func.sum(
                    case(
                        (RiskFinding.severity == "HIGH", 1),
                        else_=0,
                    )
                ).label("high"),
                func.sum(
                    case(
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
    
    @staticmethod
    def list_filtered(
        session: Session,
        *,
        analysis_result_id: uuid.UUID,
        severity: str | None = None,
        category: str | None = None,
        finding_status: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[RiskFinding], int]:

        conditions = [
            RiskFinding.analysis_result_id == analysis_result_id,
        ]

        if severity:
            conditions.append(
                RiskFinding.severity == severity,
            )

        if category:
            conditions.append(
                RiskFinding.category == category,
            )

        if finding_status:
            conditions.append(
                RiskFinding.status == finding_status,
            )

        count_statement = select(
            func.count(RiskFinding.id)
        ).where(*conditions)

        total = session.scalar(count_statement) or 0

        offset = (page - 1) * page_size

        statement = (
            select(RiskFinding)
            .where(*conditions)
            .order_by(
                RiskFinding.created_at.desc(),
            )
            .offset(offset)
            .limit(page_size)
        )

        findings = list(
            session.scalars(statement).all()
        )

        return findings, total
