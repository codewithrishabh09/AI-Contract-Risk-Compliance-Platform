import logging
import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DatabaseSession
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.repositories.risk_finding_repository import (
    RiskFindingRepository,
)
from app.schemas.analysis import (
    AnalysisResultResponse,
    RiskFindingResponse,
)
from app.services.analysis.service import (
    ContractAnalysisError,
    ContractAnalysisService,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/contracts",
    tags=["Contract Analysis"],
)


@router.post(
    "/{contract_id}/versions/{version_id}/analyze",
    response_model=AnalysisResultResponse,
    status_code=status.HTTP_201_CREATED,
)
def analyze_contract(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    session: DatabaseSession,
    current_user: CurrentUser,
) -> AnalysisResultResponse:

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

    try:
        analysis_result = ContractAnalysisService.analyze(
            session,
            organization_id=current_user.organization_id,
            contract_id=contract_id,
            contract_version_id=version_id,
        )

    except ContractAnalysisError as exc:
        session.rollback()
        logger.warning("Contract analysis failed: %s", exc)

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        session.rollback()
        logger.exception("Contract analysis failed unexpectedly")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Contract analysis failed.",
        ) from exc

    findings = RiskFindingRepository.list_by_analysis_result(
        session,
        analysis_result_id=analysis_result.id,
    )

    finding_responses = [
        RiskFindingResponse(
            id=str(finding.id),
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
    ]

    return AnalysisResultResponse(
        id=str(analysis_result.id),
        contract_version_id=str(
            analysis_result.contract_version_id
        ),
        overall_risk_score=analysis_result.overall_risk_score,
        risk_level=analysis_result.risk_level,
        status=analysis_result.status,
        summary=analysis_result.summary,
        model_provider=analysis_result.model_provider,
        model_name=analysis_result.model_name,
        prompt_version=analysis_result.prompt_version,
        findings=finding_responses,
    )