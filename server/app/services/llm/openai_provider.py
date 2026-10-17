from openai import OpenAI

from app.core.config import settings
from app.services.llm.base import (
    LLMProvider,
    LLMProviderError,
    LLMResponse,
)


class OpenAIProvider(LLMProvider):
    """OpenAI-compatible LLM provider."""

    def __init__(
        self,
        *,
        api_key: str | None = None,
        model: str | None = None,
    ) -> None:
        resolved_api_key = api_key or settings.openai_api_key
        resolved_model = model or settings.llm_model

        if not resolved_api_key:
            raise LLMProviderError(
                "OPENAI_API_KEY is not configured."
            )

        self.client = OpenAI(api_key=resolved_api_key)
        self.model = resolved_model

    def generate(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
    ) -> LLMResponse:
        try:
            response = self.client.responses.create(
                model=self.model,
                instructions=system_prompt,
                input=user_prompt,
            )

            content = response.output_text.strip()

            if not content:
                raise LLMProviderError(
                    "LLM returned an empty response."
                )

            return LLMResponse(
                content=content,
                model=self.model,
                provider="openai",
            )

        except LLMProviderError:
            raise

        except Exception as exc:
            raise LLMProviderError(
                "LLM provider request failed."
            ) from exc