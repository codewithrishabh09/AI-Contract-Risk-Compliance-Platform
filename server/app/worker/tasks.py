import uuid

from app.db.session import SessionLocal
from app.services.extraction import (
    DocumentExtractionError,
    UnsupportedDocumentTypeError,
    extract_document,
)
from app.services.processing_service import (
    ProcessingJobNotFoundError,
    ProcessingService,
    ProcessingServiceError,
)
from app.storage.local import LocalStorage
from app.worker.celery_app import celery_app


@celery_app.task(
    bind=True,
    name="app.worker.tasks.process_contract_job",
    autoretry_for=(Exception,),
    dont_autoretry_for=(
        DocumentExtractionError,
        UnsupportedDocumentTypeError,
        ProcessingJobNotFoundError,
    ),
    retry_backoff=True,
    retry_kwargs={"max_retries": 2},
)
def process_contract_job(
    self,
    job_id: str,
) -> dict[str, str]:
    """
    Process a contract document.

    Current pipeline:
    1. Move job to RUNNING.
    2. Load document.
    3. Extract text.
    4. Generate chunks.
    5. Persist chunks.
    6. Generate and persist embeddings.
    7. Mark job as SUCCEEDED.
    """

    parsed_job_id = uuid.UUID(job_id)

    session = SessionLocal()
    storage = LocalStorage("storage")

    try:
        job = ProcessingService.start_job(
            session,
            job_id=parsed_job_id,
        )

        if job.status == "SUCCEEDED":
            return {
                "status": "already_completed",
                "job_id": job_id,
            }

        _, document, content = (
            ProcessingService.validate_document_available(
                session,
                job_id=parsed_job_id,
                storage=storage,
            )
        )

        extracted_document = extract_document(
            content=content,
            filename=document.original_filename,
            content_type=document.content_type,
        )

        if extracted_document.character_count == 0:
            raise DocumentExtractionError(
                "No text could be extracted from the document."
            )

        chunks = ProcessingService.persist_extracted_chunks(
            session,
            contract_version_id=job.contract_version_id,
            extracted_document=extracted_document,
        )

        embedded_chunks = (
            ProcessingService.generate_and_persist_embeddings(
                session,
                contract_version_id=job.contract_version_id,
            )
        )

        session.commit()

        completed_job = ProcessingService.mark_succeeded(
            session,
            job_id=parsed_job_id,
        )

        return {
            "status": completed_job.status,
            "job_id": job_id,
            "document_id": str(document.id),
            "pages": str(len(extracted_document.pages)),
            "characters": str(extracted_document.character_count),
            "chunks": str(len(chunks)),
            "embedded_chunks": str(len(embedded_chunks)),
        }

    except (
        ProcessingServiceError,
        DocumentExtractionError,
        UnsupportedDocumentTypeError,
    ) as exc:
        session.rollback()

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

    except Exception:
        session.rollback()

        try:
            ProcessingService.mark_failed(
                session,
                job_id=parsed_job_id,
                error_code="UNEXPECTED_ERROR",
                error_message="Unexpected processing failure.",
            )
        except Exception:
            session.rollback()

        raise

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
    