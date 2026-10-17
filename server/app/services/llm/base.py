from abc import ABC, abstractmethod
from dataclasses import dataclass


class LLMProviderError(Exception):
    """Base exception for LLM provider errors."""


@dataclass(slots=True)
class LLMResponse:
    content: str
    model: str
    provider: str


class LLMProvider(ABC):
    """Abstract interface for all LLM providers."""

    @abstractmethod
    def generate(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
    ) -> LLMResponse:
        """Generate an LLM response."""
        raise NotImplementedError