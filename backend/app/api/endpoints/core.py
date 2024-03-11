from typing import Sequence, Optional
from fastapi import APIRouter, Response as FastAPIResponse, UploadFile, Depends, Query
from fastapi_pagination import Page
from app.models.core import Blog
from app.schemas.core import (
    BlogCreateRequestModel,
    BlogUpdateRequestModel,
    BlogResponseModel,
)
from app.api.deps import CurrentSession, CurrentUser, SessionBucket

router = APIRouter()
blogs_router = APIRouter()


@router.post("", response_model=BlogResponseModel)
async def create_blog(
    session: CurrentSession,
    s3_bucket: SessionBucket,
    authenticated: CurrentUser,
    blog: BlogCreateRequestModel = Depends(),
    image: Optional[UploadFile] = None,
) -> BlogResponseModel:
    new_blog = await Blog.create_blog_post(
        session,
        s3_bucket=s3_bucket,
        data=blog,
        user_id=authenticated.user_id,
        image=image,
    )
    return new_blog


@router.put("/{slug}", response_model=BlogResponseModel)
async def update_blog(
    session: CurrentSession,
    s3_bucket: SessionBucket,
    authenticated: CurrentUser,
    slug: str,
    blog: BlogUpdateRequestModel = Depends(),
    image: Optional[UploadFile] = None,
) -> BlogResponseModel:
    updated_blog = await Blog.update_blog_post(
        session,
        s3_bucket=s3_bucket,
        data=blog,
        slug=slug,
        user_id=authenticated.user_id,
        image=image,
    )
    return updated_blog


@blogs_router.get("", response_model=Page[BlogResponseModel])
async def read_blogs(
    session: CurrentSession,
    page: int = Query(1, title="Page number", gt=0),
    size: int = Query(21, title="Page size", gt=0, le=50),
    sorted_by_date_posted: Optional[str] = "desc",
) -> Sequence[Blog]:
    blogs = await Blog.get_all_blog_posts(
        session, page=page, size=size, sorted_by_date_posted=sorted_by_date_posted
    )
    return blogs


@router.get("/{slug}", response_model=BlogResponseModel)
async def read_blog(session: CurrentSession, slug: str) -> Blog:
    blog = await Blog.get(session, slug)
    return blog


@router.delete("/{slug}")
async def delete_blog(
    session: CurrentSession, authenticated: CurrentUser, slug: str
) -> FastAPIResponse:
    deleted_blog = await Blog.delete(session, slug)
    return deleted_blog
