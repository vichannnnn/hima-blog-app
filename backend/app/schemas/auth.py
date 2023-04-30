from app.schemas.base import CustomBaseModel as BaseModel
from pydantic import constr, EmailStr
from typing import Optional
from enum import IntEnum

password_validator = constr(regex="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^])[^\s]{8,20}$")
subdomain_validator = constr(regex="^[a-zA-Z0-9-]{4,30}$")
username_validator = constr(regex="^[a-zA-Z0-9]{4,20}$")


class RoleEnum(IntEnum):
    USER = 1  # pylint: disable=invalid-name
    PREMIUM_USER = 2  # pylint: disable=invalid-name
    DEVELOPER = 3  # pylint: disable=invalid-name


class AccountRegisterSchema(BaseModel):
    username: username_validator  # type: ignore
    password: password_validator  # type: ignore
    repeat_password: password_validator  # type: ignore
    email: EmailStr


class AccountUpdatePasswordSchema(BaseModel):
    before_password: Optional[password_validator]  # type: ignore
    password: Optional[password_validator]  # type: ignore
    repeat_password: Optional[password_validator]  # type: ignore


class AccountUpdateEmailSchema(BaseModel):
    email: Optional[EmailStr]


class AccountUpdateSubdomainSchema(BaseModel):
    subdomain: Optional[subdomain_validator]  # type: ignore


class AccountSchema(AccountRegisterSchema):
    user_id: Optional[int] = None
    subdomain: Optional[subdomain_validator]  # type: ignore
    repeat_password: str = None


class CurrentUserSchema(BaseModel):
    user_id: int
    username: username_validator  # type: ignore
    user_type: RoleEnum
    subdomain: subdomain_validator
    email: EmailStr
    is_active: bool


class AuthSchema(BaseModel):
    username: username_validator  # type: ignore
    password: password_validator  # type: ignore
