from fastapi import APIRouter, Depends
from app.api.deps import get_session
from app.schemas.category import (
    CategoryCreateSchema,
    CategoryUpdateSchema,
    CategorySchema,
    UpdateBlogPostCategorySchema,
    BlogPostCategorySchema,
)
from app.models.category import (
    BlogPostCategory,
    BlogPostCategoryAssociation,
)
from app.schemas.blog_post import BlogPostSchema
from app.models.blog_post import BlogPost
from app.models.auth import Account, Authenticator
from app.exceptions import AppError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc as SQLAlchemyExceptions
from sqlalchemy import and_, select
from sqlalchemy.orm import selectinload
from typing import List

router = APIRouter()


@router.post("/create", response_model=CategorySchema)
async def create_user_category(
    data: CategoryCreateSchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    try:
        res = await BlogPostCategory.create(session, data=data_json)

    except SQLAlchemyExceptions.IntegrityError:
        raise AppError.CATEGORY_NAME_ALREADY_EXISTS_ERROR
    return res


@router.get("/get_all", response_model=List[CategorySchema])
async def get_all_user_blog_post_categories(
    user_id: int,
    session: AsyncSession = Depends(get_session),
):
    res = await BlogPostCategory.get_all_by_filter(
        session, filter_conditions=[("user_id", user_id)]
    )

    if not res:
        return []
    return res


@router.put("/update", response_model=CategorySchema)
async def update_user_blog_post(
    category_id: int,
    data: CategoryUpdateSchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    data_json = data.dict()
    data_json["user_id"] = authenticated.user_id

    res = await BlogPostCategory.update_one_by_filter(
        session,
        data_json,
        filter_conditions=[
            ("category_id", category_id),
            ("user_id", authenticated.user_id),
        ],
    )

    if not res:
        raise AppError.USER_BLOG_CATEGORY_DOES_NOT_EXISTS_ERROR
    return res[0]


@router.post("/tag_blog_post_with_category", response_model=BlogPostCategorySchema)
async def tag_user_blog_post_category(
    data: UpdateBlogPostCategorySchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    join_condition = BlogPost.user_id == BlogPostCategory.user_id

    filter_conditions = and_(
        BlogPost.post_id == data.post_id,
        BlogPost.user_id == authenticated.user_id,
        BlogPostCategory.category_id == data.category_id,
    )

    stmt = (
        select(BlogPost, BlogPostCategory)
        .select_from(BlogPost)
        .join(BlogPostCategory, join_condition)
        .where(filter_conditions)
        .options(selectinload(BlogPost.categories))
    )

    result = await session.execute(stmt)

    try:
        blog_post, category = result.one_or_none()

    except TypeError:
        raise AppError.USER_BLOG_CATEGORY_ASSOCIATION_DOES_NOT_EXISTS_ERROR

    try:
        res = await BlogPostCategoryAssociation.create(session, data.dict())

    except SQLAlchemyExceptions.IntegrityError:
        raise AppError.USER_BLOG_POST_CATEGORY_ASSOCIATION_ALREADY_EXISTS_ERROR

    response = BlogPostCategorySchema(
        association_id=res.association_id,
        blog_post=BlogPostSchema.from_orm(blog_post),
        category=CategorySchema.from_orm(category),
    )

    return response


@router.post("/remove_category_from_blog_post", response_model=BlogPostCategorySchema)
async def remove_category_from_user_blog_post(
    data: UpdateBlogPostCategorySchema,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    join_condition = BlogPost.user_id == BlogPostCategory.user_id

    filter_conditions = and_(
        BlogPost.post_id == data.post_id,
        BlogPost.user_id == authenticated.user_id,
        BlogPostCategory.category_id == data.category_id,
    )

    stmt = (
        select(BlogPost, BlogPostCategory)
        .select_from(BlogPost)
        .join(BlogPostCategory, join_condition)
        .where(filter_conditions)
        .options(selectinload(BlogPost.categories))
    )

    result = await session.execute(stmt)

    try:
        blog_post, category = result.one_or_none()

    except TypeError:
        raise AppError.USER_BLOG_CATEGORY_DOES_NOT_EXISTS_ERROR

    res = await BlogPostCategoryAssociation.delete_one_by_filter(
        session,
        filter_conditions=[
            ("post_id", data.post_id),
            ("category_id", data.category_id),
        ],
    )

    if not res:
        raise AppError.USER_BLOG_CATEGORY_ASSOCIATION_DOES_NOT_EXISTS_ERROR

    response = BlogPostCategorySchema(
        blog_post=BlogPostSchema.from_orm(blog_post),
        category=CategorySchema.from_orm(category),
    )

    return response


@router.delete("/delete", response_model=CategorySchema)
async def delete_user_blog_post(
    category_id: int,
    authenticated: Account = Depends(Authenticator.get_current_user),
    session: AsyncSession = Depends(get_session),
):
    res = await BlogPostCategory.delete_one_by_filter(
        session, [("user_id", authenticated.user_id), ("category_id", category_id)]
    )
    if not res:
        raise AppError.USER_BLOG_CATEGORY_DOES_NOT_EXISTS_ERROR
    return res[0]
