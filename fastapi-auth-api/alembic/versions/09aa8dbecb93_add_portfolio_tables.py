"""add portfolio tables

Revision ID: 09aa8dbecb93
Revises: c38f9715290b
Create Date: 2025-08-31 20:03:49.427948

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '09aa8dbecb93'
down_revision: Union[str, Sequence[str], None] = 'c38f9715290b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
