from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status
from sqlalchemy.orm import Session

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
    """Provide a database session for one API request."""

    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


DatabaseSession = Annotated[Session, Depends(get_db)]
OrganizationHeader = Annotated[
    UUID,
    Header(alias="X-Organization-ID"),
]
UserHeader = Annotated[
    UUID,
    Header(alias="X-User-ID"),
]


@router.post(
    "",
    response_model=ContractResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_contract(
    payload: ContractCreate,
    session: DatabaseSession,
    organization_id: OrganizationHeader,
    user_id: UserHeader,
) -> ContractResponse:
    """Create a contract for an organization."""

    try:
        contract = ContractService.create_contract(
            session,
            organization_id=organization_id,
            created_by=user_id,
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
    organization_id: OrganizationHeader,
    offset: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    contract_status: Annotated[
        str | None,
        Query(alias="status"),
    ] = None,
) -> ContractListResponse:
    """List contracts belonging to an organization."""

    try:
        contracts, total = ContractService.list_contracts(
            session,
            organization_id=organization_id,
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
    organization_id: OrganizationHeader,
) -> ContractResponse:
    """Retrieve a contract within the requested organization."""

    try:
        contract = ContractService.get_contract(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )
        return ContractResponse.model_validate(contract)

    except ContractNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contract not found.",
        ) from exc