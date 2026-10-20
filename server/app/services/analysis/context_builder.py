from app.services.retrieval import (
    ContextBlock,
    RetrievedChunk,
    build_context,
)


def build_analysis_context(
    chunks: list[RetrievedChunk],
) -> list[ContextBlock]:
    """
    Build deterministic citation-aware context for contract analysis.
    """

    return build_context(chunks)