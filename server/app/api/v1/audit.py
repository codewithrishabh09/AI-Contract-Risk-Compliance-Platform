import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser, get_db
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)
from app.schemas.audit import AuditLogResponse


router = APIRouter(
    prefix="/audit",
    tags=["Audit"],
)


@router.get(
    "/contracts/{contract_id}",
    response_model=list[AuditLogResponse],
)
def get_contract_activity(
    contract_id: uuid.UUID,
    current_user: CurrentUser,
    session: Session = Depends(get_db),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=50,
        ge=1,
        le=100,
    ),
):
    logs = AuditLogRepository.list_by_contract(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        page=page,
        page_size=page_size,
    )

    return [
        AuditLogResponse(
            id=log.id,
            user_id=log.user_id,
            contract_id=log.contract_id,
            contract_version_id=log.contract_version_id,
            action=log.action,
            resource_type=log.resource_type,
            resource_id=log.resource_id,
            description=log.description,
            metadata_json=log.metadata_json,
            created_at=log.created_at,
        )
        for log in logs
    ]