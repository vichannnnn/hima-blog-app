from app.db.base_class import Base
from app.exceptions import AppError
from app.schemas.auth import (
    AccountRegisterSchema,
    AccountUpdateSubdomainSchema,
    AccountUpdateEmailSchema,
    AccountUpdatePasswordSchema,
    CurrentUserSchema,
    RoleEnum,
)
from sqlalchemy import Index, UniqueConstraint
from sqlalchemy import exc as SQLAlchemyExceptions
from sqlalchemy import select, update
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql.expression import text
from typing import TYPE_CHECKING, Union, List
from uuid import uuid4
from app.email_handler import send_email
from pydantic import EmailStr
import re
from app.crud.base import CRUD
from datetime import datetime, timedelta
from os import environ
from app.api.deps import get_session
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession


if TYPE_CHECKING:
    from app.models.blog import Blog, BlogPost
    from app.models.category import BlogPostCategory

ACCESS_TOKEN_EXPIRE_MINUTES = int(environ["ACCESS_TOKEN_EXPIRE_MINUTES"])
ALGORITHM = environ["ALGORITHM"]
SECRET_KEY = environ["SECRET_KEY"]
BACKEND_URL = environ["BACKEND_URL"]


class Authenticator:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

    @classmethod
    def create_access_token(cls, data: dict):
        expiry = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        expiry_timestamp = int(expiry.timestamp())
        return jwt.encode(
            {**data, "exp": expiry_timestamp}, SECRET_KEY, algorithm=ALGORITHM
        )

    @classmethod
    async def check_normal_user(
        cls,
        token: str = Depends(oauth2_scheme),
        session: AsyncSession = Depends(get_session),
    ) -> CurrentUserSchema:
        return await Authenticator.check_user_role(RoleEnum.USER, token, session)

    @classmethod
    async def check_premium_user(
        cls,
        token: str = Depends(oauth2_scheme),
        session: AsyncSession = Depends(get_session),
    ) -> CurrentUserSchema:
        return await Authenticator.check_user_role(
            RoleEnum.PREMIUM_USER, token, session
        )

    @classmethod
    async def check_developer(
        cls,
        token: str = Depends(oauth2_scheme),
        session: AsyncSession = Depends(get_session),
    ) -> CurrentUserSchema:
        return await Authenticator.check_user_role(RoleEnum.DEVELOPER, token, session)

    @classmethod
    async def check_user_role(
        cls,
        min_role: RoleEnum,
        token: str = Depends(oauth2_scheme),
        session: AsyncSession = Depends(get_session),
    ) -> CurrentUserSchema:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
            if username := payload.get("sub"):
                if user := await Account.select_from_username(session, username):
                    if user.user_type >= min_role:
                        return CurrentUserSchema(
                            user_id=user.user_id,
                            username=username,
                            subdomain=user.subdomain,
                            is_active=user.is_active,
                            email=user.email,
                            user_type=user.user_type,
                        )

        except JWTError as exc:
            raise AppError.INVALID_CREDENTIALS_ERROR from exc

        raise AppError.INSUFFICIENT_PERMISSION_ERROR

    @classmethod
    async def get_current_user(
        cls,
        token: str = Depends(oauth2_scheme),
        session: AsyncSession = Depends(get_session),
    ) -> CurrentUserSchema:
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
            if username := payload.get("sub"):
                if user := await Account.select_from_username(session, username):
                    return CurrentUserSchema(
                        user_id=user.user_id,
                        username=username,
                        subdomain=user.subdomain,
                        is_active=user.is_active,
                        email=user.email,
                        user_type=user.user_type,
                    )

        except JWTError as exc:
            raise AppError.INVALID_CREDENTIALS_ERROR from exc

        raise AppError.INVALID_CREDENTIALS_ERROR

    @classmethod
    async def verify(cls, token: str = Depends(oauth2_scheme)):
        try:
            jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
            return True
        except JWTError as exc:
            raise AppError.INVALID_CREDENTIALS_ERROR from exc


