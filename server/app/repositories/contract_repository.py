import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contract import Contract


class ContractRepository:
    """Database operations for organization-scoped contracts."""

    @staticmethod
    def get_by_id(
        session: Session,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
    ) -> Contract | None:
        """Return a contract only if it belongs to the organization."""

        statement = select(Contract).where(
            Contract.id == contract_id,
            Contract.organization_id == organization_id,
        )

        return session.scalar(statement)

    @staticmethod
    def get_by_id_for_update(
        session: Session,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
    ) -> Contract | None:
        """Get a contract while locking its row for the current transaction."""

        statement = (
            select(Contract)
            .where(
                Contract.id == contract_id,
                Contract.organization_id == organization_id,
            )
            .with_for_update()
        )

        return session.scalar(statement)

    @staticmethod
    def update_status(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        status: str,
    ) -> Contract | None:
        """Update the status of an organization-scoped contract."""

        contract = ContractRepository.get_by_id_for_update(
            session,
            organization_id=organization_id,
            contract_id=contract_id,
        )

        if contract is None:
            return None

        contract.status = status
        session.flush()

        return contract

    @staticmethod
    def list_by_organization(
        session: Session,
        organization_id: uuid.UUID,
        *,
        offset: int = 0,
        limit: int = 20,
        status: str | None = None,
    ) -> tuple[list[Contract], int]:
        """Return paginated contracts and the total matching count."""

        filters = [
            Contract.organization_id == organization_id,
        ]

        if status is not None:
            filters.append(Contract.status == status)

        count_statement = (
            select(func.count())
            .select_from(Contract)
            .where(*filters)
        )
        total = session.scalar(count_statement) or 0

        statement = (
            select(Contract)
            .where(*filters)
            .order_by(Contract.created_at.desc(), Contract.id)
            .offset(offset)
            .limit(limit)
        )

        contracts = list(session.scalars(statement).all())

        return contracts, total

    @staticmethod
    def create(
        session: Session,
        *,
        organization_id: uuid.UUID,
        created_by: uuid.UUID,
        title: str,
        contract_type: str,
        description: str | None = None,
    ) -> Contract:
        """Create a contract and add it to the current transaction."""

        contract = Contract(
            organization_id=organization_id,
            created_by=created_by,
            title=title,
            contract_type=contract_type,
            description=description,
        )

        session.add(contract)
        session.flush()

        return contract
