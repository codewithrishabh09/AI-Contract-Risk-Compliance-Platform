import sys
from pathlib import Path

# Make `app` importable no matter where the script is run from.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pydantic import ValidationError  # noqa: E402

from app.schemas.contract import ContractCreate  # noqa: E402


def main() -> None:
    payload = {
        "title": "Software Services Agreement",
        "contract_type": "SERVICE_AGREEMENT",
        "description": "Agreement for software development services.",
    }

    request = ContractCreate.model_validate(payload)
    print(request.model_dump())

    try:
        ContractCreate.model_validate(
            {
                "title": "   ",
                "contract_type": "UNKNOWN",
            }
        )
    except ValidationError:
        print("Invalid request correctly rejected.")
    else:
        print("ERROR: invalid request was accepted.")


if __name__ == "__main__":
    main()