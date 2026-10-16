from dataclasses import dataclass


DEFAULT_CHUNK_SIZE = 1500
DEFAULT_CHUNK_OVERLAP = 200


@dataclass(slots=True)
class TextChunk:
    """A chunk of document text with page information."""

    chunk_index: int
    content: str
    page_start: int
    page_end: int
    token_count: int


def estimate_token_count(text: str) -> int:
    """
    Estimate token count without requiring a model-specific tokenizer.

    This is intentionally approximate. A real tokenizer will be used
    later when generating embeddings.
    """

    if not text.strip():
        return 0

    words = text.split()

    return max(
        1,
        int(len(words) * 1.3),
    )


def split_text(
    text: str,
    *,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    """
    Split text into overlapping chunks.

    The splitter prefers paragraph boundaries before falling back
    to hard character boundaries.
    """

    if not text.strip():
        return []

    if chunk_size <= 0:
        raise ValueError(
            "chunk_size must be greater than zero."
        )

    if chunk_overlap < 0:
        raise ValueError(
            "chunk_overlap cannot be negative."
        )

    if chunk_overlap >= chunk_size:
        raise ValueError(
            "chunk_overlap must be smaller than chunk_size."
        )

    paragraphs = [
        paragraph.strip()
        for paragraph in text.split("\n")
        if paragraph.strip()
    ]

    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:
        if len(paragraph) > chunk_size:
            if current:
                chunks.append(current)
                current = ""

            start = 0

            while start < len(paragraph):
                end = min(
                    start + chunk_size,
                    len(paragraph),
                )

                piece = paragraph[start:end].strip()

                if piece:
                    chunks.append(piece)

                if end >= len(paragraph):
                    break

                start = max(
                    end - chunk_overlap,
                    start + 1,
                )

            continue

        candidate = (
            f"{current}\n{paragraph}"
            if current
            else paragraph
        )

        if len(candidate) <= chunk_size:
            current = candidate
            continue

        if current:
            chunks.append(current)

        overlap_text = ""

        if chunk_overlap > 0 and current:
            overlap_text = current[
                max(
                    0,
                    len(current) - chunk_overlap,
                ):
            ].strip()

        current = (
            f"{overlap_text}\n{paragraph}"
            if overlap_text
            else paragraph
        )

        if len(current) > chunk_size:
            current = current[:chunk_size].strip()

    if current:
        chunks.append(current)

    return [
        chunk.strip()
        for chunk in chunks
        if chunk.strip()
    ]


def chunk_pages(
    pages: list[tuple[int, str]],
    *,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[TextChunk]:
    """
    Convert extracted pages into database-ready text chunks.

    Each chunk keeps its starting and ending page.
    """

    chunks: list[TextChunk] = []

    for page_number, page_text in pages:
        normalized_text = page_text.strip()

        if not normalized_text:
            continue

        page_chunks = split_text(
            normalized_text,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        for content in page_chunks:
            chunks.append(
                TextChunk(
                    chunk_index=len(chunks),
                    content=content,
                    page_start=page_number,
                    page_end=page_number,
                    token_count=estimate_token_count(
                        content
                    ),
                )
            )

    return chunks