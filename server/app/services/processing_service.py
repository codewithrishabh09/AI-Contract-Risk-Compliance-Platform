import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.repositories.document_chunk_repository import (
    DocumentChunkRepository,
)
from app.repositories.document_repository import DocumentRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)
from app.services.chunking import chunk_pages
from app.services.extraction import ExtractedDocument
from app.storage.base import StorageError
from app.storage.local import LocalStorage


class ProcessingServiceError(Exception):
    """Base exception for processing service failures."""


class ProcessingJobNotFoundError(ProcessingServiceError):
    """Raised when a processing job does not exist."""


class ProcessingDocumentNotFoundError(ProcessingServiceError):
    """Raised when a processing document does not exist."""


class ProcessingService:
    """Business logic for contract processing jobs."""

    @staticmethod
    def start_job(
        session: Session,
        *,
        job_id: uuid.UUID,
    ):
        """Move a queued job into RUNNING state."""

        job = ProcessingJobRepository.get_by_id(
            session,
            job_id=job_id,
        )

        if job is None:
            raise ProcessingJobNotFoundError(
                "Processing job not found."
            )

        if job.status not in {"QUEUED", "FAILED"}:
            return job

        job.status = "RUNNING"
        job.attempt_count += 1
        job.started_at = datetime.now(timezone.utc)
        job.error_code = None
        job.error_message = None
        job.completed_at = None

        session.commit()
        session.refresh(job)

        return job

    @staticmethod
    def validate_document_available(
        session: Session,
        *,
        job_id: uuid.UUID,
        storage: LocalStorage,
    ):
        """
        Verify that the processing job has a valid
        document available in storage.
        """

        job = ProcessingJobRepository.get_by_id(
            session,
            job_id=job_id,
        )

        if job is None:
            raise ProcessingJobNotFoundError(
                "Processing job not found."
            )

        document = DocumentRepository.get_by_contract_version_id(
            session,
            contract_version_id=job.contract_version_id,
        )

        if document is None:
            raise ProcessingDocumentNotFoundError(
                "Document for processing job was not found."
            )

        if document.status != "AVAILABLE":
            raise ProcessingServiceError(
                "Document is not available for processing."
            )

        if document.storage_provider != "local":
            raise ProcessingServiceError(
                "Unsupported storage provider."
            )

        try:
            content = storage.read(
                storage_key=document.storage_key,
            )
        except StorageError as exc:
            raise ProcessingServiceError(
                "Unable to read document from storage."
            ) from exc

        if not content:
            raise ProcessingServiceError(
                "Stored document is empty."
            )

        return job, document, content

    @staticmethod
    def persist_extracted_chunks(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
        extracted_document: ExtractedDocument,
    ):
        """
        Convert extracted pages into persistent document chunks.

        Existing chunks for the same version are removed first,
        making this operation safe for reprocessing.
        """

        pages = [
            (
                page.page_number,
                page.text,
            )
            for page in extracted_document.pages
            if page.text.strip()
        ]

        chunks = chunk_pages(pages)

        if not chunks:
            raise ProcessingServiceError(
                "No usable text chunks were generated."
            )

        DocumentChunkRepository.delete_by_contract_version_id(
            session,
            contract_version_id=contract_version_id,
        )

        chunk_records = [
            {
                "chunk_index": chunk.chunk_index,
                "content": chunk.content,
                "page_start": chunk.page_start,
                "page_end": chunk.page_end,
                "token_count": chunk.token_count,
            }
            for chunk in chunks
        ]

        return DocumentChunkRepository.create_many(
            session,
            contract_version_id=contract_version_id,
            chunks=chunk_records,
        )

    @staticmethod
    def mark_succeeded(
        session: Session,
        *,
        job_id: uuid.UUID,
    ):
        """Mark a processing job as successfully completed."""

        job = ProcessingJobRepository.get_by_id(
            session,
            job_id=job_id,
        )

        if job is None:
            raise ProcessingJobNotFoundError(
                "Processing job not found."
            )

        job.status = "SUCCEEDED"
        job.completed_at = datetime.now(timezone.utc)

        session.commit()
        session.refresh(job)

        return job

    @staticmethod
    def mark_failed(
        session: Session,
        *,
        job_id: uuid.UUID,
        error_code: str,
        error_message: str,
    ):
        """Mark a processing job as failed."""

        job = ProcessingJobRepository.get_by_id(
            session,
            job_id=job_id,
        )

        if job is None:
            raise ProcessingJobNotFoundError(
                "Processing job not found."
            )

        job.status = "FAILED"
        job.error_code = error_code
        job.error_message = error_message
        job.completed_at = datetime.now(timezone.utc)

        session.commit()
        session.refresh(job)

        return job