import uuid

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class DocumentChunkRepository:
    """Database operations for document chunks."""

    @staticmethod
    def delete_by_contract_version_id(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> None:
        """Delete all chunks belonging to a contract version."""

        statement = delete(DocumentChunk).where(
            DocumentChunk.contract_version_id
            == contract_version_id,
        )

        session.execute(statement)

    @staticmethod
    def create_many(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
        chunks: list[dict],
    ) -> list[DocumentChunk]:
        """Create multiple document chunks."""

        document_chunks = [
            DocumentChunk(
                contract_version_id=contract_version_id,
                chunk_index=chunk["chunk_index"],
                content=chunk["content"],
                page_start=chunk["page_start"],
                page_end=chunk["page_end"],
                token_count=chunk["token_count"],
                embedding=None,
                embedding_model=None,
            )
            for chunk in chunks
        ]

        session.add_all(document_chunks)
        session.flush()

        return document_chunks

    @staticmethod
    def list_by_contract_version_id(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> list[DocumentChunk]:
        """Return chunks ordered by chunk index."""

        statement = (
            select(DocumentChunk)
            .where(
                DocumentChunk.contract_version_id
                == contract_version_id,
            )
            .order_by(
                DocumentChunk.chunk_index.asc(),
            )
        )

        return list(
            session.scalars(statement).all()
        )