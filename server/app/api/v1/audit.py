import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.user import User
from app.repositories.audit_log_repository import (
    AuditLogRepository,
)
from app.repositories.contract_repository import ContractRepository
from app.schemas.audit import AuditLogResponse


router = APIRouter(
    prefix="/audit",
    tags=["Audit"],
)


# Permission-protected current user dependency.
# Flow: JWT -> CurrentUser -> role -> ROLE_PERMISSIONS -> check
AuditReader = Annotated[
    User,
    Depends(require_permissions(Permission.AUDIT_READ)),
]


@router.get(
    "/contracts/{contract_id}",
    response_model=list[AuditLogResponse],
)
def get_contract_activity(
    contract_id: uuid.UUID,
    current_user: AuditReader,
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
    contract = ContractRepository.get_by_id(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
    )

    if contract is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        )

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