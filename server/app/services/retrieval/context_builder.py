from dataclasses import dataclass

from app.services.retrieval.service import RetrievedChunk


@dataclass(slots=True)
class ContextBlock:
    citation_id: str
    chunk_index: int
    page_start: int
    page_end: int
    content: str


def build_context(
    chunks: list[RetrievedChunk],
) -> list[ContextBlock]:
    """
    Convert retrieved chunks into structured context blocks.

    Citation IDs are deterministic within a single retrieval response.
    """
    context_blocks: list[ContextBlock] = []

    for position, chunk in enumerate(chunks, start=1):
        context_blocks.append(
            ContextBlock(
                citation_id=f"chunk-{position}",
                chunk_index=chunk.chunk_index,
                page_start=chunk.page_start,
                page_end=chunk.page_end,
                content=chunk.content.strip(),
            )
        )

    return context_blocks


def render_context(
    context_blocks: list[ContextBlock],
) -> str:
    """
    Render context blocks into a format suitable for an LLM prompt.
    """
    if not context_blocks:
        return ""

    sections: list[str] = []

    for block in context_blocks:
        if block.page_start == block.page_end:
            page_reference = f"Page {block.page_start}"
        else:
            page_reference = (
                f"Pages {block.page_start}-{block.page_end}"
            )

        sections.append(
            "\n".join(
                [
                    f"[{block.citation_id}]",
                    f"Chunk: {block.chunk_index}",
                    page_reference,
                    block.content,
                ]
            )
        )

    return "\n\n---\n\n".join(sections)