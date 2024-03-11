"""update-edit-date

Revision ID: 8a38f33dc799
Revises: e225504fbb99
Create Date: 2024-03-11 04:33:40.759163

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = '8a38f33dc799'
down_revision = 'e225504fbb99'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('blogs', 'last_edited_date',
                    existing_type=sa.DateTime(timezone=True),
                    server_default=func.now(),
                    onupdate=func.now(),
                    nullable=True)

    # Use the 'existing_server_default' to inform Alembic about the previous state
    op.alter_column('blogs', 'last_edited_date',
                    existing_type=sa.DateTime(timezone=True),
                    existing_server_default=None,
                    existing_nullable=True)


def downgrade():
    # Commands to revert the changes made in upgrade()
    op.alter_column('blogs', 'last_edited_date',
                    existing_type=sa.DateTime(timezone=True),
                    onupdate=None,
                    server_default=None,
                    nullable=True)
