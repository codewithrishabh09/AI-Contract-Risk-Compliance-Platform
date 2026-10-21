from dataclasses import dataclass
from typing import Iterable

from sqlalchemy.orm import Session

from app.services.analysis.domains import AnalysisDomain
from app.services.retrieval import (
    RetrievedChunk,
    RetrievalService,
)

@dataclass(slots=True)
class DomainRetrievalResult:
    domain: AnalysisDomain
    chunks: list[RetrievedChunk]


class MultiPassRetriever:
    """Retrieves contract evidence separately for each risk domain."""

    @staticmethod
    def retrieve(
        session: Session,
        *,
        organization_id,
        contract_id,
        contract_version_id,
        domains: Iterable[AnalysisDomain],
        candidate_k: int = 10,
        top_k: int = 5,
    ) -> list[DomainRetrievalResult]:

        results: list[DomainRetrievalResult] = []

        for domain in domains:
            chunks = RetrievalService.hybrid_retrieve_with_reranking(
                session,
                organization_id=organization_id,
                contract_id=contract_id,
                contract_version_id=contract_version_id,
                query=domain.query,
                candidate_k=candidate_k,
                top_k=top_k,
            )
            results.append(
                DomainRetrievalResult(
                    domain=domain,
                    chunks=chunks,
                )
            )

        return results
