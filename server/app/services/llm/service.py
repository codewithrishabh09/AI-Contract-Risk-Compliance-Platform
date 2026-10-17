from functools import lru_cache

from app.core.config import settings
from app.services.llm.base import (
    LLMProvider,
    LLMProviderError,
)
from app.services.llm.openai_provider import OpenAIProvider


@lru_cache(maxsize=1)
def get_llm_provider() -> LLMProvider:
    provider_name = settings.llm_provider.strip().lower()

    if provider_name == "openai":
        return OpenAIProvider()

    raise LLMProviderError(
        f"Unsupported LLM provider: {provider_name}"
    )