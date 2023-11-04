from typing import List, Sequence
from fastapi import APIRouter, Response as FastAPIResponse
from app.models.core import Blog
from app.schemas.core import BlogCreateSchema, BlogUpdateSchema, BlogSchema
from app.api.deps import CurrentSession, CurrentUser

router = APIRouter()
blogs_router = APIRouter()


@router.post("", response_model=BlogSchema)
async def create_blog(
    session: CurrentSession,
    authenticated: CurrentUser,
    blog: BlogCreateSchema,
) -> BlogSchema:
    new_blog = await Blog.create_blog_post(
        session, data=blog, user_id=authenticated.user_id
    )
    return new_blog


@blogs_router.get("", response_model=List[BlogSchema])
async def read_blogs(session: CurrentSession) -> Sequence[Blog]:
    blogs = await Blog.get_all(session)
    return blogs


@router.get("/{blog_id}", response_model=BlogSchema)
async def read_blog(session: CurrentSession, blog_id: int) -> Blog:
    blog = await Blog.get(session, blog_id)
    return blog


@router.put("/{blog_id}", response_model=BlogSchema)
async def update_blog(
    session: CurrentSession,
    authenticated: CurrentUser,
    blog_id: int,
    blog: BlogUpdateSchema,
) -> BlogSchema:
    updated_blog = await Blog.update_blog_post(
        session, blog_id, authenticated.user_id, data=blog
    )
    return updated_blog


@router.delete("/{blog_id}")
async def delete_blog(
    session: CurrentSession, authenticated: CurrentUser, blog_id: int
) -> FastAPIResponse:
    deleted_blog = await Blog.delete(session, blog_id)
    return deleted_blog
