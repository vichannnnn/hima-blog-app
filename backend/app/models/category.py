from app.db.base_class import Base
from app.crud.base import CRUD
from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, Table
from sqlalchemy.orm import Mapped, relationship
from typing import TYPE_CHECKING, List

if TYPE_CHECKING:
    from app.models.auth import Account
    from app.models.blog_post import BlogPost


blog_post_categories_association = Table(
    "blog_post_categories",
    Base.metadata,
    Column("association_id", Integer, primary_key=True, index=True),
    Column(
        "post_id",
        Integer,
        ForeignKey("blog_post.post_id", ondelete="CASCADE"),
        index=True,
    ),
    Column(
        "category_id",
        Integer,
        ForeignKey("blog_post_category.category_id", ondelete="CASCADE"),
        index=True,
    ),
)


class BlogPostCategoryAssociation(Base, CRUD["BlogPostCategoryAssociation"]):
    __tablename__ = "blog_post_categories"
    __table_args__ = (
        UniqueConstraint(
            "post_id", "category_id", name="uq_blog_post_categories_post_id_category_id"
        ),
        {"extend_existing": True},
    )

    association_id = Column(Integer, primary_key=True, index=True)
    post_id = Column(
        Integer, ForeignKey("blog_post.post_id", ondelete="CASCADE"), index=True
    )
    category_id = Column(
        Integer,
        ForeignKey("blog_post_category.category_id", ondelete="CASCADE"),
        index=True,
    )


class BlogPostCategory(Base, CRUD["BlogPostCategory"]):
    __tablename__ = "blog_post_category"
    __table_args__ = (
        UniqueConstraint("user_id", "category_name", name="_user_category_uc"),
    )

    category_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("account.user_id", ondelete="CASCADE"), index=True
    )
    category_name = Column(String, nullable=False)

    account: Mapped["Account"] = relationship(
        back_populates="user_to_blog_post_categories_fk"
    )

    blog_posts: Mapped[List["BlogPost"]] = relationship(
        secondary=blog_post_categories_association, back_populates="categories"
    )
