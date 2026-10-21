import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DatabaseSession
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.repositories.contract_repository import ContractRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)
from app.repositories.analysis_result_repository import (
    AnalysisResultRepository,
)
from app.repositories.risk_finding_repository import (
    RiskFindingRepository,
)
from app.schemas.analysis import (
    AnalysisResultResponse,
    RiskFindingResponse,
)
from app.schemas.contract_document import ProcessingJobResponse
from app.worker.celery_app import celery_app


router = APIRouter(
    prefix="/contracts",
    tags=["Contract Analysis"],
)


@router.post(
    "/{contract_id}/versions/{version_id}/analyze",
    response_model=ProcessingJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def analyze_contract(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    session: DatabaseSession,
    current_user: CurrentUser,
) -> ProcessingJobResponse:

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

    job = ProcessingJobRepository.create(
        session,
        contract_version_id=version_id,
        requested_by=current_user.id,
        job_type="FULL_ANALYSIS",
        status="QUEUED",
    )

    ContractRepository.update_status(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        status="PROCESSING",
    )

    session.commit()
    session.refresh(job)

    try:
        celery_app.send_task(
            "app.worker.analysis_tasks.analyze_contract_task",
            kwargs={
                "job_id": str(job.id),
                "organization_id": str(
                    current_user.organization_id
                ),
                "contract_id": str(contract_id),
                "contract_version_id": str(version_id),
            },
        )

    except Exception as exc:
        job.status = "FAILED"
        job.error_code = "QUEUE_DISPATCH_FAILED"
        job.error_message = "Unable to queue analysis job."

        session.commit()

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to queue contract analysis.",
        ) from exc

    return ProcessingJobResponse.model_validate(job)

@router.get(
    "/{contract_id}/versions/{version_id}/analysis/latest",
    response_model=AnalysisResultResponse,
)
def get_latest_analysis(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    current_user: CurrentUser,
    session: DatabaseSession,
):
    contract_version = ContractVersionRepository.get_by_id_for_contract(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        contract_version_id=version_id,
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No analysis result found for this contract version.",
        )

    findings = RiskFindingRepository.list_by_analysis_result(
        session,
        analysis_result_id=analysis_result.id,
    )

    return AnalysisResultResponse(
        id=str(analysis_result.id),
        contract_version_id=str(analysis_result.contract_version_id),
        overall_risk_score=analysis_result.overall_risk_score,
        risk_level=analysis_result.risk_level,
        status=analysis_result.status,
        summary=analysis_result.summary,
        model_provider=analysis_result.model_provider,
        model_name=analysis_result.model_name,
        prompt_version=analysis_result.prompt_version,
        findings=[
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
        ],
    )
