import uuid

from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.repositories.contract_repository import ContractRepository


class ContractServiceError(Exception):
    """Base exception for contract service errors."""


class ContractNotFoundError(ContractServiceError):
    """Raised when a contract is not found within the organization."""


class InvalidContractDataError(ContractServiceError):
    """Raised when contract input violates business rules."""


class ContractService:
    """Business logic for contract operations."""

    ALLOWED_CONTRACT_TYPES = {
        "NDA",
        "EMPLOYMENT",
        "SERVICE_AGREEMENT",
        "VENDOR_AGREEMENT",
        "DATA_PROCESSING_AGREEMENT",
        "PRIVACY_POLICY",
        "OTHER",
    }

    ALLOWED_STATUSES = {
        "DRAFT",
        "UPLOADED",
        "PROCESSING",
        "ANALYZED",
        "UNDER_REVIEW",
        "APPROVED",
        "REJECTED",
        "ARCHIVED",
    }

    @staticmethod
    def create_contract(
        session: Session,
        *,
        organization_id: uuid.UUID,
        created_by: uuid.UUID,
        title: str,
        contract_type: str,
        description: str | None = None,
    ) -> Contract:
        """Validate and create a contract within one transaction."""

        normalized_title = title.strip()
        normalized_type = contract_type.strip().upper()

        if not normalized_title:
            raise InvalidContractDataError(
                "Contract title cannot be empty."
            )

        if len(normalized_title) > 255:
            raise InvalidContractDataError(
                "Contract title cannot exceed 255 characters."
            )

        if normalized_type not in ContractService.ALLOWED_CONTRACT_TYPES:
            raise InvalidContractDataError(
                f"Unsupported contract type: {normalized_type}."
            )

        normalized_description = (
            description.strip() if description else None
        )

        try:
            contract = ContractRepository.create(
                session,
                organization_id=organization_id,
                created_by=created_by,
                title=normalized_title,
                contract_type=normalized_type,
                description=normalized_description or None,
            )

            session.commit()
            session.refresh(contract)
            return contract

        except IntegrityError as exc:
            session.rollback()
            raise InvalidContractDataError(
                "Contract could not be created. "
                "Verify that the organization and creator exist."
            ) from exc

        except SQLAlchemyError:
            session.rollback()
            raise

    @staticmethod
    def get_contract(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
    ) -> Contract:
        """Fetch a contract without crossing organization boundaries."""

        contract = ContractRepository.get_by_id(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            raise ContractNotFoundError(
                "Contract not found in this organization."
            )

        return contract

    @staticmethod
    def list_contracts(
        session: Session,
        *,
        organization_id: uuid.UUID,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
    ) -> tuple[list[Contract], int]:
        """Validate pagination and list organization contracts."""

        if offset < 0:
            raise InvalidContractDataError(
                "Offset cannot be negative."
            )

        if not 1 <= limit <= 100:
            raise InvalidContractDataError(
                "Limit must be between 1 and 100."
            )

        normalized_status = status.strip().upper() if status else None

        if (
            normalized_status is not None
            and normalized_status not in ContractService.ALLOWED_STATUSES
        ):
            raise InvalidContractDataError(
                f"Unsupported contract status: {normalized_status}."
            )

        return ContractRepository.list_by_organization(
            session,
            organization_id=organization_id,
            offset=offset,
            limit=limit,
            status=normalized_status,
        )