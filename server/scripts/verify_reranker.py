import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.reranking import rerank  # noqa: E402

ITEMS = [
    {
        "id": 1,
        "text": "Payment shall be made within thirty days.",
    },
    {
        "id": 2,
        "text": (
            "Either party may terminate this agreement "
            "with thirty days written notice."
        ),
    },
    {
        "id": 3,
        "text": "The governing law shall be the laws of India.",
    },
]


def main() -> None:
    results = rerank(
        "What is the termination notice period?",
        ITEMS,
        text_getter=lambda item: item["text"],
        top_k=3,
    )

    for result in results:
        print(
            round(result.score, 3),
            result.item["id"],
            result.item["text"],
        )

    top_id = results[0].item["id"]
    print("\nTop result is the termination chunk:", top_id == 2)


if __name__ == "__main__":
    main()