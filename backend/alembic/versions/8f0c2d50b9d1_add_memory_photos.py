"""add memory photos

Revision ID: 8f0c2d50b9d1
Revises: c28e41cad3b0
Create Date: 2026-09-04 02:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8f0c2d50b9d1"
down_revision: Union[str, None] = "c28e41cad3b0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("drops", sa.Column("memory_photo_url_1", sa.String(length=500), nullable=True))
    op.add_column("drops", sa.Column("memory_photo_url_2", sa.String(length=500), nullable=True))
    op.add_column("drops", sa.Column("memory_photo_url_3", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("drops", "memory_photo_url_3")
    op.drop_column("drops", "memory_photo_url_2")
    op.drop_column("drops", "memory_photo_url_1")
