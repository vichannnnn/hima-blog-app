from app.schemas.base import CustomBaseModel as BaseModel
from typing import Optional


class BlogCreateSchema(BaseModel):
    logo: str
    title_tag: str
    hero_title: str
    hero_content: str


class BlogUpdateSchema(BaseModel):
    logo: Optional[str]
    title_tag: Optional[str]
    hero_title: Optional[str]
    hero_content: Optional[str]


class BlogSchema(BlogCreateSchema):
    user_id: int
    id: int
