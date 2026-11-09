import uuid
from datetime import datetime

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.models.audit_log import AuditLog


class AuditLogRepository:

    @staticmethod
    def create(
        session: Session,
        *,
        audit_log: AuditLog,
    ) -> AuditLog:
        session.add(audit_log)
        session.flush()

        return audit_log

    @staticmethod
    def list_by_organization(
        session: Session,
        *,
        organization_id: uuid.UUID,
        page: int = 1,
        page_size: int = 50,
        action: str | None = None,
        resource_type: str | None = None,
        user_id: uuid.UUID | None = None,
        date_from: datetime | None = None,
        date_to: datetime | None = None,
    ) -> tuple[list[AuditLog], int]:

        filters = [
            AuditLog.organization_id == organization_id,
        ]

        if action:
            filters.append(
                AuditLog.action == action,
            )

        if resource_type:
            filters.append(
                AuditLog.resource_type == resource_type,
            )

        if user_id:
            filters.append(
                AuditLog.user_id == user_id,
            )

        if date_from:
            filters.append(
                AuditLog.created_at >= date_from,
            )

        if date_to:
            filters.append(
                AuditLog.created_at <= date_to,
            )

        total_statement = (
            select(func.count(AuditLog.id))
            .where(*filters)
        )

        total = session.scalar(total_statement) or 0

        offset = (page - 1) * page_size

        statement = (
            select(AuditLog)
            .where(*filters)
            .order_by(
                AuditLog.created_at.desc(),
            )
            .offset(offset)
            .limit(page_size)
        )

        logs = list(
            session.scalars(statement).all()
        )

        return logs, total

    @staticmethod
    def get_summary(
        session: Session,
        *,
        organization_id: uuid.UUID,
    ) -> dict[str, int]:

        base_filter = (
            AuditLog.organization_id == organization_id
        )

        total_events = (
            session.scalar(
                select(func.count(AuditLog.id))
                .where(base_filter)
            )
            or 0
        )

        authentication_events = (
            session.scalar(
                select(func.count(AuditLog.id))
                .where(
                    base_filter,
                    or_(
                        AuditLog.resource_type.ilike(
                            "%AUTH%"
                        ),
                        AuditLog.action.ilike(
                            "%LOGIN%"
                        ),
                        AuditLog.action.ilike(
                            "%LOGOUT%"
                        ),
                        AuditLog.action.ilike(
                            "%REGISTER%"
                        ),
                    ),
                )
            )
            or 0
        )

        contract_events = (
            session.scalar(
                select(func.count(AuditLog.id))
                .where(
                    base_filter,
                    AuditLog.resource_type.ilike(
                        "%CONTRACT%"
                    ),
                )
            )
            or 0
        )

        analysis_events = (
            session.scalar(
                select(func.count(AuditLog.id))
                .where(
                    base_filter,
                    AuditLog.resource_type.ilike(
                        "%ANALYSIS%"
                    ),
                )
            )
            or 0
        )

        security_events = (
            session.scalar(
                select(func.count(AuditLog.id))
                .where(
                    base_filter,
                    or_(
                        AuditLog.resource_type.ilike(
                            "%SECURITY%"
                        ),
                        AuditLog.action.ilike(
                            "%SECURITY%"
                        ),
                        AuditLog.action.ilike(
                            "%BLOCK%"
                        ),
                        AuditLog.action.ilike(
                            "%DENY%"
                        ),
                        AuditLog.action.ilike(
                            "%FAIL%"
                        ),
                    ),
                )
            )
            or 0
        )

        return {
            "total_events": total_events,
            "authentication_events": authentication_events,
            "contract_events": contract_events,
            "analysis_events": analysis_events,
            "security_events": security_events,
        }

    @staticmethod
    def list_by_contract(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        page: int = 1,
        page_size: int = 50,
    ) -> list[AuditLog]:

        offset = (page - 1) * page_size

        statement = (
            select(AuditLog)
            .where(
                AuditLog.organization_id == organization_id,
                AuditLog.contract_id == contract_id,
            )
            .order_by(
                AuditLog.created_at.desc(),
            )
            .offset(offset)
            .limit(page_size)
        )

        return list(
            session.scalars(statement).all()
        )