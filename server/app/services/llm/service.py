from functools import lru_cache

from app.core.config import settings
from app.services.llm.base import (
    LLMProvider,
    LLMProviderError,
)
from app.services.llm.openai_provider import OpenAIProvider

# All of these speak the OpenAI-compatible Chat Completions API.
# The base URL, key and model come from settings (.env).
OPENAI_COMPATIBLE_PROVIDERS = {
    "openai",
    "groq",
    "gemini",
    "ollama",
}


@lru_cache(maxsize=1)
def get_llm_provider() -> LLMProvider:
    provider_name = settings.llm_provider.strip().lower()

    if provider_name in OPENAI_COMPATIBLE_PROVIDERS:
        return OpenAIProvider()

    raise LLMProviderError(
        f"Unsupported LLM provider: {provider_name}"
    )