import uuid

from fastapi import Request
from sqlalchemy.orm import Session

from app.core.request_context import get_request_id
from app.models.audit_log import AuditLog
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)


class AuditService:

    @staticmethod
    def log(
        session: Session,
        *,
        organization_id: uuid.UUID,
        action: str,
        resource_type: str,
        user_id: uuid.UUID | None = None,
        resource_id: uuid.UUID | None = None,
        contract_id: uuid.UUID | None = None,
        contract_version_id: uuid.UUID | None = None,
        description: str | None = None,
        metadata: dict | None = None,
        request: Request | None = None,
    ) -> AuditLog:

        ip_address = None
        user_agent = None

        if request is not None:
            if request.client:
                ip_address = request.client.host

            user_agent = request.headers.get(
                "user-agent",
            )

        # Attach the current request ID so audit rows can be
        # correlated with application logs.
        metadata = {
            **(metadata or {}),
            "request_id": get_request_id(),
        }

        audit_log = AuditLog(
            organization_id=organization_id,
            user_id=user_id,
            contract_id=contract_id,
            contract_version_id=contract_version_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            description=description,
            metadata_json=metadata,
            ip_address=ip_address,
            user_agent=user_agent,
        )

        return AuditLogRepository.create(
            session,
            audit_log=audit_log,
        )