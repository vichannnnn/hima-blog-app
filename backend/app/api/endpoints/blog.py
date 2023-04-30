from fastapi import APIRouter, Depends
from app.api.deps import get_session
from app.schemas.blog import BlogCreateSchema, BlogUpdateSchema, BlogSchema
from app.models.blog import Blog
from app.models.auth import Account, Authenticator
from sqlalchemy.ext.asyncio import AsyncSession
from app.exceptions import AppError
from sqlalchemy import exc as SQLAlchemyExceptions

router = APIRouter()


@router.post("", response_model=BlogSchema)
async def create_user_blog(
    data: BlogCreateSchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    try:
        res = await Blog.create(session, data=data_json)
        return res

    except SQLAlchemyExceptions.IntegrityError:
        await session.rollback()
        raise AppError.USER_BLOG_ALREADY_EXISTS_ERROR


@router.get("", response_model=BlogSchema)
async def get_user_blog(
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    res = await Blog.get_one(session)

    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res


@router.put("", response_model=BlogSchema)
async def update_user_blog(
    data: BlogUpdateSchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    data_dict = data.dict()

    res = await Blog.update_one_by_filter(
        session, data_dict, filter_conditions=[("user_id", authenticated.user_id)]
    )
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]


@router.delete("", response_model=BlogSchema)
async def delete_user_blog(
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BlogSchema:
    res = await Blog.delete_one_by_filter(session, [("user_id", authenticated.user_id)])
    if not res:
        raise AppError.USER_BLOG_DOES_NOT_EXISTS_ERROR
    return res[0]
