import hashlib
import uuid
from pathlib import Path

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.contract_version import ContractVersion
from app.models.document import Document
from app.models.processing_job import ProcessingJob
from app.repositories.contract_repository import ContractRepository
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.repositories.document_repository import DocumentRepository
from app.repositories.processing_job_repository import (
    ProcessingJobRepository,
)
from app.storage.base import StorageError
from app.storage.local import LocalStorage


MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
}

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


class ContractDocumentServiceError(Exception):
    """Base exception for contract document service errors."""


class ContractNotFoundForUploadError(ContractDocumentServiceError):
    """Raised when the contract does not exist for the organization."""


class InvalidDocumentError(ContractDocumentServiceError):
    """Raised when the uploaded document is invalid."""


class ContractDocumentService:
    """Business logic for uploading contract documents."""

    @staticmethod
    def upload_document(
        session: Session,
        *,
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        contract_id: uuid.UUID,
        original_filename: str,
        content_type: str | None,
        content: bytes,
        change_summary: str | None,
        storage: LocalStorage,
    ) -> tuple[Contract, ContractVersion, Document, ProcessingJob]:
        """
        Upload a contract document and create its database records.
        """

        if not original_filename.strip():
            raise InvalidDocumentError(
                "A document filename is required."
            )

        filename = Path(original_filename).name
        extension = Path(filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise InvalidDocumentError(
                "Unsupported file type. Only PDF and DOCX files are allowed."
            )

        if content_type not in ALLOWED_CONTENT_TYPES:
            raise InvalidDocumentError(
                "Unsupported content type. Only PDF and DOCX files are allowed."
            )

        if not content:
            raise InvalidDocumentError(
                "The uploaded document is empty."
            )

        file_size = len(content)

        if file_size > MAX_FILE_SIZE_BYTES:
            raise InvalidDocumentError(
                "The document exceeds the maximum allowed size of 25 MB."
            )

        checksum = hashlib.sha256(content).hexdigest()

        contract = ContractRepository.get_by_id_for_update(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            raise ContractNotFoundForUploadError(
                "Contract not found."
            )

        version_number = (
            ContractVersionRepository.get_next_version_number(
                session,
                contract_id=contract.id,
            )
        )

        contract_version = ContractVersionRepository.create(
            session,
            contract_id=contract.id,
            version_number=version_number,
            uploaded_by=user_id,
            change_summary=(
                change_summary.strip()
                if change_summary
                else None
            ),
        )

        storage_key = (
            f"organizations/"
            f"{organization_id}/"
            f"contracts/"
            f"{contract.id}/"
            f"versions/"
            f"{contract_version.id}/"
            f"document{extension}"
        )

        storage_saved = False

        try:
            storage.save(
                storage_key=storage_key,
                content=content,
            )
            storage_saved = True

            document = DocumentRepository.create(
                session,
                contract_version_id=contract_version.id,
                original_filename=filename,
                storage_provider="local",
                storage_key=storage_key,
                content_type=content_type,
                file_size_bytes=file_size,
                sha256_checksum=checksum,
                status="AVAILABLE",
            )

            processing_job = ProcessingJobRepository.create(
                session,
                contract_version_id=contract_version.id,
                requested_by=user_id,
                job_type="FULL_ANALYSIS",
                status="QUEUED",
            )

            contract.status = "UPLOADED"

            session.commit()

            session.refresh(contract)
            session.refresh(contract_version)
            session.refresh(document)
            session.refresh(processing_job)

            return (
                contract,
                contract_version,
                document,
                processing_job,
            )

        except StorageError:
            session.rollback()

            if storage_saved:
                try:
                    storage.delete(
                        storage_key=storage_key,
                    )
                except StorageError:
                    pass

            raise InvalidDocumentError(
                "Failed to store the uploaded document."
            )

        except IntegrityError as exc:
            session.rollback()

            if storage_saved:
                try:
                    storage.delete(
                        storage_key=storage_key,
                    )
                except StorageError:
                    pass

            raise InvalidDocumentError(
                "Unable to create the contract document records."
            ) from exc

        except SQLAlchemyError:
            session.rollback()

            if storage_saved:
                try:
                    storage.delete(
                        storage_key=storage_key,
                    )
                except StorageError:
                    pass

            raise