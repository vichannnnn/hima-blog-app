from fastapi import APIRouter, Depends, File, UploadFile
from app.api.deps import get_session
from app.schemas.blog_post import (
    BlogPostCreateSchema,
    BlogPostUpdateSchema,
    BlogPostSchema,
)
from app.models.blog_post import BlogPost
from app.models.auth import Account, Authenticator

from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.exceptions import AppError
from app.image_handler import save_file
from starlette.datastructures import UploadFile as StarletteUploadFile


router = APIRouter()


@router.post("/create", response_model=BlogPostSchema)
async def create_user_blog_post(
    data: BlogPostCreateSchema = Depends(),
    image: UploadFile = File(None),
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    if isinstance(image, StarletteUploadFile):
        folder = "images"
        await save_file(image, folder)
        data_json["image"] = image.filename

    res = await BlogPost.create(session, data=data_json)
    return res


@router.get("/get", response_model=BlogPostSchema)
async def get_user_blog_posts(
    post_id: int,
    session: AsyncSession = Depends(get_session),
):
    res = await BlogPost.get_one_by_filter(session, [("post_id", post_id)])
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res


@router.get("/get_all", response_model=List[BlogPostSchema])
async def get_all_user_blog_posts(
    subdomain: str = None,
    user_id: int = None,
    session: AsyncSession = Depends(get_session),
):
    if not subdomain and not user_id:
        raise AppError.INVALID_ARGUMENT_ERROR

    if subdomain:
        res = await BlogPost.get_all_by_filter(
            session,
            join_table=Account,
            join_filter_conditions=[("subdomain", subdomain)],
        )
    else:
        res = await BlogPost.get_all_by_filter(
            session, filter_conditions=[("user_id", user_id)]
        )
    if not res:
        return []
    return res


@router.put("/update", response_model=BlogPostSchema)
async def update_user_blog_post(
    post_id: int,
    data: BlogPostUpdateSchema = Depends(),
    image: Optional[UploadFile] = File(None),
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):

    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    if isinstance(image, StarletteUploadFile):
        folder = "images"
        await save_file(image, folder)
        data_json["image"] = image.filename

    res = await BlogPost.update_one_by_filter(
        session,
        data_json,
        filter_conditions=[("post_id", post_id), ("user_id", authenticated.user_id)],
    )

    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]


@router.delete("/delete", response_model=BlogPostSchema)
async def delete_user_blog_post(
    post_id: int,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    res = await BlogPost.delete_one_by_filter(
        session, [("user_id", authenticated.user_id), ("post_id", post_id)]
    )
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]
