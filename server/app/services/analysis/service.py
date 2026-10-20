import json
import uuid

from sqlalchemy.orm import Session

from app.models.analysis_result import AnalysisResult
from app.models.risk_finding import RiskFinding
from app.schemas.analysis import ContractAnalysisOutput
from app.services.analysis.context import deduplicate_chunks
from app.services.analysis.context_builder import (
    build_analysis_context,
)
from app.services.analysis.coverage import calculate_domain_coverage
from app.services.analysis.domains import ANALYSIS_DOMAINS
from app.services.analysis.prompts import (
    ANALYSIS_SYSTEM_PROMPT,
    ANALYSIS_USER_PROMPT,
)
from app.services.analysis.retrieval import MultiPassRetriever
from app.services.llm import get_llm_provider
from app.services.retrieval import render_context


class ContractAnalysisError(Exception):
    """Base contract analysis error."""


class ContractAnalysisService:
    """Service responsible for multi-pass contract risk analysis."""

    PROMPT_VERSION = "v2"

    @staticmethod
    def analyze(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
        candidate_k: int = 10,
        top_k: int = 5,
    ) -> AnalysisResult:

        domain_results = MultiPassRetriever.retrieve(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
            contract_version_id=contract_version_id,
            domains=ANALYSIS_DOMAINS,
            candidate_k=candidate_k,
            top_k=top_k,
        )

        all_chunks = deduplicate_chunks(domain_results)

        if not all_chunks:
            raise ContractAnalysisError(
                "No contract evidence is available for analysis."
            )

        context_blocks = build_analysis_context(all_chunks)

        rendered_context = render_context(context_blocks)

        coverage = calculate_domain_coverage(domain_results)

        coverage_text = "\n".join(
            (
                f"- {item.domain_key}: "
                f"{item.chunk_count} evidence chunks found"
            )
            for item in coverage
        )

        user_prompt = ANALYSIS_USER_PROMPT.format(
            context=rendered_context,
            coverage=coverage_text,
        )

        provider = get_llm_provider()

        response = provider.generate(
            system_prompt=ANALYSIS_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        try:
            raw_data = json.loads(response.content)
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
                "LLM analysis failed schema validation."
            ) from exc

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
            risk_finding = RiskFinding(
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

            session.add(risk_finding)

        session.commit()
        session.refresh(analysis_result)

        return analysis_result