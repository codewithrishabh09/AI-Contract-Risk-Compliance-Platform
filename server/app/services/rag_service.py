from sqlalchemy.orm import Session

from app.schemas.rag import RAGAnswer
from app.services.llm import get_llm_provider
from app.services.rag.citation_validator import validate_citations
from app.services.retrieval import (
    RetrievalService,
    build_context,
    render_context,
)


SYSTEM_PROMPT = """
You are an AI contract analysis assistant.

Your job is to answer questions using ONLY the supplied contract evidence.

Rules:

1. Use only the supplied contract evidence.
2. Do not invent contract terms.
3. Do not use outside legal knowledge as contract evidence.
4. If the evidence is insufficient, clearly say that the available contract
   evidence is insufficient.
5. Be precise and concise.
6. Every factual statement based on contract evidence must include a citation.
7. Citations must use ONLY the citation IDs provided in the evidence.
8. Never create a new citation ID.
9. Never cite evidence that was not provided.
10. Do not guess missing contract information.
"""


class RAGService:
    """Application service for contract question answering."""

    @staticmethod
    def answer_question(
        session: Session,
        *,
        organization_id,
        contract_id,
        contract_version_id,
        question: str,
        candidate_k: int = 15,
        top_k: int = 5,
    ) -> RAGAnswer:
        if not question or not question.strip():
            raise ValueError("Question must not be empty.")

        retrieved_chunks = (
            RetrievalService.hybrid_retrieve_with_reranking(
                session,
                organization_id=organization_id,
                contract_id=contract_id,
                contract_version_id=contract_version_id,
                query=question.strip(),
                vector_k=candidate_k,
                keyword_k=candidate_k,
                candidate_k=candidate_k,
                top_k=top_k,
            )
        )

        context_blocks = build_context(retrieved_chunks)

        if not context_blocks:
            return RAGAnswer(
                answer=(
                    "I could not find sufficient evidence in the "
                    "available contract content to answer this question."
                ),
                citations=[],
                model_provider="none",
                model_name="none",
            )

        rendered_context = render_context(context_blocks)

        user_prompt = f"""
Contract evidence:

{rendered_context}

Question:

{question.strip()}

Answer the question using only the contract evidence above.

Important:
- Cite factual statements using the exact citation IDs provided.
- Example: [chunk-1]
- Do not create citation IDs that are not present in the evidence.
- If the evidence is insufficient, explicitly say so.
"""

        provider = get_llm_provider()

        response = provider.generate(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        citations = validate_citations(
            answer=response.content,
            context_blocks=context_blocks,
        )

        return RAGAnswer(
            answer=response.content,
            citations=citations,
            model_provider=response.provider,
            model_name=response.model,
        )