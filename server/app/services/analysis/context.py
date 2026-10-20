from app.services.analysis.retrieval import DomainRetrievalResult
from app.services.retrieval import RetrievedChunk


def deduplicate_chunks(
    domain_results: list[DomainRetrievalResult],
) -> list[RetrievedChunk]:
    """
    Deduplicate retrieved chunks while preserving the strongest
    reranking score for each chunk.
    """

    chunks_by_id: dict[str, RetrievedChunk] = {}

    for result in domain_results:
        for chunk in result.chunks:
            existing = chunks_by_id.get(str(chunk.chunk_id))

            if existing is None:
                chunks_by_id[str(chunk.chunk_id)] = chunk
                continue

            if chunk.similarity_score > existing.similarity_score:
                chunks_by_id[str(chunk.chunk_id)] = chunk

    return sorted(
        chunks_by_id.values(),
        key=lambda chunk: chunk.similarity_score,
        reverse=True,
    )