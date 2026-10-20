import json
import re
import uuid

from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.models.risk_finding import RiskFinding
from app.repositories.document_chunk_repository import DocumentChunkRepository
from app.schemas.analysis import ContractAnalysisOutput
from app.services.analysis.prompts import (
    ANALYSIS_SYSTEM_PROMPT,
    ANALYSIS_USER_PROMPT,
)
from app.services.llm import get_llm_provider
from app.services.retrieval.context_builder import ContextBlock
from app.services.retrieval import (
    render_context,
)


class ContractAnalysisError(Exception):
    """Base contract analysis error."""


def _extract_json(text: str) -> dict:
    """Parse JSON from an LLM reply, tolerating code fences and prose."""
    cleaned = text.strip()

    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end <= start:
            raise

        return json.loads(cleaned[start : end + 1])


class ContractAnalysisService:
    """Service responsible for full contract risk analysis."""

    PROMPT_VERSION = "v1"

    @staticmethod
    def analyze(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
        candidate_k: int = 30,
        top_k: int = 15,
    ) -> AnalysisResult:

        chunks = DocumentChunkRepository.list_by_contract_version_id(
            session,
            contract_version_id=contract_version_id,
        )[:top_k]

        context_blocks = [
            ContextBlock(
                citation_id=f"chunk-{position}",
                chunk_index=chunk.chunk_index,
                page_start=chunk.page_start,
                page_end=chunk.page_end,
                content=chunk.content.strip(),
            )
            for position, chunk in enumerate(chunks, start=1)
        ]

        if not context_blocks:
            raise ContractAnalysisError(
                "No contract evidence is available for analysis."
            )

        rendered_context = render_context(context_blocks)

        user_prompt = ANALYSIS_USER_PROMPT.format(
            context=rendered_context,
        )

        provider = get_llm_provider()

        response = provider.generate(
            system_prompt=ANALYSIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        try:
            raw_data = _extract_json(response.content)
        except json.JSONDecodeError as exc:
            raise ContractAnalysisError(
                "LLM returned invalid analysis JSON."
            ) from exc

        try:
            analysis_output = ContractAnalysisOutput.model_validate(
                raw_data
            )
        except Exception as exc:
            raise ContractAnalysisError(
                f"LLM analysis failed schema validation: {exc}"
            ) from exc

        try:
            analysis_result = AnalysisResult(
                contract_version_id=contract_version_id,
                overall_risk_score=analysis_output.overall_risk_score,
                risk_level=analysis_output.risk_level,
                status=analysis_output.status,
                summary=analysis_output.summary,
                model_provider=response.provider,
                model_name=response.model,
                prompt_version=ContractAnalysisService.PROMPT_VERSION,
            )

            session.add(analysis_result)
            session.flush()

            for finding in analysis_output.findings:
                session.add(
                    RiskFinding(
                        analysis_result_id=analysis_result.id,
                        category=finding.category,
                        title=finding.title,
                        description=finding.description,
                        severity=finding.severity,
                        recommendation=finding.recommendation,
                        evidence_text=finding.evidence_text,
                        page_start=finding.page_start,
                        page_end=finding.page_end,
                        confidence_score=finding.confidence_score,
                    )
                )

            session.commit()
            session.refresh(analysis_result)

        except Exception:
            session.rollback()
            raise

        return analysis_result