class Account(Base, CRUD["Account"]):
    __tablename__ = "account"
    __table_args__ = (
        Index("username_case_sensitive_index", text("upper(username)"), unique=True),
        UniqueConstraint("username", "subdomain", name="_username_subdomain_uc"),
        UniqueConstraint("email", "subdomain", name="_email_subdomain_uc"),
    )

    user_id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    subdomain: Mapped[str] = mapped_column(nullable=True, unique=True)
    user_type: Mapped[int] = mapped_column(
        nullable=False, server_default=text(f"{RoleEnum.USER}")
    )
    is_active: Mapped[bool] = mapped_column(nullable=False, default=False)
    email_verification_token: Mapped[str] = mapped_column(nullable=True)

    user_to_blog_fk: Mapped["Blog"] = relationship(
        cascade="all, delete-orphan", uselist=False, back_populates="account"
    )

    user_to_blog_posts_fk: Mapped[List["BlogPost"]] = relationship(
        cascade="all, delete-orphan", back_populates="account"
    )

    user_to_blog_post_categories_fk: Mapped[List["BlogPostCategory"]] = relationship(
        cascade="all, delete-orphan", back_populates="account"
    )

    @classmethod
    async def verify_email(cls, session: AsyncSession, token: str):

        try:
            stmt = select(Account).where(Account.email_verification_token == token)
            result = await session.execute(stmt)
            return result.scalars().one()

        except SQLAlchemyExceptions.NoResultFound:
            return None

    async def send_verification_email(self, session: AsyncSession, email: EmailStr, username: str):
        token = uuid4().hex
        confirm_url = f"https://{BACKEND_URL}/api/v1/auth/verify/{token}"
        username_input = username
        send_email(
            username=username_input,
            send_from="do-not-reply@fumi.moe",
            send_to=email,
            subject="Please confirm your email",
            confirm_url=confirm_url,
        )

        stmt = (
            update(Account)
            .returning(Account)
            .where(Account.user_id == self.user_id)
            .values({"email_verification_token": token})
        )
        await session.execute(stmt)
        await session.commit()

    async def register(
        self, session: AsyncSession, data: AccountRegisterSchema
    ) -> CurrentUserSchema:
        self.username = data.username
        self.password = Authenticator.pwd_context.hash(data.password)
        self.email = data.email
        self.is_active = False

        try:
            session.add(self)
            await session.commit()
            await session.refresh(self)

            self.subdomain = f"{self.username}-{self.user_id}"
            stmt = (
                update(Account)
                .where(Account.user_id == self.user_id)
                .values({Account.subdomain: self.subdomain})
            )
            await session.execute(stmt)
            await session.commit()
            await self.send_verification_email(session, data.email, data.username)

            user_data = {
                "user_id": self.user_id,
                "username": self.username,
                "subdomain": self.subdomain,
                "is_active": self.is_active,
                "email": self.email,
                "user_type": self.user_type,
            }

            current_user = CurrentUserSchema(**user_data)
            return current_user

        except SQLAlchemyExceptions.IntegrityError as exc:
            await session.rollback()
            constraint_name_match = re.search(r'"(.+?)"', str(exc.orig))
            constraint_name = constraint_name_match.group(1)
            if constraint_name == "account_email_key":
                raise AppError.EMAIL_ALREADY_EXISTS_ERROR from exc
            elif constraint_name == "account_username_key":
                raise AppError.USERNAME_ALREADY_EXISTS_ERROR from exc
            raise exc

    @classmethod
    async def login(
        cls, session: AsyncSession, username: str, password: str
    ) -> Union[CurrentUserSchema, bool]:
        if not (credentials := await Account.select_from_username(session, username)):
            return False
        if not Authenticator.pwd_context.verify(password, credentials.password):
            return False

        user_data = {
            "user_id": credentials.user_id,
            "username": credentials.username,
            "subdomain": credentials.subdomain,
            "is_active": credentials.is_active,
            "email": credentials.email,
            "user_type": credentials.user_type,
        }
        current_user = CurrentUserSchema(**user_data)
        return current_user

    @classmethod
    async def update_password(
        cls, session: AsyncSession, user_id: int, data: AccountUpdatePasswordSchema
    ):
        curr_cred = await Account.get_one_by_filter(session, [("user_id", user_id)])
        if not Authenticator.pwd_context.verify(
            data.before_password, curr_cred.password
        ):
            raise AppError.INVALID_PASSWORD_ERROR

        if not curr_cred:
            raise AppError.INVALID_CREDENTIALS_ERROR

        if data.password != data.repeat_password:
            raise AppError.PASSWORD_MISMATCH_ERROR

        data_dict = data.dict()
        data_dict.pop("before_password", None)
        data_dict.pop("repeat_password", None)
        data_dict["password"] = Authenticator.pwd_context.hash(data.password)
        to_update = {
            key: value for key, value in data_dict.items() if value is not None
        }

        stmt = (
            update(Account)
            .returning(Account)
            .where(Account.user_id == user_id)
            .values(to_update)
        )
        await session.execute(stmt)
        await session.commit()
        return status.HTTP_204_NO_CONTENT

    @classmethod
    async def update_subdomain(
        cls, session: AsyncSession, user_id: int, data: AccountUpdateSubdomainSchema
    ):
        data_dict = data.dict()
        to_update = {
            key: value for key, value in data_dict.items() if value is not None
        }

        stmt = (
            update(Account)
            .returning(Account.subdomain)
            .where(Account.user_id == user_id)
            .values(to_update)
        )

        try:
            res = await session.execute(stmt)
            await session.commit()
            updated_object = res.fetchone()[0]
            return updated_object

        except SQLAlchemyExceptions.IntegrityError as exc:
            await session.rollback()
            raise AppError.SUBDOMAIN_ALREADY_EXISTS_ERROR

    async def resend_email_verification_token(
        self, session: AsyncSession, user_id: int, username: str
    ):
        self.user_id = user_id
        self.username = username
        res = await self.select_from_username(session, self.username)

        if not res.is_active:
            await self.send_verification_email(session, res.email, self.username)
        else:
            raise AppError.USER_EMAIL_ALREADY_VERIFIED_ERROR

    async def update_email(
        self, session: AsyncSession, user_id: int, data: AccountUpdateEmailSchema
    ):

        stmt = select(Account).where(Account.email == data.email)
        res = await session.execute(stmt)
        existing_account = res.fetchone()
        if existing_account:
            raise AppError.EMAIL_ALREADY_EXISTS_ERROR

        self.user_id = user_id
        data_dict = data.dict()
        data_dict["is_active"] = False
        await self.send_verification_email(session, data.email, existing_account.username)

        to_update = {
            key: value for key, value in data_dict.items() if value is not None
        }

        stmt = (
            update(Account)
            .returning(Account.email)
            .where(Account.user_id == user_id)
            .values(to_update)
        )
        res = await session.execute(stmt)
        await session.commit()
        updated_object = res.fetchone()[0]
        return updated_object

    @classmethod
    async def select_from_username(cls, session: AsyncSession, username: str):
        try:
            stmt = select(Account).where(Account.username.ilike(username))
            result = await session.execute(stmt)
            return result.scalars().one()

        except SQLAlchemyExceptions.NoResultFound:
            return None
