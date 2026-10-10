import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
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
    from app.models.user import User


class ProcessingJob(Base):
    """Tracks a background contract-processing operation."""

    __tablename__ = "processing_jobs"

    __table_args__ = (
        CheckConstraint(
            "job_type IN ("
            "'TEXT_EXTRACTION', "
            "'CLAUSE_EXTRACTION', "
            "'FULL_ANALYSIS', "
            "'REANALYSIS'"
            ")",
            name="ck_processing_jobs_job_type",
        ),
        CheckConstraint(
            "status IN ("
            "'QUEUED', "
            "'RUNNING', "
            "'SUCCEEDED', "
            "'FAILED', "
            "'CANCELLED'"
            ")",
            name="ck_processing_jobs_status",
        ),
        CheckConstraint(
            "attempt_count >= 0",
            name="ck_processing_jobs_attempt_count",
        ),
        CheckConstraint(
            "max_attempts >= 1",
            name="ck_processing_jobs_max_attempts",
        ),
        CheckConstraint(
            "completed_at IS NULL OR started_at IS NULL "
            "OR completed_at >= started_at",
            name="ck_processing_jobs_completion_time",
        ),
        Index(
            "ix_processing_jobs_status_created",
            "status",
            "created_at",
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

    requested_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "users.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    job_type: Mapped[str] = mapped_column(
        String(40),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="QUEUED",
        server_default=text("'QUEUED'"),
    )

    attempt_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
        server_default=text("0"),
    )

    max_attempts: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=3,
        server_default=text("3"),
    )

    error_code: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
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

    contract_version: Mapped["ContractVersion"] = relationship(
        "ContractVersion",
        back_populates="processing_jobs",
    )

    requester: Mapped["User | None"] = relationship(
        "User",
        back_populates="requested_processing_jobs",
    )

    def __repr__(self) -> str:
        return (
            f"ProcessingJob(id={self.id!r}, "
            f"job_type={self.job_type!r}, "
            f"status={self.status!r})"
        )