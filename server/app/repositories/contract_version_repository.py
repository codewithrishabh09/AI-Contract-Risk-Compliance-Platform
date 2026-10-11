import uuid

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contract_version import ContractVersion


class ContractVersionRepository:
    """Database operations for contract versions."""

    @staticmethod
    def get_next_version_number(
        session: Session,
        *,
        contract_id: uuid.UUID,
    ) -> int:
        """Return the next version number for a contract."""

        statement = select(
            func.coalesce(
                func.max(ContractVersion.version_number),
                0,
            )
            + 1
        ).where(
            ContractVersion.contract_id == contract_id,
        )

        return int(session.scalar(statement) or 1)

    @staticmethod
    def create(
        session: Session,
        *,
        contract_id: uuid.UUID,
        version_number: int,
        uploaded_by: uuid.UUID,
        change_summary: str | None = None,
    ) -> ContractVersion:
        """Create a new contract version."""

        contract_version = ContractVersion(
            contract_id=contract_id,
            version_number=version_number,
            uploaded_by=uploaded_by,
            change_summary=change_summary,
        )

        session.add(contract_version)
        session.flush()

        return contract_version