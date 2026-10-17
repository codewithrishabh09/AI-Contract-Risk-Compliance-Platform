import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal  # noqa: E402
from app.services.rag_service import RAGService  # noqa: E402

ORGANIZATION_ID = "b25382fb-fd7a-4500-8fb6-f2b431da83f1"
CONTRACT_ID = "69c6bb8d-253d-4ea3-8c1f-3304e16072c6"
CONTRACT_VERSION_ID = "ae47164a-3500-4843-94ae-cc529a598d31"


def main() -> None:
    session = SessionLocal()

    try:
        result = RAGService.answer_question(
            session,
            organization_id=uuid.UUID(ORGANIZATION_ID),
            contract_id=uuid.UUID(CONTRACT_ID),
            contract_version_id=uuid.UUID(CONTRACT_VERSION_ID),
            question="What is the liability cap?",
        )

        print("ANSWER:")
        print(result.answer)

        print("\nCITATIONS:")
        for citation in result.citations:
            print(
                citation.citation_id,
                citation.chunk_index,
                citation.page_start,
                citation.page_end,
            )

        print("\nMODEL:")
        print(result.model_provider)
        print(result.model_name)
    finally:
        session.close()


if __name__ == "__main__":
    main()