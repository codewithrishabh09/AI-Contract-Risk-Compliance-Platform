import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy import text as sa_text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.contract_version import ContractVersion


class Clause(Base):
    """Stores a clause extracted from a contract version."""

    __tablename__ = "clauses"

    __table_args__ = (
        UniqueConstraint(
            "contract_version_id",
            "clause_index",
            name="uq_clauses_version_index",
        ),
        CheckConstraint(
            "clause_index >= 0",
            name="ck_clauses_index",
        ),
        CheckConstraint(
            "clause_type IN ("
            "'CONFIDENTIALITY', "
            "'TERMINATION', "
            "'INDEMNITY', "
            "'LIABILITY', "
            "'PAYMENT', "
            "'RENEWAL', "
            "'DATA_PROTECTION', "
            "'INTELLECTUAL_PROPERTY', "
            "'DISPUTE_RESOLUTION', "
            "'GOVERNING_LAW', "
            "'OTHER'"
            ")",
            name="ck_clauses_type",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_start >= 1",
            name="ck_clauses_page_start",
        ),
        CheckConstraint(
            "page_end IS NULL OR page_end >= 1",
            name="ck_clauses_page_end",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_end IS NULL "
            "OR page_end >= page_start",
            name="ck_clauses_page_range",
        ),
        CheckConstraint(
            "confidence_score IS NULL OR "
            "(confidence_score >= 0 AND confidence_score <= 1)",
            name="ck_clauses_confidence",
        ),
        Index(
            "ix_clauses_version_type",
            "contract_version_id",
            "clause_type",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    contract_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "contract_versions.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    clause_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    clause_type: Mapped[str] = mapped_column(
        String(60),
        nullable=False,
        default="OTHER",
        server_default=sa_text("'OTHER'"),
    )

    title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    page_start: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    page_end: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    confidence_score: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )

    extraction_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="RULE_BASED",
        server_default=sa_text("'RULE_BASED'"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    contract_version: Mapped["ContractVersion"] = relationship(
        "ContractVersion",
        back_populates="clauses",
    )

    def __repr__(self) -> str:
        return (
            f"Clause(id={self.id!r}, "
            f"clause_type={self.clause_type!r}, "
            f"clause_index={self.clause_index!r})"
        )