from app.api.deps import get_session
from app.exceptions import AppError
from app.schemas.auth import (
    AuthSchema,
    CurrentUserSchema,
    AccountRegisterSchema,
    AccountUpdatePasswordSchema,
)
from app.schemas.blog import BlogCreateSchema
from app.models.auth import Account, Authenticator, ALGORITHM, SECRET_KEY
from app.models.blog import Blog
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
import os

router = APIRouter()
PRODUCTION = os.getenv("PRODUCTION")

if PRODUCTION == "false":
    @router.post("/create", response_model=CurrentUserSchema)
    async def create_account(
            data: AccountRegisterSchema,
            session: AsyncSession = Depends(get_session),
    ):
        if data.password != data.repeat_password:
            raise AppError.PASSWORD_MISMATCH_ERROR

        created_user = await Account().register(session, data)

        data = {
            "user_id": created_user.user_id,
            "logo": created_user.username,
            "title_tag": f"{created_user.username}'s Blog",
            "hero_title": f"Welcome to {created_user.username}'s Blog",
            "hero_content": "Update your blog's content here in the Admin Panel on the top-right corner!",
        }

        BlogCreateSchema(**data)
        await Blog.create(session, data)
        return created_user


@router.post("/update_password")
async def user_update_password(
    data: AccountUpdatePasswordSchema,
    session: AsyncSession = Depends(get_session),
    authenticated: Account = Depends(Authenticator.get_current_user),
):
    credentials = await Account.update_password(session, authenticated.user_id, data)
    return credentials


@router.get("/get", response_model=CurrentUserSchema)
async def get_account_name(
    user: AuthSchema = Depends(Authenticator.get_current_user),
):
    return user


@router.post("/login")
async def user_login(
    data: AuthSchema,
    session: AsyncSession = Depends(get_session),
):
    credentials = await Account.login(session, data.username, data.password)

    if not credentials:
        raise AppError.INVALID_CREDENTIALS_ERROR

    access_token = Authenticator.create_access_token(data={"sub": data.username})
    decoded_token = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    return {
        "data": credentials,
        "access_token": access_token,
        "token_type": "bearer",
        "exp": decoded_token["exp"],
    }
