import uuid

from sqlalchemy import select
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
    ) -> list[AuditLog]:
        offset = (page - 1) * page_size

        statement = (
            select(AuditLog)
            .where(
                AuditLog.organization_id == organization_id,
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