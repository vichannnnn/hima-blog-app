"""update-title

Revision ID: e225504fbb99
Revises: c3efafd39489
Create Date: 2024-03-11 04:26:34.955337

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e225504fbb99'
down_revision = 'c3efafd39489'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('blogs', sa.Column('slug', sa.String(), nullable=False))
    op.create_index(op.f('ix_blogs_slug'), 'blogs', ['slug'], unique=False)
    op.create_unique_constraint('uq_blogs_title', 'blogs', ['title'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('uq_blogs_title', 'blogs', type_='unique')
    op.drop_index(op.f('ix_blogs_slug'), table_name='blogs')
    op.drop_column('blogs', 'slug')
    # ### end Alembic commands ###