import re

from app.schemas.rag import Citation
from app.services.retrieval.context_builder import ContextBlock


class CitationValidationError(Exception):
    """Raised when an LLM response contains an invalid citation."""


CITATION_PATTERN = re.compile(r"\[(chunk-\d+)\]")


def extract_citation_ids(answer: str) -> list[str]:
    """
    Extract citation IDs such as [chunk-1], [chunk-2]
    from the generated answer.
    """
    return CITATION_PATTERN.findall(answer)


def validate_citations(
    *,
    answer: str,
    context_blocks: list[ContextBlock],
) -> list[Citation]:
    """
    Validate every citation used by the LLM against the
    chunks that were actually provided to the LLM.
    """

    citation_ids = extract_citation_ids(answer)

    context_by_id = {
        block.citation_id: block
        for block in context_blocks
    }

    unique_citation_ids = list(dict.fromkeys(citation_ids))

    invalid_ids = [
        citation_id
        for citation_id in unique_citation_ids
        if citation_id not in context_by_id
    ]

    if invalid_ids:
        raise CitationValidationError(
            "LLM returned invalid citation IDs: "
            + ", ".join(invalid_ids)
        )

    citations: list[Citation] = []

    for citation_id in unique_citation_ids:
        block = context_by_id[citation_id]

        citations.append(
            Citation(
                citation_id=block.citation_id,
                chunk_index=block.chunk_index,
                page_start=block.page_start,
                page_end=block.page_end,
            )
        )

    return citations