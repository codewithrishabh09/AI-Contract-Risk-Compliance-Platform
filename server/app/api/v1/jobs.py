import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies import CurrentUser
from app.repositories.processing_job_repository import ProcessingJobRepository
from app.schemas.processing import ProcessingJobStatusResponse


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.get(
    "/{job_id}",
    response_model=ProcessingJobStatusResponse,
)
def get_job_status(
    job_id: uuid.UUID,
    current_user: CurrentUser,
    session: Session = Depends(get_db),
):
    job = ProcessingJobRepository.get_by_id_for_organization(
        session,
        organization_id=current_user.organization_id,
        job_id=job_id,
    )

    if job is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Processing job not found.",
        )

    return ProcessingJobStatusResponse(
        id=job.id,
        contract_version_id=job.contract_version_id,
        job_type=job.job_type,
        status=job.status,
        attempt_count=job.attempt_count,
        max_attempts=job.max_attempts,
        error_code=job.error_code,
        error_message=job.error_message,
        started_at=job.started_at,
        completed_at=job.completed_at,
        created_at=job.created_at,
        updated_at=job.updated_at,
    )