import logging
import uuid

from fastapi import APIRouter, HTTPException, status

from app.api.dependencies import CurrentUser, DatabaseSession
from app.repositories.contract_version_repository import (
    ContractVersionRepository,
)
from app.schemas.rag import RAGAnswer, RAGQuestionRequest
from app.services.rag.citation_validator import CitationValidationError
from app.services.rag_service import RAGService

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/contracts",
    tags=["RAG"],
)


@router.post(
    "/{contract_id}/versions/{version_id}/ask",
    response_model=RAGAnswer,
    status_code=status.HTTP_200_OK,
)
def ask_contract_question(
    contract_id: uuid.UUID,
    version_id: uuid.UUID,
    payload: RAGQuestionRequest,
    session: DatabaseSession,
    current_user: CurrentUser,
) -> RAGAnswer:

    contract_version = ContractVersionRepository.get_by_id_for_contract(
        session,
        organization_id=current_user.organization_id,
        contract_id=contract_id,
        contract_version_id=version_id,
    )

    if contract_version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract version not found.",
        )

    try:
        return RAGService.answer_question(
            session,
            organization_id=current_user.organization_id,
            contract_id=contract_id,
            contract_version_id=version_id,
            question=payload.question,
            top_k=payload.top_k,
        )

    except CitationValidationError as exc:
        logger.warning("RAG citation validation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        logger.exception("RAG answer generation failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="RAG answer generation failed.",
        ) from exc