import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.contract_version import ContractVersion
    from app.models.risk_finding import RiskFinding


class AnalysisResult(Base):
    """Stores the result of one contract analysis run."""

    __tablename__ = "analysis_results"

    __table_args__ = (
        CheckConstraint(
            "overall_risk_score IS NULL OR "
            "(overall_risk_score >= 0 AND overall_risk_score <= 100)",
            name="ck_analysis_results_risk_score",
        ),
        CheckConstraint(
            "risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')",
            name="ck_analysis_results_risk_level",
        ),
        CheckConstraint(
            "status IN ('COMPLETED', 'NEEDS_REVIEW', 'FAILED')",
            name="ck_analysis_results_status",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    contract_version_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("contract_versions.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    overall_risk_score: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True,
    )

    risk_level: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="MEDIUM",
        server_default="MEDIUM",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="COMPLETED",
        server_default="COMPLETED",
    )

    summary: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    model_provider: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    model_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    prompt_version: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    contract_version: Mapped["ContractVersion"] = relationship(
        "ContractVersion",
        back_populates="analysis_results",
    )

    findings: Mapped[list["RiskFinding"]] = relationship(
        "RiskFinding",
        back_populates="analysis_result",
    )

    def __repr__(self) -> str:
        return (
            f"AnalysisResult(id={self.id!r}, "
            f"contract_version_id={self.contract_version_id!r}, "
            f"risk_level={self.risk_level!r}, "
            f"status={self.status!r})"
        )