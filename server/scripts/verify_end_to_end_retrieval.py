import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal  # noqa: E402
from app.services.retrieval import (  # noqa: E402
    RetrievalService,
    build_context,
    render_context,
)

ORGANIZATION_ID = "b25382fb-fd7a-4500-8fb6-f2b431da83f1"
CONTRACT_ID = "69c6bb8d-253d-4ea3-8c1f-3304e16072c6"
CONTRACT_VERSION_ID = "ae47164a-3500-4843-94ae-cc529a598d31"

QUERIES = [
    "What is the termination notice period?",
    "What is the liability cap?",
    "What are the payment obligations?",
]


def main() -> None:
    session = SessionLocal()

    try:
        for query in QUERIES:
            print("\n" + "#" * 80)
            print("QUERY:", query)
            print("#" * 80)

            results = RetrievalService.hybrid_retrieve_with_reranking(
                session,
                organization_id=uuid.UUID(ORGANIZATION_ID),
                contract_id=uuid.UUID(CONTRACT_ID),
                contract_version_id=uuid.UUID(CONTRACT_VERSION_ID),
                query=query,
                candidate_k=15,
                top_k=5,
            )

            context_blocks = build_context(results)
            print(render_context(context_blocks))
    finally:
        session.close()


if __name__ == "__main__":
    main()