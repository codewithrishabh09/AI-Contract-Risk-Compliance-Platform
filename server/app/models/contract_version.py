import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.analysis_result import AnalysisResult
    from app.models.clause import Clause
    from app.models.contract import Contract
    from app.models.document import Document
    from app.models.document_chunk import DocumentChunk
    from app.models.processing_job import ProcessingJob
    from app.models.user import User


class ContractVersion(Base):
    """Represents a version of a contract."""

    __tablename__ = "contract_versions"

    __table_args__ = (
        UniqueConstraint(
            "contract_id",
            "version_number",
            name="uq_contract_versions_contract_version",
        ),
        CheckConstraint(
            "version_number >= 1",
            name="ck_contract_versions_version_number",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    contract_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("contracts.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    version_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    uploaded_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    change_summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    contract: Mapped["Contract"] = relationship(
        "Contract",
        back_populates="versions",
    )

    uploader: Mapped["User"] = relationship(
        "User",
        back_populates="uploaded_contract_versions",
    )

    documents: Mapped[list["Document"]] = relationship(
        "Document",
        back_populates="contract_version",
    )

    processing_jobs: Mapped[list["ProcessingJob"]] = relationship(
        "ProcessingJob",
        back_populates="contract_version",
    )

    clauses: Mapped[list["Clause"]] = relationship(
        "Clause",
        back_populates="contract_version",
    )

    document_chunks: Mapped[list["DocumentChunk"]] = relationship(
        "DocumentChunk",
        back_populates="contract_version",
    )

    analysis_results: Mapped[list["AnalysisResult"]] = relationship(
        "AnalysisResult",
        back_populates="contract_version",
    )

    def __repr__(self) -> str:
        return (
            f"ContractVersion(id={self.id!r}, "
            f"contract_id={self.contract_id!r}, "
            f"version_number={self.version_number!r})"
        )
