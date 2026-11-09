import math
import uuid
from datetime import datetime
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
from app.schemas.audit import (
    AuditLogListResponse,
    AuditLogResponse,
    AuditSummaryResponse,
)


router = APIRouter(
    prefix="/audit",
    tags=["Audit"],
)


AuditReader = Annotated[
    User,
    Depends(require_permissions(Permission.AUDIT_READ)),
]


@router.get(
    "",
    response_model=AuditLogListResponse,
)
def get_audit_logs(
    current_user: AuditReader,
    session: Session = Depends(get_db),
    action: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    resource_type: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    user_id: uuid.UUID | None = Query(
        default=None,
    ),
    date_from: datetime | None = Query(
        default=None,
    ),
    date_to: datetime | None = Query(
        default=None,
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=25,
        ge=1,
        le=100,
    ),
):
    if date_from and date_to and date_from > date_to:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="date_from must be earlier than date_to.",
        )

    logs, total = AuditLogRepository.list_by_organization(
        session,
        organization_id=current_user.organization_id,
        page=page,
        page_size=page_size,
        action=action,
        resource_type=resource_type,
        user_id=user_id,
        date_from=date_from,
        date_to=date_to,
    )

    summary_data = AuditLogRepository.get_summary(
        session,
        organization_id=current_user.organization_id,
    )

    total_pages = (
        math.ceil(total / page_size)
        if total
        else 0
    )

    return AuditLogListResponse(
        items=[
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
                ip_address=log.ip_address,
                user_agent=log.user_agent,
                created_at=log.created_at,
            )
            for log in logs
        ],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1,
        summary=AuditSummaryResponse(
            **summary_data,
        ),
    )


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
            ip_address=log.ip_address,
            user_agent=log.user_agent,
            created_at=log.created_at,
        )
        for log in logs
    ]