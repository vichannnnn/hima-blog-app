import os
import boto3
from moto import mock_s3
from jose import JWTError, jwt
from fastapi import Depends
from typing import AsyncGenerator, Generator, Annotated
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import SessionLocal, async_session
from app.schemas.auth import CurrentUserSchema
from app.models.auth import Account
from app.utils.auth import Authenticator, ALGORITHM, SECRET_KEY
from app.utils.exceptions import AppError
from app.utils.file_handler import s3_app_client


def get_db() -> Generator[Session, None, None]:
    with SessionLocal() as session:
        yield session


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session


CurrentSession = Annotated[AsyncSession, Depends(get_session)]


def get_s3_client() -> boto3.Session:
    if os.environ.get("TESTING"):
        with mock_s3():
            s3_client = boto3.client("s3", region_name="us-east-1")
            s3_client.create_bucket(Bucket="test-bucket")
            yield s3_client

    else:
        yield s3_app_client


async def get_current_user(
    session: CurrentSession,
    token: str = Depends(Authenticator.oauth2_scheme),
) -> CurrentUserSchema:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        if username := payload.get("sub"):
            if user := await Account.select_from_username(session, username):
                return CurrentUserSchema(
                    user_id=user.user_id,
                    username=username,
                )

    except JWTError as exc:
        raise AppError.INVALID_CREDENTIALS_ERROR from exc
    raise AppError.INVALID_CREDENTIALS_ERROR


CurrentUser = Annotated[CurrentUserSchema, Depends(get_current_user)]
SessionBucket = Annotated[boto3.Session, Depends(get_s3_client)]
