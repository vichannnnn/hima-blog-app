from app.crud.base import CRUD
from app.db.base_class import Base
from app.db.database import AsyncSession
from app.utils.file_handler import save_file
from app.schemas.core import (
    BlogCreateRequestModel,
    BlogUpdateRequestModel,
    BlogResponseModel,
)
from sqlalchemy.orm import synonym, relationship, Mapped, mapped_column
from sqlalchemy import ForeignKey, func, DateTime, select
from fastapi import HTTPException, UploadFile
from typing import TYPE_CHECKING, Optional
import datetime
import pytz
import uuid
import boto3
import re

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
    title: Mapped[str] = mapped_column(unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(nullable=False, index=True
    )
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
        DateTime(timezone=True), nullable=True, index=True, server_default=func.now(),
        onupdate=func.now()
    )
    category: Mapped[str] = mapped_column(nullable=True)

    account: Mapped["Account"] = relationship(back_populates="user_to_blog_posts_fk")
    id: Mapped[int] = synonym("blog_id")

    @staticmethod
    def generate_slug(title: str) -> str:
        # Example slug generation logic
        slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title).strip().lower()
        slug = re.sub(r'[\s-]+', '-', slug)
        return slug

    @classmethod
    async def create_blog_post(
        cls,
        session: AsyncSession,
        s3_bucket: boto3.client,
        data: BlogCreateRequestModel,
        user_id: int,
        image: Optional[UploadFile] = None,
    ) -> BlogResponseModel:
        insert = data.dict()
        insert["slug"] = cls.generate_slug(insert["title"])
        insert["user_id"] = user_id
        insert["date_posted"] = datetime.datetime.now(TIMEZONE)

        if image:
            file_name = uuid.uuid4().hex + ".png"
            await save_file(image, file_name, s3_bucket)
            insert["image"] = file_name

        blog = await super().create(session, insert)
        return blog

    @classmethod
    async def update_blog_post(
        cls,
        session: AsyncSession,
        s3_bucket: boto3.client,
        data: BlogUpdateRequestModel,
        slug: str,
        user_id: int,
        image: Optional[UploadFile] = None,
    ) -> BlogResponseModel:
        existing_blog: Optional[Blog] = await cls.get(session, slug)
        if existing_blog is None or existing_blog.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to update this blog post"
            )

        update = data.dict(exclude_none=True)

        if "title" in update:
            update["slug"] = cls.generate_slug(update["title"])

        if image:
            file_name = uuid.uuid4().hex + ".png"
            await save_file(image, file_name, s3_bucket)
            update["image"] = file_name

        updated_blog = await super().update(session, slug, data=update)
        return updated_blog

    @classmethod
    async def delete_blog_post(
        cls, session: AsyncSession, slug: str, user_id: int
    ) -> None:
        existing_blog: Optional[Blog] = await cls.get(session, slug)
        if existing_blog is None or existing_blog.user_id != user_id:
            raise HTTPException(
                status_code=403, detail="Not authorized to delete this blog post"
            )
        await super().delete(session, slug)

    @classmethod
    async def get_all_blog_posts(
        cls,
        session: AsyncSession,
        page: int,
        size: int,
        sorted_by_date_posted: Optional[str] = "desc",
    ):
        stmt = select(cls)

        if sorted_by_date_posted == "asc":
            stmt = stmt.order_by(cls.date_posted.asc())
        else:
            stmt = stmt.order_by(cls.date_posted.desc())

        count_stmt = select(func.count()).select_from(stmt)  # pylint: disable=E1102
        total = await session.scalar(count_stmt)

        stmt = stmt.limit(size).offset((page - 1) * size)

        result = await session.execute(stmt)
        pages = total // size if total % size == 0 else (total // size) + 1
        return {
            "items": result.scalars().all(),
            "page": page,
            "pages": pages,
            "size": size,
            "total": total,
        }
