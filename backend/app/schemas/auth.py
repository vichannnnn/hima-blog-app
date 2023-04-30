from app.schemas.base import CustomBaseModel as BaseModel
from pydantic import constr
from typing import Optional
from enum import IntEnum

password_validator = constr(regex="^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^])[^\s]{8,20}$")
username_validator = constr(regex="^[a-zA-Z0-9]{4,20}$")


class RoleEnum(IntEnum):
    USER = 1  # pylint: disable=invalid-name
    PREMIUM_USER = 2  # pylint: disable=invalid-name
    DEVELOPER = 3  # pylint: disable=invalid-name


class AccountRegisterSchema(BaseModel):
    username: username_validator  # type: ignore
    password: password_validator  # type: ignore
    repeat_password: password_validator  # type: ignore


class AccountUpdatePasswordSchema(BaseModel):
    before_password: Optional[password_validator]  # type: ignore
    password: Optional[password_validator]  # type: ignore
    repeat_password: Optional[password_validator]  # type: ignore


class AccountSchema(AccountRegisterSchema):
    user_id: Optional[int] = None
    repeat_password: str = None


class CurrentUserSchema(BaseModel):
    user_id: int
    username: username_validator  # type: ignore
    user_type: RoleEnum
    is_active: bool


class AuthSchema(BaseModel):
    username: username_validator  # type: ignore
    password: password_validator  # type: ignore
