from functools import lru_cache

from sentence_transformers import SentenceTransformer


EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
EMBEDDING_DIMENSION = 384
DEFAULT_BATCH_SIZE = 32


class EmbeddingServiceError(Exception):
    """Base exception for embedding-related failures."""


class EmbeddingDimensionError(EmbeddingServiceError):
    """Raised when the generated embedding has an unexpected dimension."""


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """
    Load the embedding model once per worker process.

    The first call downloads the model if it is not already
    available in the local Hugging Face cache.
    """
    return SentenceTransformer(EMBEDDING_MODEL_NAME)


def generate_embeddings(
    texts: list[str],
    *,
    batch_size: int = DEFAULT_BATCH_SIZE,
) -> list[list[float]]:
    """
    Generate normalized embeddings for a list of text chunks.

    Returns:
        A list of 384-dimensional embedding vectors.
    """
    if not texts:
        return []

    if batch_size <= 0:
        raise ValueError("batch_size must be greater than zero.")

    cleaned_texts = [text.strip() for text in texts]

    if any(not text for text in cleaned_texts):
        raise EmbeddingServiceError(
            "Embedding input contains an empty text chunk."
        )

    model = get_embedding_model()

    embeddings = model.encode(
        cleaned_texts,
        batch_size=batch_size,
        normalize_embeddings=True,
        convert_to_numpy=True,
        show_progress_bar=False,
    )

    result = [embedding.tolist() for embedding in embeddings]

    for embedding in result:
        if len(embedding) != EMBEDDING_DIMENSION:
            raise EmbeddingDimensionError(
                f"Expected {EMBEDDING_DIMENSION} dimensions, "
                f"got {len(embedding)}."
            )

    return result