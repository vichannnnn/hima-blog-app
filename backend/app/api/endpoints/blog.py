from fastapi import APIRouter, Depends
from app.api.deps import get_session
from app.schemas.blog import BlogCreateSchema, BlogUpdateSchema, BlogSchema
from app.models.blog import Blog
from app.models.auth import Account, Authenticator

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import File, UploadFile
from typing import Optional
from app.exceptions import AppError
from sqlalchemy import exc as SQLAlchemyExceptions
from app.image_handler import save_file
from starlette.datastructures import UploadFile as StarletteUploadFile

router = APIRouter()


@router.post("/create", response_model=BlogSchema)
async def create_user_blog(
    data: BlogCreateSchema = Depends(),
    favicon: UploadFile = File(None),
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    if isinstance(favicon, StarletteUploadFile):
        folder = "images"
        await save_file(favicon, folder)
        data_json["image"] = favicon.filename

    try:
        res = await Blog.create(session, data=data_json)
        return res

    except SQLAlchemyExceptions.IntegrityError:
        await session.rollback()
        raise AppError.USER_BLOG_ALREADY_EXISTS_ERROR


@router.get("/get_from_id", response_model=BlogSchema)
async def get_user_blog_by_id(
    user_id: int,
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    res = await Blog.get_one_by_filter(session, [("user_id", user_id)])
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res


@router.get("/get_from_subdomain", response_model=BlogSchema)
async def get_user_blog_by_subdomain(
    subdomain: str,
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    res = await Blog.get_one_by_filter(
        session, join_table=Account, join_filter_conditions=[("subdomain", subdomain)]
    )
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res


@router.put("/update", response_model=BlogSchema)
async def update_user_blog(
    data: BlogUpdateSchema = Depends(),
    favicon: Optional[UploadFile] = File(None),
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    data_dict = data.dict()

    if isinstance(favicon, StarletteUploadFile):
        folder = "images"
        await save_file(favicon, folder)
        data_dict["favicon"] = favicon.filename

    res = await Blog.update_one_by_filter(
        session, data_dict, filter_conditions=[("user_id", authenticated.user_id)]
    )
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]


@router.delete("/delete", response_model=BlogSchema)
async def delete_user_blog(
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    res = await Blog.delete_one_by_filter(session, [("user_id", authenticated.user_id)])
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]
