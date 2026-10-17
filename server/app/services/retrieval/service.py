import uuid
from dataclasses import dataclass
from collections import defaultdict

from sqlalchemy.orm import Session

from app.repositories.contract_repository import ContractRepository
from app.repositories.document_chunk_repository import (
    DocumentChunkRepository,
)
from app.services.embedding import generate_embeddings
from app.services.reranking import rerank


DEFAULT_TOP_K = 5


class RetrievalServiceError(Exception):
    @staticmethod
    def hybrid_retrieve(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
        query: str,
        top_k: int = DEFAULT_TOP_K,
        vector_k: int = 10,
        keyword_k: int = 10,
    ) -> list[RetrievedChunk]:
        if not query or not query.strip():
            raise ValueError("Query must not be empty.")

        if top_k <= 0:
            raise ValueError("top_k must be greater than zero.")

        if vector_k <= 0:
            raise ValueError("vector_k must be greater than zero.")

        if keyword_k <= 0:
            raise ValueError("keyword_k must be greater than zero.")

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

        vector_rows = DocumentChunkRepository.similarity_search(
            session,
            contract_version_id=contract_version_id,
            query_embedding=query_embedding,
            limit=vector_k,
        )

        keyword_rows = DocumentChunkRepository.keyword_search(
            session,
            contract_version_id=contract_version_id,
            query=query_text,
            limit=keyword_k,
        )

        candidates = defaultdict(
            lambda: {
                "document_chunk": None,
                "vector_score": 0.0,
                "keyword_score": 0.0,
            }
        )

        for rank_position, (chunk, distance) in enumerate(
            vector_rows,
            start=1,
        ):
            candidates[chunk.id]["document_chunk"] = chunk
            candidates[chunk.id]["vector_score"] = (
                1.0 / rank_position
            )

        for rank_position, (chunk, keyword_score) in enumerate(
            keyword_rows,
            start=1,
        ):
            candidates[chunk.id]["document_chunk"] = chunk
            candidates[chunk.id]["keyword_score"] = (
                1.0 / rank_position
            )

        ranked_candidates = []

        for candidate in candidates.values():
            document_chunk = candidate["document_chunk"]

            hybrid_score = (
                0.7 * candidate["vector_score"]
                + 0.3 * candidate["keyword_score"]
            )

            ranked_candidates.append(
                (
                    document_chunk,
                    hybrid_score,
                )
            )

        ranked_candidates.sort(
            key=lambda item: item[1],
            reverse=True,
        )

        return [
            RetrievedChunk(
                chunk_id=document_chunk.id,
                chunk_index=document_chunk.chunk_index,
                content=document_chunk.content,
                page_start=document_chunk.page_start,
                page_end=document_chunk.page_end,
                similarity_score=score,
            )
            for document_chunk, score in ranked_candidates[:top_k]
        ]


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
    
        @staticmethod
    def hybrid_retrieve_with_reranking(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
        query: str,
        candidate_k: int = 15,
        top_k: int = 5,
    ) -> list[RetrievedChunk]:
        if not query or not query.strip():
            raise ValueError("Query must not be empty.")

        if candidate_k <= 0:
            raise ValueError("candidate_k must be greater than zero.")

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

        candidates = RetrievalService.hybrid_retrieve(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
            contract_version_id=contract_version_id,
            query=query,
            top_k=candidate_k,
            vector_k=candidate_k,
            keyword_k=candidate_k,
        )

        reranked_results = rerank(
            query,
            candidates,
            text_getter=lambda item: item.content,
            top_k=top_k,
        )

        return [
            RetrievedChunk(
                chunk_id=result.item.chunk_id,
                chunk_index=result.item.chunk_index,
                content=result.item.content,
                page_start=result.item.page_start,
                page_end=result.item.page_end,
                similarity_score=result.score,
            )
            for result in reranked_results
        ]