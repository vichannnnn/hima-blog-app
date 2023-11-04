from app.crud.base import CRUD
from app.db.base_class import Base
from app.schemas.core import BlogCreateSchema, BlogUpdateSchema, BlogSchema
from sqlalchemy.orm import synonym, relationship, Mapped, mapped_column
from app.db.database import AsyncSession
from sqlalchemy import ForeignKey, func, DateTime
from typing import TYPE_CHECKING, Optional
import datetime
from fastapi import HTTPException
import pytz

if TYPE_CHECKING:
    from app.models.auth import Account

TIMEZONE = pytz.timezone("Asia/Shanghai")


class Blog(Base, CRUD["Blog"]):
    __tablename__: str = "blogs"  # type: ignore

    blog_id: Mapped[int] = mapped_column(
        primary_key=True, index=True, autoincrement=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("account.user_id", ondelete="CASCADE"),
    )
    title: Mapped[str] = mapped_column(nullable=False)
    preview: Mapped[str] = mapped_column(nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)
    image: Mapped[str] = mapped_column(
        nullable=False,
        server_default="default.png",
    )
    date_posted: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now(), index=True
    )
    last_edited_date: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    category: Mapped[str] = mapped_column(nullable=True)

    account: Mapped["Account"] = relationship(back_populates="user_to_blog_posts_fk")
    id: Mapped[int] = synonym("blog_id")

    @classmethod
    async def create_blog_post(
        cls, session: AsyncSession, data: BlogCreateSchema, user_id: int
    ) -> BlogSchema:
        insert = data.dict()
        insert["user_id"] = user_id
        insert["date_posted"] = datetime.datetime.now(TIMEZONE)

        # TODO: Update preview with truncated preview, or just let frontend handle it.
        insert["preview"] = data.content
        blog = await super().create(session, insert)
        return blog

    @classmethod
    async def update_blog_post(
        cls, session: AsyncSession, blog_id: int, user_id: int, data: BlogUpdateSchema
    ) -> BlogSchema:
        existing_blog: Optional[Blog] = await cls.get(session, blog_id)
        if existing_blog is None or existing_blog.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to update this blog post"
            )

        update = data.dict(exclude_unset=True)
        update["last_edited_date"] = datetime.datetime.now(TIMEZONE)
        update["preview"] = data.content
        updated_blog = await super().update(session, blog_id, data=update)
        return updated_blog

    @classmethod
    async def delete_blog_post(
        cls, session: AsyncSession, blog_id: int, user_id: int
    ) -> None:
        existing_blog: Optional[Blog] = await cls.get(session, blog_id)
        if existing_blog is None or existing_blog.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to delete this blog post"
            )
        await super().delete(session, blog_id)
