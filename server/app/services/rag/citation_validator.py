import re

from app.schemas.rag import Citation
from app.services.retrieval.context_builder import ContextBlock


class CitationValidationError(Exception):
    """Raised when an LLM response contains an invalid citation."""


CITATION_PATTERN = re.compile(r"\[(chunk-\d+)\]")

# Phrases that mark a legitimate "I can't answer from the evidence" reply.
# Such an answer has no citations, and that is correct.
REFUSAL_PHRASES = (
    "insufficient",
    "not enough evidence",
    "could not find",
    "does not contain",
    "do not contain",
    "no information",
    "not specified",
    "not provided",
)


def extract_citation_ids(answer: str) -> list[str]:
    """
    Extract citation IDs such as [chunk-1], [chunk-2]
    from the generated answer.
    """
    return CITATION_PATTERN.findall(answer)


def is_refusal(answer: str) -> bool:
    """Return True if the answer says the evidence is insufficient."""
    lowered = answer.lower()
    return any(phrase in lowered for phrase in REFUSAL_PHRASES)


def validate_citations(
    *,
    answer: str,
    context_blocks: list[ContextBlock],
) -> list[Citation]:
    """
    Validate every citation used by the LLM against the
    chunks that were actually provided to the LLM.

    Rules:
    1. Every cited ID must exist in the supplied evidence.
    2. An answer with no citations is rejected, unless it is a
       refusal stating the evidence is insufficient.
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

    if not unique_citation_ids and not is_refusal(answer):
        raise CitationValidationError(
            "LLM answer contains no citations."
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