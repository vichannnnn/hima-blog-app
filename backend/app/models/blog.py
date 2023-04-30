from app.db.base_class import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from app.crud.base import CRUD
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.auth import Account


class Blog(Base, CRUD["Blog"]):
    __tablename__ = "blog"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("account.user_id", ondelete="CASCADE"),
        unique=True,
        index=True,
    )
    logo: Mapped[str] = mapped_column(nullable=False)
    favicon: Mapped[str] = mapped_column(nullable=False)
    title_tag: Mapped[str] = mapped_column(nullable=False)
    hero_title: Mapped[str] = mapped_column(nullable=False)
    hero_content: Mapped[str] = mapped_column(nullable=False)

    account: Mapped["Account"] = relationship(back_populates="user_to_blog_fk")
