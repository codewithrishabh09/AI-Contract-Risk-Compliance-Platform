from typing import Annotated
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_db,
    require_permissions,
)
from app.core.permissions import Permission
from app.models.user import User
from app.schemas.contract import (
    ContractCreate,
    ContractListResponse,
    ContractResponse,
)
from app.schemas.contract_document import ContractUploadResponse
from app.services.contract_document_service import (
    ContractDocumentService,
    ContractDocumentServiceError,
    ContractNotFoundForUploadError,
    InvalidDocumentError,
)

from app.services.audit_service import AuditService
from app.services.contract_service import (
    ContractNotFoundError,
    ContractService,
    InvalidContractDataError,
)
from app.storage.local import LocalStorage

router = APIRouter(
    prefix="/contracts",
    tags=["Contract Versions"],
)


DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]

# Permission-protected current user dependencies.
# Each one runs: JWT -> CurrentUser -> role -> ROLE_PERMISSIONS -> check
ContractReader = Annotated[
    User,
    Depends(require_permissions(Permission.CONTRACT_READ)),
]

ContractCreator = Annotated[
    User,
    Depends(require_permissions(Permission.CONTRACT_CREATE)),
]

ContractUploader = Annotated[
    User,
    Depends(require_permissions(Permission.CONTRACT_UPLOAD)),
]


@router.post(
    "",
    response_model=ContractResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Contracts"],
)
def create_contract(
    payload: ContractCreate,
    session: DatabaseSession,
    current_user: ContractCreator,
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

        AuditService.log(
            session,
            organization_id=current_user.organization_id,
            user_id=current_user.id,
            contract_id=contract.id,
            action="CONTRACT_CREATED",
            resource_type="CONTRACT",
            resource_id=contract.id,
            description="Contract created.",
        )
        session.commit()

        return ContractResponse.model_validate(contract)

    except InvalidContractDataError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get(
    "",
    response_model=ContractListResponse,
    tags=["Contracts"],
)
def list_contracts(
    session: DatabaseSession,
    current_user: ContractReader,
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
    tags=["Contracts"],
)
def get_contract(
    contract_id: UUID,
    session: DatabaseSession,
    current_user: ContractReader,
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


@router.post(
    "/{contract_id}/versions",
    response_model=ContractUploadResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Contract Versions"],
)
def upload_contract_document(
    contract_id: UUID,
    current_user: ContractUploader,
    session: DatabaseSession,
    file: UploadFile = File(...),
    change_summary: str | None = Form(
        default=None,
        max_length=2000,
    ),
) -> ContractUploadResponse:
    """Upload a new document version for a contract."""

    content = file.file.read()

    storage = LocalStorage("storage")

    try:
        (
            contract,
            contract_version,
            document,
            processing_job,
        ) = ContractDocumentService.upload_document(
            session,
            organization_id=current_user.organization_id,
            user_id=current_user.id,
            contract_id=contract_id,
            original_filename=file.filename or "",
            content_type=file.content_type,
            content=content,
            change_summary=change_summary,
            storage=storage,
        )

        AuditService.log(
            session,
            organization_id=current_user.organization_id,
            user_id=current_user.id,
            contract_id=contract.id,
            contract_version_id=contract_version.id,
            action="CONTRACT_VERSION_UPLOADED",
            resource_type="CONTRACT_VERSION",
            resource_id=contract_version.id,
            description="Contract version uploaded.",
            metadata={
                "filename": document.original_filename,
                "file_size_bytes": document.file_size_bytes,
            },
        )
        session.commit()

        return ContractUploadResponse(
            contract_version=contract_version,
            document=document,
            processing_job=processing_job,
        )

    except ContractNotFoundForUploadError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    except InvalidDocumentError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc