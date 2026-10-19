import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.rag.citation_validator import (  # noqa: E402
    CitationValidationError,
    validate_citations,
)
from app.services.retrieval.context_builder import ContextBlock  # noqa: E402

CONTEXT = [
    ContextBlock(
        citation_id="chunk-1",
        chunk_index=5,
        page_start=2,
        page_end=2,
        content="Payment must be made within 30 days.",
    )
]


def expect_error(name: str, answer: str) -> None:
    try:
        validate_citations(answer=answer, context_blocks=CONTEXT)
    except CitationValidationError as exc:
        print(f"PASS  {name}: rejected ({exc})")
    else:
        print(f"FAIL  {name}: was accepted but should be rejected")


def main() -> None:
    # 1. Valid citation
    citations = validate_citations(
        answer="Payment is due within 30 days. [chunk-1]",
        context_blocks=CONTEXT,
    )
    print("PASS  valid citation:", citations)

    # 2. Hallucinated citation ID
    expect_error(
        "invented citation [chunk-99]",
        "Payment is due within 45 days. [chunk-99]",
    )

    # 3. Valid and invented citation mixed
    expect_error(
        "mixed valid and invented",
        "Payment is due in 30 days. [chunk-1] Late fee applies. [chunk-7]",
    )

    # 4. No citation at all
    expect_error(
        "no citation",
        "Payment is due within 30 days.",
    )

    # 5. Refusal without citation is allowed
    refusal = validate_citations(
        answer="The available contract evidence is insufficient to answer this.",
        context_blocks=CONTEXT,
    )
    print("PASS  refusal without citation allowed:", refusal == [])

if __name__ == "__main__":
    main()