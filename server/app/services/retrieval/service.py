import uuid
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.repositories.contract_repository import ContractRepository
from app.repositories.document_chunk_repository import (
    DocumentChunkRepository,
)
from app.services.embedding import generate_embeddings


DEFAULT_TOP_K = 5


class RetrievalServiceError(Exception):
    """Base exception for retrieval failures."""


class RetrievalContractNotFoundError(RetrievalServiceError):
    """Raised when the contract does not belong to the organization."""


@dataclass(slots=True)
class RetrievedChunk:
    chunk_id: uuid.UUID
    chunk_index: int
    content: str
    page_start: int
    page_end: int
    similarity_score: float


class RetrievalService:
    @staticmethod
    def retrieve(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
        query: str,
        top_k: int = DEFAULT_TOP_K,
    ) -> list[RetrievedChunk]:
        if not query or not query.strip():
            raise ValueError("Query must not be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        contract = ContractRepository.get_by_id(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            raise RetrievalContractNotFoundError(
                "Contract not found."
            )

        query_text = query.strip()

        query_embedding = generate_embeddings(
            [query_text]
        )[0]

        rows = DocumentChunkRepository.similarity_search(
            session,
            contract_version_id=contract_version_id,
            query_embedding=query_embedding,
            limit=top_k,
        )

        return [
            RetrievedChunk(
                chunk_id=document_chunk.id,
                chunk_index=document_chunk.chunk_index,
                content=document_chunk.content,
                page_start=document_chunk.page_start,
                page_end=document_chunk.page_end,
                similarity_score=max(0.0, 1.0 - distance),
            )
            for document_chunk, distance in rows
        ]