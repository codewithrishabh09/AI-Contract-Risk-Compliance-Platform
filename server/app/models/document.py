import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    String,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.contract_version import ContractVersion


class Document(Base):
    """Stores metadata for a file associated with a contract version."""

    __tablename__ = "documents"

    __table_args__ = (
        UniqueConstraint(
            "storage_key",
            name="uq_documents_storage_key",
        ),
        CheckConstraint(
            "file_size_bytes > 0",
            name="ck_documents_file_size_positive",
        ),
        CheckConstraint(
            "status IN ("
            "'PENDING', "
            "'SCANNING', "
            "'AVAILABLE', "
            "'QUARANTINED', "
            "'FAILED', "
            "'DELETED'"
            ")",
            name="ck_documents_status",
        ),
        CheckConstraint(
            "sha256_checksum IS NULL OR length(sha256_checksum) = 64",
            name="ck_documents_sha256_length",
        ),
        Index(
            "ix_documents_version_status",
            "contract_version_id",
            "status",
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

    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    storage_provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="s3",
        server_default=text("'s3'"),
    )

    storage_key: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )

    content_type: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    file_size_bytes: Mapped[int] = mapped_column(
        nullable=False,
    )

    sha256_checksum: Mapped[str | None] = mapped_column(
        String(64),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDING",
        server_default=text("'PENDING'"),
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    contract_version: Mapped["ContractVersion"] = relationship(
        "ContractVersion",
        back_populates="documents",
    )

    def __repr__(self) -> str:
        return (
            f"Document(id={self.id!r}, "
            f"original_filename={self.original_filename!r}, "
            f"status={self.status!r})"
        )
