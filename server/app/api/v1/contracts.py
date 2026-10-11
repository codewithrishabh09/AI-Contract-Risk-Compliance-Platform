from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import CurrentUser
from app.db.session import SessionLocal
from app.schemas.contract import (
    ContractCreate,
    ContractListResponse,
    ContractResponse,
)
from app.services.contract_service import (
    ContractNotFoundError,
    ContractService,
    InvalidContractDataError,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
)


def get_db():
    session = SessionLocal()

    try:
        yield session
    finally:
        session.close()


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


@router.post(
    "",
    response_model=ContractResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_contract(
    payload: ContractCreate,
    session: DatabaseSession,
    current_user: CurrentUser,
) -> ContractResponse:
    try:
        contract = ContractService.create_contract(
            session,
            organization_id=current_user.organization_id,
            created_by=current_user.id,
            title=payload.title,
            contract_type=payload.contract_type,
            description=payload.description,
        )

        return ContractResponse.model_validate(contract)

    except InvalidContractDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "",
    response_model=ContractListResponse,
)
def list_contracts(
    session: DatabaseSession,
    current_user: CurrentUser,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    contract_status: Annotated[
        str | None,
        Query(alias="status"),
    ] = None,
) -> ContractListResponse:
    try:
        contracts, total = ContractService.list_contracts(
            session,
            organization_id=current_user.organization_id,
            offset=offset,
            limit=limit,
            status=contract_status,
        )

        return ContractListResponse(
            items=[
                ContractResponse.model_validate(contract)
                for contract in contracts
            ],
            total=total,
            offset=offset,
            limit=limit,
        )

    except InvalidContractDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "/{contract_id}",
    response_model=ContractResponse,
)
def get_contract(
    contract_id: UUID,
    session: DatabaseSession,
    current_user: CurrentUser,
) -> ContractResponse:
    try:
        contract = ContractService.get_contract(
            session,
            organization_id=current_user.organization_id,
            contract_id=contract_id,
        )

        return ContractResponse.model_validate(contract)

    except ContractNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        ) from exc