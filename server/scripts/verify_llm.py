import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import settings  # noqa: E402
from app.services.llm.service import get_llm_provider  # noqa: E402


def main() -> None:
    print("provider:", settings.llm_provider)
    print("base_url:", settings.llm_base_url)
    print("model:", settings.llm_model)
    print("has_key:", bool(settings.llm_api_key or settings.openai_api_key))

    provider = get_llm_provider()
    response = provider.generate(
        system_prompt="You are a helpful assistant.",
        user_prompt="Say hello in five words.",
    )
    print("RESPONSE:", response.content)


if __name__ == "__main__":
    main()