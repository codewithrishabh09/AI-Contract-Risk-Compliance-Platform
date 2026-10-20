import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.db.session import SessionLocal  # noqa: E402
from app.services.analysis.domains import ANALYSIS_DOMAINS  # noqa: E402
from app.services.analysis.retrieval import MultiPassRetriever  # noqa: E402

ORGANIZATION_ID = "b25382fb-fd7a-4500-8fb6-f2b431da83f1"
CONTRACT_ID = "69c6bb8d-253d-4ea3-8c1f-3304e16072c6"
CONTRACT_VERSION_ID = "ae47164a-3500-4843-94ae-cc529a598d31"


def main() -> None:
    session = SessionLocal()

    try:
        results = MultiPassRetriever.retrieve(
            session,
            organization_id=uuid.UUID(ORGANIZATION_ID),
            contract_id=uuid.UUID(CONTRACT_ID),
            contract_version_id=uuid.UUID(CONTRACT_VERSION_ID),
            domains=ANALYSIS_DOMAINS,
            candidate_k=10,
            top_k=5,
        )

        for result in results:
            print(result.domain.key, "->", len(result.chunks), "chunks")

            for chunk in result.chunks[:2]:
                print(
                    "    chunk",
                    chunk.chunk_index,
                    "p",
                    chunk.page_start,
                    "|",
                    chunk.content[:70].replace("\n", " "),
                )
    finally:
        session.close()


if __name__ == "__main__":
    main()