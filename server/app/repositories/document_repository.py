import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    """Database operations for documents."""

    @staticmethod
    def get_by_id(
        session: Session,
        *,
        document_id: uuid.UUID,
    ) -> Document | None:
        """Get a document by ID."""

        statement = select(Document).where(
            Document.id == document_id,
        )

        return session.scalar(statement)

    @staticmethod
    def get_by_contract_version_id(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> Document | None:
        """Get the document associated with a contract version."""

        statement = (
            select(Document)
            .where(
                Document.contract_version_id == contract_version_id,
            )
            .order_by(Document.created_at.desc())
        )

        return session.scalar(statement)

    @staticmethod
    def create(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
        original_filename: str,
        storage_provider: str,
        storage_key: str,
        content_type: str,
        file_size_bytes: int,
        sha256_checksum: str,
        status: str = "AVAILABLE",
    ) -> Document:
        """Create a document metadata record."""

        document = Document(
            contract_version_id=contract_version_id,
            original_filename=original_filename,
            storage_provider=storage_provider,
            storage_key=storage_key,
            content_type=content_type,
            file_size_bytes=file_size_bytes,
            sha256_checksum=sha256_checksum,
            status=status,
        )

        session.add(document)
        session.flush()

        return document