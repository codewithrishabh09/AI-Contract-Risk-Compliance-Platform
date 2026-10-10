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
    from app.models.analysis_result import AnalysisResult
    from app.models.clause import Clause


class RiskFinding(Base):
    """Stores an individual risk identified during contract analysis."""

    __tablename__ = "risk_findings"

    __table_args__ = (
        CheckConstraint(
            "severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')",
            name="ck_risk_findings_severity",
        ),
        CheckConstraint(
            "status IN ('OPEN', 'ACCEPTED', 'MITIGATED', 'DISMISSED')",
            name="ck_risk_findings_status",
        ),
        CheckConstraint(
            "confidence_score IS NULL OR "
            "(confidence_score >= 0 AND confidence_score <= 1)",
            name="ck_risk_findings_confidence_score",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_start >= 1",
            name="ck_risk_findings_page_start",
        ),
        CheckConstraint(
            "page_end IS NULL OR page_end >= 1",
            name="ck_risk_findings_page_end",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_end IS NULL OR page_end >= page_start",
            name="ck_risk_findings_page_range",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    analysis_result_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("analysis_results.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    clause_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clauses.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(80),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    severity: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    recommendation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    evidence_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    page_start: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    page_end: Mapped[int | None] = mapped_column(
        nullable=True,
    )

    confidence_score: Mapped[float | None] = mapped_column(
        Numeric(5, 4),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="OPEN",
        server_default="OPEN",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    analysis_result: Mapped["AnalysisResult"] = relationship(
        "AnalysisResult",
        back_populates="findings",
    )

    clause: Mapped["Clause | None"] = relationship("Clause")

    def __repr__(self) -> str:
        return (
            f"RiskFinding(id={self.id!r}, "
            f"category={self.category!r}, "
            f"severity={self.severity!r}, "
            f"status={self.status!r})"
        )