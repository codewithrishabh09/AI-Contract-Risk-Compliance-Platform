import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal  # noqa: E402
from app.services.retrieval import RetrievalService  # noqa: E402

ORGANIZATION_ID = "b25382fb-fd7a-4500-8fb6-f2b431da83f1"
CONTRACT_ID = "69c6bb8d-253d-4ea3-8c1f-3304e16072c6"
CONTRACT_VERSION_ID = "ae47164a-3500-4843-94ae-cc529a598d31"

QUERIES = [
    "What are the payment obligations?",
    "How can this agreement be terminated?",
]


def main() -> None:
    session = SessionLocal()

    try:
        for query in QUERIES:
            print(f"\nQUERY: {query}")

            results = RetrievalService.retrieve(
                session,
                organization_id=uuid.UUID(ORGANIZATION_ID),
                contract_id=uuid.UUID(CONTRACT_ID),
                contract_version_id=uuid.UUID(CONTRACT_VERSION_ID),
                query=query,
                top_k=5,
            )

            for result in results:
                print(
                    result.chunk_index,
                    round(result.similarity_score, 3),
                    result.page_start,
                    result.content[:120].replace("\n", " "),
                )
    finally:
        session.close()


if __name__ == "__main__":
    main()