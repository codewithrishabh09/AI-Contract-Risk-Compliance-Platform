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

        if not resolved_model:
            raise LLMProviderError(
                "LLM_MODEL is not configured."
            )

        self.client = OpenAI(
            api_key=resolved_api_key,
            base_url=resolved_base_url or None,
            timeout=120.0,
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
            # Groq gpt-oss models prefer max_completion_tokens.
            # JSON object mode reduces empty / non-JSON replies.
            create_kwargs: dict = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.1,
                "max_completion_tokens": 8192,
            }

            # Force JSON when the prompt asks for structured output
            if "json" in user_prompt.lower() or "json" in system_prompt.lower():
                create_kwargs["response_format"] = {"type": "json_object"}

            response = self.client.chat.completions.create(**create_kwargs)

            if not response.choices:
                raise LLMProviderError(
                    "LLM returned no choices in the response."
                )

            choice = response.choices[0]
            message = choice.message
            content = (message.content or "").strip()
            refusal = getattr(message, "refusal", None)
            finish_reason = getattr(choice, "finish_reason", None)

            if not content:
                details = [
                    f"finish_reason={finish_reason!r}",
                    f"model={self.model!r}",
                    f"provider={self.provider_name!r}",
                ]
                if refusal:
                    details.append(f"refusal={refusal!r}")
                raise LLMProviderError(
                    "LLM returned an empty response. "
                    + ", ".join(details)
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
                f"LLM provider request failed: {type(exc).__name__}: {exc}"
            ) from exc