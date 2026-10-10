import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.contract_version import ContractVersion


class DocumentChunk(Base):
    """A searchable text chunk extracted from a contract version."""

    __tablename__ = "document_chunks"

    __table_args__ = (
        UniqueConstraint(
            "contract_version_id",
            "chunk_index",
            name="uq_document_chunks_version_index",
        ),
        CheckConstraint(
            "chunk_index >= 0",
            name="ck_document_chunks_chunk_index",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_start >= 1",
            name="ck_document_chunks_page_start",
        ),
        CheckConstraint(
            "page_end IS NULL OR page_end >= 1",
            name="ck_document_chunks_page_end",
        ),
        CheckConstraint(
            "page_start IS NULL OR page_end IS NULL OR page_end >= page_start",
            name="ck_document_chunks_page_range",
        ),
        CheckConstraint(
            "token_count IS NULL OR token_count >= 0",
            name="ck_document_chunks_token_count",
        ),
        Index(
            "ix_document_chunks_embedding_hnsw",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
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

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
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

    token_count: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(384),
        nullable=True,
    )

    embedding_model: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    contract_version: Mapped["ContractVersion"] = relationship(
        "ContractVersion",
        back_populates="document_chunks",
    )

    def __repr__(self) -> str:
        return (
            f"DocumentChunk(id={self.id!r}, "
            f"contract_version_id={self.contract_version_id!r}, "
            f"chunk_index={self.chunk_index!r})"
        )