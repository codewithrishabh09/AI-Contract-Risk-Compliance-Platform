import uuid

from app.db.session import SessionLocal
from app.services.processing_service import (
    ProcessingService,
    ProcessingServiceError,
)
from app.storage.local import LocalStorage
from app.worker.celery_app import celery_app


@celery_app.task(
    bind=True,
    name="app.worker.tasks.process_contract_job",
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3},
)
def process_contract_job(
    self,
    job_id: str,
) -> dict[str, str]:
    """
    Process a contract document in the background.

    Current responsibility:
    - mark job as RUNNING
    - verify document availability
    - read document from storage

    Text extraction will be added in the next processing step.
    """

    parsed_job_id = uuid.UUID(job_id)

    session = SessionLocal()
    storage = LocalStorage("storage")

    try:
        ProcessingService.start_job(
            session,
            job_id=parsed_job_id,
        )

        _, document, content = (
            ProcessingService.validate_document_available(
                session,
                job_id=parsed_job_id,
                storage=storage,
            )
        )

        return {
            "status": "document_loaded",
            "job_id": job_id,
            "document_id": str(document.id),
            "bytes_loaded": str(len(content)),
        }

    except ProcessingServiceError as exc:
        try:
            ProcessingService.mark_failed(
                session,
                job_id=parsed_job_id,
                error_code="PROCESSING_ERROR",
                error_message=str(exc),
            )
        except Exception:
            session.rollback()

        raise

    except Exception as exc:
        try:
            ProcessingService.mark_failed(
                session,
                job_id=parsed_job_id,
                error_code="UNEXPECTED_ERROR",
                error_message="Unexpected processing failure.",
            )
        except Exception:
            session.rollback()

        raise exc

    finally:
        session.close()


@celery_app.task(
    name="app.worker.tasks.health_check_task",
)
def health_check_task() -> dict[str, str]:
    """Simple task used to verify Celery worker connectivity."""

    return {
        "status": "success",
        "message": "Celery worker is processing tasks.",
    }