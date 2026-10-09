import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    Text,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.contract_version import ContractVersion
    from app.models.organization import Organization
    from app.models.user import User


class Contract(Base):
    """Represents a contract managed by an organization."""

    __tablename__ = "contracts"

    __table_args__ = (
        CheckConstraint(
            "contract_type IN ("
            "'NDA', "
            "'EMPLOYMENT', "
            "'SERVICE_AGREEMENT', "
            "'VENDOR_AGREEMENT', "
            "'DATA_PROCESSING_AGREEMENT', "
            "'PRIVACY_POLICY', "
            "'OTHER'"
            ")",
            name="ck_contracts_contract_type",
        ),
        CheckConstraint(
            "status IN ("
            "'DRAFT', "
            "'UPLOADED', "
            "'PROCESSING', "
            "'ANALYZED', "
            "'UNDER_REVIEW', "
            "'APPROVED', "
            "'REJECTED', "
            "'ARCHIVED'"
            ")",
            name="ck_contracts_status",
        ),
        Index(
            "ix_contracts_organization_status",
            "organization_id",
            "status",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("organizations.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    contract_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="OTHER",
        server_default=text("'OTHER'"),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="DRAFT",
        server_default=text("'DRAFT'"),
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    organization: Mapped["Organization"] = relationship(
        "Organization",
        back_populates="contracts",
    )

    creator: Mapped["User"] = relationship(
        "User",
        back_populates="created_contracts",
    )

    versions: Mapped[list["ContractVersion"]] = relationship(
        "ContractVersion",
        back_populates="contract",
    )

    def __repr__(self) -> str:
        return (
            f"Contract(id={self.id!r}, "
            f"title={self.title!r}, "
            f"status={self.status!r})"
        )