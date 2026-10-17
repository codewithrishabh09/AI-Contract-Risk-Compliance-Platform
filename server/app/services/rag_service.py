import uuid

from sqlalchemy.orm import Session

from app.schemas.rag import Citation, RAGAnswer
from app.services.llm import get_llm_provider
from app.services.retrieval import (
    RetrievalService,
    build_context,
    render_context,
)


SYSTEM_PROMPT = """
You are an AI contract analysis assistant.

Your job is to answer questions using ONLY the contract
evidence supplied in the context.

Rules:

1. Do not invent contract terms.
2. Do not use outside legal knowledge as contract evidence.
3. If the supplied evidence does not contain the answer,
   clearly say that the available contract evidence is insufficient.
4. Be precise and concise.
5. When making a factual statement about the contract,
   reference the relevant citation ID such as [chunk-1].
6. Do not create citation IDs that are not present in the context.
7. Never claim that a contract contains something when the
   supplied evidence does not support it.
""".strip()


class RAGService:
    @staticmethod
    def answer_question(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
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
                query=question,
                candidate_k=candidate_k,
                top_k=top_k,
            )
        )

        context_blocks = build_context(retrieved_chunks)

        context = render_context(context_blocks)

        if not context:
            return RAGAnswer(
                answer=(
                    "I could not find sufficient contract evidence "
                    "to answer this question."
                ),
                citations=[],
                model_provider="none",
                model_name="none",
            )

        user_prompt = f"""
Contract evidence:

{context}

User question:

{question.strip()}

Answer the question using only the contract evidence above.
Include citation IDs in square brackets.
""".strip()

        provider = get_llm_provider()

        response = provider.generate(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        citations = [
            Citation(
                citation_id=block.citation_id,
                chunk_index=block.chunk_index,
                page_start=block.page_start,
                page_end=block.page_end,
            )
            for block in context_blocks
        ]

        return RAGAnswer(
            answer=response.content,
            citations=citations,
            model_provider=response.provider,
            model_name=response.model,
        )