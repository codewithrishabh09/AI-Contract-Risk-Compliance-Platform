from __future__ import annotations

from typing import Any


class MockLLMProvider:
    """Deterministic LLM provider for automated tests."""

    def generate(
        self,
        *,
        prompt: str,
        **_: Any,
    ) -> str:
        return (
            '{"summary":"Test analysis",'
            '"overall_risk_score":25,'
            '"risk_level":"LOW",'
            '"findings":[]}'
        )