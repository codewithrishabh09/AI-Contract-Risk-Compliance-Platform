from dataclasses import dataclass
from functools import lru_cache

from sentence_transformers import CrossEncoder


RERANKER_MODEL_NAME = "cross-encoder/ms-marco-MiniLM-L-6-v2"
DEFAULT_RERANK_TOP_K = 5
DEFAULT_RERANK_BATCH_SIZE = 16


class RerankingServiceError(Exception):
    """Base exception for reranking failures."""


@dataclass(slots=True)
class RerankedItem:
    item: object
    score: float


@lru_cache(maxsize=1)
def get_reranker_model() -> CrossEncoder:
    """
    Load the reranker once per worker process.

    The first call downloads the model if it is not already
    available in the local Hugging Face cache.
    """
    return CrossEncoder(RERANKER_MODEL_NAME)


def rerank(
    query: str,
    items: list[object],
    *,
    text_getter,
    top_k: int = DEFAULT_RERANK_TOP_K,
    batch_size: int = DEFAULT_RERANK_BATCH_SIZE,
) -> list[RerankedItem]:
    """
    Rerank candidate items using a CrossEncoder model.

    Args:
        query: User's natural-language question.
        items: Candidate retrieval results.
        text_getter: Function that extracts searchable text from an item.
        top_k: Number of final items to return.
        batch_size: CrossEncoder inference batch size.
    """
    if not query or not query.strip():
        raise ValueError("Query must not be empty.")

    if top_k <= 0:
        raise ValueError("top_k must be greater than zero.")

    if batch_size <= 0:
        raise ValueError("batch_size must be greater than zero.")

    if not items:
        return []

    pairs = [
        [query.strip(), text_getter(item)]
        for item in items
    ]

    model = get_reranker_model()

    scores = model.predict(
        pairs,
        batch_size=batch_size,
        show_progress_bar=False,
    )

    ranked_items = [
        RerankedItem(
            item=item,
            score=float(score),
        )
        for item, score in zip(items, scores, strict=True)
    ]

    ranked_items.sort(
        key=lambda result: result.score,
        reverse=True,
    )

    return ranked_items[:top_k]