from typing import List, Sequence, Optional
from fastapi import APIRouter, Response as FastAPIResponse, UploadFile, Depends, File
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


@router.put("/{blog_id}", response_model=BlogResponseModel)
async def update_blog(
    session: CurrentSession,
    s3_bucket: SessionBucket,
    authenticated: CurrentUser,
    blog_id: int,
    blog: BlogUpdateRequestModel = Depends(),
    image: Optional[UploadFile] = None,
) -> BlogResponseModel:
    updated_blog = await Blog.update_blog_post(
        session,
        s3_bucket=s3_bucket,
        data=blog,
        blog_id=blog_id,
        user_id=authenticated.user_id,
        image=image,
    )
    return updated_blog


@blogs_router.get("", response_model=List[BlogResponseModel])
async def read_blogs(session: CurrentSession) -> Sequence[Blog]:
    blogs = await Blog.get_all(session)
    return blogs


@router.get("/{blog_id}", response_model=BlogResponseModel)
async def read_blog(session: CurrentSession, blog_id: int) -> Blog:
    blog = await Blog.get(session, blog_id)
    return blog


@router.delete("/{blog_id}")
async def delete_blog(
    session: CurrentSession, authenticated: CurrentUser, blog_id: int
) -> FastAPIResponse:
    deleted_blog = await Blog.delete(session, blog_id)
    return deleted_blog
