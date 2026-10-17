"""add document chunk full text search

Revision ID: ca063d7ee416
Revises: 1904a56327e1
Create Date: 2026-10-17 15:18:13.136346

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'ca063d7ee416'
down_revision: Union[str, None] = '1904a56327e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE INDEX ix_document_chunks_content_fts
        ON document_chunks
        USING GIN (
            to_tsvector(
                'english',
                content
            )
        )
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP INDEX IF EXISTS ix_document_chunks_content_fts
        """
    )