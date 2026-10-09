import uuid
from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class User(Base):
    """Represents a user account belonging to an organization."""

    __tablename__ = "users"

    __table_args__ = (
        UniqueConstraint(
            "email",
            name="uq_users_email",
        ),
        CheckConstraint(
            "role IN ("
            "'SUPER_ADMIN', "
            "'ORG_ADMIN', "
            "'LEGAL_REVIEWER', "
            "'COMPLIANCE_OFFICER', "
            "'EMPLOYEE'"
            ")",
            name="ck_users_role",
        ),
        CheckConstraint(
            "status IN ("
            "'ACTIVE', "
            "'INVITED', "
            "'SUSPENDED', "
            "'DEACTIVATED'"
            ")",
            name="ck_users_status",
        ),
        CheckConstraint(
            "email = lower(btrim(email))",
            name="ck_users_email_normalized",
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    organization_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "organizations.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    role: Mapped[str] = mapped_column(
        String(40),
        nullable=False,
        default="EMPLOYEE",
        server_default=text("'EMPLOYEE'"),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="INVITED",
        server_default=text("'INVITED'"),
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
        back_populates="users",
    )

    def __repr__(self) -> str:
        return (
            f"User(id={self.id!r}, "
            f"email={self.email!r}, "
            f"organization_id={self.organization_id!r}, "
            f"role={self.role!r}, "
            f"status={self.status!r})"
        )
