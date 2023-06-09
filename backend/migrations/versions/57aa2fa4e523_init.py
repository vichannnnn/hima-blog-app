"""init

Revision ID: 57aa2fa4e523
Revises: 
Create Date: 2023-04-30 05:28:37.195322

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "57aa2fa4e523"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "account",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(), nullable=False),
        sa.Column("password", sa.String(), nullable=False),
        sa.Column(
            "user_type", sa.Integer(), server_default=sa.text("1"), nullable=False
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("user_id"),
        sa.UniqueConstraint("username"),
    )
    op.create_index(op.f("ix_account_user_id"), "account", ["user_id"], unique=False)
    op.create_index(
        "username_case_sensitive_index",
        "account",
        [sa.text("upper(username)")],
        unique=True,
    )
    op.create_table(
        "blog",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("logo", sa.String(), nullable=False),
        sa.Column("title_tag", sa.String(), nullable=False),
        sa.Column("hero_title", sa.String(), nullable=False),
        sa.Column("hero_content", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["account.user_id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_blog_id"), "blog", ["id"], unique=False)
    op.create_index(op.f("ix_blog_user_id"), "blog", ["user_id"], unique=True)
    op.create_table(
        "blog_post",
        sa.Column("post_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("preview", sa.String(), nullable=False),
        sa.Column("content", sa.String(), nullable=False),
        sa.Column("image", sa.String(), server_default="default.png", nullable=False),
        sa.Column(
            "date_posted",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("last_edited_date", sa.DateTime(), nullable=True),
        sa.Column("last_edited_content", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["account.user_id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("post_id"),
    )
    op.create_index(
        op.f("ix_blog_post_date_posted"), "blog_post", ["date_posted"], unique=False
    )
    op.create_index(
        op.f("ix_blog_post_last_edited_date"),
        "blog_post",
        ["last_edited_date"],
        unique=False,
    )
    op.create_index(
        op.f("ix_blog_post_post_id"), "blog_post", ["post_id"], unique=False
    )
    op.create_index(
        op.f("ix_blog_post_user_id"), "blog_post", ["user_id"], unique=False
    )
    op.create_table(
        "blog_post_category",
        sa.Column("category_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("category_name", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["account.user_id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("category_id"),
        sa.UniqueConstraint("user_id", "category_name", name="_user_category_uc"),
    )
    op.create_index(
        op.f("ix_blog_post_category_category_id"),
        "blog_post_category",
        ["category_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_blog_post_category_user_id"),
        "blog_post_category",
        ["user_id"],
        unique=False,
    )
    op.create_table(
        "blog_post_categories",
        sa.Column("association_id", sa.Integer(), nullable=False),
        sa.Column("post_id", sa.Integer(), nullable=True),
        sa.Column("category_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["category_id"], ["blog_post_category.category_id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(["post_id"], ["blog_post.post_id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("association_id"),
        sa.UniqueConstraint(
            "post_id", "category_id", name="uq_blog_post_categories_post_id_category_id"
        ),
    )
    op.create_index(
        op.f("ix_blog_post_categories_association_id"),
        "blog_post_categories",
        ["association_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_blog_post_categories_category_id"),
        "blog_post_categories",
        ["category_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_blog_post_categories_post_id"),
        "blog_post_categories",
        ["post_id"],
        unique=False,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(
        op.f("ix_blog_post_categories_post_id"), table_name="blog_post_categories"
    )
    op.drop_index(
        op.f("ix_blog_post_categories_category_id"), table_name="blog_post_categories"
    )
    op.drop_index(
        op.f("ix_blog_post_categories_association_id"),
        table_name="blog_post_categories",
    )
    op.drop_table("blog_post_categories")
    op.drop_index(
        op.f("ix_blog_post_category_user_id"), table_name="blog_post_category"
    )
    op.drop_index(
        op.f("ix_blog_post_category_category_id"), table_name="blog_post_category"
    )
    op.drop_table("blog_post_category")
    op.drop_index(op.f("ix_blog_post_user_id"), table_name="blog_post")
    op.drop_index(op.f("ix_blog_post_post_id"), table_name="blog_post")
    op.drop_index(op.f("ix_blog_post_last_edited_date"), table_name="blog_post")
    op.drop_index(op.f("ix_blog_post_date_posted"), table_name="blog_post")
    op.drop_table("blog_post")
    op.drop_index(op.f("ix_blog_user_id"), table_name="blog")
    op.drop_index(op.f("ix_blog_id"), table_name="blog")
    op.drop_table("blog")
    op.drop_index("username_case_sensitive_index", table_name="account")
    op.drop_index(op.f("ix_account_user_id"), table_name="account")
    op.drop_table("account")
    # ### end Alembic commands ###
