from openai import OpenAI

from app.core.config import settings
from app.services.llm.base import (
    LLMProvider,
    LLMProviderError,
    LLMResponse,
)


class OpenAIProvider(LLMProvider):
    """OpenAI-compatible LLM provider (OpenAI, Groq, Gemini, Ollama)."""

    def __init__(
        self,
        *,
        api_key: str | None = None,
        model: str | None = None,
        base_url: str | None = None,
    ) -> None:
        resolved_api_key = (
            api_key
            or settings.llm_api_key
            or settings.openai_api_key
        )
        resolved_model = model or settings.llm_model
        resolved_base_url = base_url or settings.llm_base_url

        if not resolved_api_key:
            raise LLMProviderError(
                "LLM_API_KEY is not configured."
            )

        self.client = OpenAI(
            api_key=resolved_api_key,
            base_url=resolved_base_url or None,
            timeout=60.0,
            max_retries=2,
        )
        self.model = resolved_model
        self.provider_name = settings.llm_provider

    def generate(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
    ) -> LLMResponse:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.1,
            )

            content = (
                response.choices[0].message.content or ""
            ).strip()

            if not content:
                raise LLMProviderError(
                    "LLM returned an empty response."
                )

            return LLMResponse(
                content=content,
                model=self.model,
                provider=self.provider_name,
            )

        except LLMProviderError:
            raise

        except Exception as exc:
            raise LLMProviderError(
                f"LLM provider request failed: {type(exc).__name__}"
            ) from exc