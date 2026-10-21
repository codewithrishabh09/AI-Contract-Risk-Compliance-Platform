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
