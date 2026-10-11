import uuid

from sqlalchemy.orm import Session

from app.models.document import Document


class DocumentRepository:
    """Database operations for documents."""

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