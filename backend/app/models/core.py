from app.crud.base import CRUD
from app.db.base_class import Base
from app.db.database import AsyncSession
from app.utils.file_handler import save_file
from app.api.deps import SessionBucket
from app.schemas.core import (
    BlogCreateRequestModel,
    BlogUpdateRequestModel,
    BlogResponseModel,
)
from sqlalchemy.orm import synonym, relationship, Mapped, mapped_column
from sqlalchemy import ForeignKey, func, DateTime
from fastapi import HTTPException, UploadFile
from typing import TYPE_CHECKING, Optional
import datetime
import pytz
import uuid

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
        cls,
        session: AsyncSession,
        s3_bucket: SessionBucket,
        data: BlogCreateRequestModel,
        user_id: int,
        image: Optional[UploadFile] = None,
    ) -> BlogResponseModel:
        insert = data.dict()
        insert["user_id"] = user_id
        insert["date_posted"] = datetime.datetime.now(TIMEZONE)

        if image:
            file_name = uuid.uuid4().hex
            await save_file(image, file_name, s3_bucket)
            insert["image"] = file_name

        blog = await super().create(session, insert)
        return blog

    @classmethod
    async def update_blog_post(
        cls,
        session: AsyncSession,
        s3_bucket: SessionBucket,
        data: BlogUpdateRequestModel,
        blog_id: int,
        user_id: int,
        image: Optional[UploadFile] = None,
    ) -> BlogResponseModel:
        existing_blog: Optional[Blog] = await cls.get(session, blog_id)
        if existing_blog is None or existing_blog.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to update this blog post"
            )

        update = data.dict(exclude_none=True)
        update["last_edited_date"] = datetime.datetime.now(TIMEZONE)

        if image:
            file_name = uuid.uuid4().hex
            await save_file(image, file_name, s3_bucket)
            update["image"] = file_name

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
