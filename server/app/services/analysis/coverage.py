from dataclasses import dataclass

from app.services.analysis.retrieval import DomainRetrievalResult


@dataclass(frozen=True, slots=True)
class DomainCoverage:
    domain_key: str
    label: str
    chunk_count: int
    has_evidence: bool


def calculate_domain_coverage(
    results: list[DomainRetrievalResult],
) -> list[DomainCoverage]:

    return [
        DomainCoverage(
            domain_key=result.domain.key,
            label=result.domain.label,
            chunk_count=len(result.chunks),
            has_evidence=bool(result.chunks),
        )
        for result in results
    ]