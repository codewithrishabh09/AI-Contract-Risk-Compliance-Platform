import uuid

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class DocumentChunkRepository:
    @staticmethod
    def delete_by_contract_version_id(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
    ) -> None:
        statement = delete(DocumentChunk).where(
            DocumentChunk.contract_version_id == contract_version_id
        )

        session.execute(statement)

    @staticmethod
    def create_many(
        session: Session,
        *,
        contract_version_id: uuid.UUID,
        chunks: list[dict],
    ) -> list[DocumentChunk]:
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
        statement = (
            select(DocumentChunk)
            .where(
                DocumentChunk.contract_version_id == contract_version_id
            )
            .order_by(DocumentChunk.chunk_index.asc())
        )

        return list(session.scalars(statement).all())

    @staticmethod
    def set_embeddings(
        session: Session,
        *,
        document_chunks: list[DocumentChunk],
        embeddings: list[list[float]],
        embedding_model: str,
    ) -> list[DocumentChunk]:
        if len(document_chunks) != len(embeddings):
            raise ValueError(
                "Number of chunks and embeddings must be the same."
            )

        for document_chunk, embedding in zip(
            document_chunks,
            embeddings,
            strict=True,
        ):
            document_chunk.embedding = embedding
            document_chunk.embedding_model = embedding_model

        session.flush()

        return document_chunks