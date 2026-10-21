import math
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser, get_db
from app.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.repositories.risk_finding_repository import (
    RiskFindingRepository,
)
from app.schemas.findings import (
    RiskFindingItem,
    RiskFindingListResponse,
)


router = APIRouter(
    prefix="/contracts",
    tags=["Risk Findings"],
)


@router.get(
    "/{contract_id}/versions/{version_id}/findings",
    response_model=RiskFindingListResponse,
)
def list_risk_findings(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    current_user: CurrentUser,
    session: Session = Depends(get_db),
    severity: str | None = Query(
        default=None,
        min_length=1,
        max_length=20,
    ),
    category: str | None = Query(
        default=None,
        min_length=1,
        max_length=100,
    ),
    finding_status: str | None = Query(
        default=None,
        alias="status",
        min_length=1,
        max_length=20,
    ),
    page: int = Query(
        default=1,
        ge=1,
    ),
    page_size: int = Query(
        default=20,
        ge=1,
        le=100,
    ),
):
    contract_version = (
        ContractVersionRepository.get_by_id_for_contract(
            session,
            organization_id=current_user.organization_id,
            contract_id=contract_id,
            contract_version_id=version_id,
        )
    )

    if contract_version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract version not found.",
        )

    analysis_result = (
        AnalysisResultRepository
        .get_latest_for_organization_contract_version(
            session,
            organization_id=current_user.organization_id,
            contract_id=contract_id,
            contract_version_id=version_id,
        )
    )

    if analysis_result is None:
        return RiskFindingListResponse(
            items=[],
            page=page,
            page_size=page_size,
            total=0,
            total_pages=0,
            has_next=False,
            has_previous=page > 1,
        )

    findings, total = (
        RiskFindingRepository.list_filtered(
            session,
            analysis_result_id=analysis_result.id,
            severity=severity,
            category=category,
            finding_status=finding_status,
            page=page,
            page_size=page_size,
        )
    )

    total_pages = (
        math.ceil(total / page_size)
        if total
        else 0
    )

    return RiskFindingListResponse(
        items=[
            RiskFindingItem(
                id=finding.id,
                category=finding.category,
                title=finding.title,
                description=finding.description,
                severity=finding.severity,
                recommendation=finding.recommendation,
                evidence_text=finding.evidence_text,
                page_start=finding.page_start,
                page_end=finding.page_end,
                confidence_score=finding.confidence_score,
                status=finding.status,
            )
            for finding in findings
        ],
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_previous=page > 1,
    )