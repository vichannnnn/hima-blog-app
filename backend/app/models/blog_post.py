from app.db.base_class import Base
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from app.crud.base import CRUD
from typing import TYPE_CHECKING, List
import datetime
from app.models.category import blog_post_categories_association

if TYPE_CHECKING:
    from app.models.category import BlogPostCategory
    from app.models.auth import Account


class BlogPost(Base, CRUD["BlogPost"]):
    __tablename__ = "blog_post"

    post_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("account.user_id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(nullable=False)
    preview: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    image: Mapped[str] = mapped_column(
        nullable=False,
        server_default="default.png",
    )
    date_posted: Mapped[datetime.datetime] = mapped_column(
        nullable=False, server_default=func.now(), index=True
    )
    last_edited_date: Mapped[datetime.datetime] = mapped_column(
        nullable=True, index=True
    )
    last_edited_content: Mapped[str] = mapped_column(nullable=True)

    account: Mapped["Account"] = relationship(back_populates="user_to_blog_posts_fk")

    categories: Mapped[List["BlogPostCategory"]] = relationship(
        "BlogPostCategory",
        secondary=blog_post_categories_association,
        back_populates="blog_posts",
    )
