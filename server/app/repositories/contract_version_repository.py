import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contract import Contract
from app.models.contract_version import ContractVersion


class ContractVersionRepository:
    """Repository for contract version database operations."""

    @staticmethod
    def get_by_id_for_contract(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
        contract_version_id: uuid.UUID,
    ) -> ContractVersion | None:
        statement = (
            select(ContractVersion)
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                ContractVersion.id == contract_version_id,
                ContractVersion.contract_id == contract_id,
                Contract.organization_id == organization_id,
            )
        )

        return session.scalar(statement)

    @staticmethod
    def get_next_version_number(
        session: Session,
        *,
        contract_id: uuid.UUID,
    ) -> int:
        statement = select(ContractVersion.version_number).where(
            ContractVersion.contract_id == contract_id
        ).order_by(
            ContractVersion.version_number.desc()
        )

        latest_version = session.scalar(statement)

        if latest_version is None:
            return 1

        return latest_version + 1

    @staticmethod
    def create(
        session: Session,
        *,
        contract_version: ContractVersion,
    ) -> ContractVersion:
        session.add(contract_version)
        session.flush()
        return contract_version
    
    @staticmethod
    def list_for_contract(
        session: Session,
        *,
        organization_id: uuid.UUID,
        contract_id: uuid.UUID,
    ) -> list[ContractVersion]:
        statement = (
            select(ContractVersion)
            .join(
                Contract,
                Contract.id == ContractVersion.contract_id,
            )
            .where(
                ContractVersion.contract_id == contract_id,
                Contract.organization_id == organization_id,
            )
            .order_by(
                ContractVersion.version_number.asc(),
            )
        )

        return list(session.scalars(statement).all())