from app.schemas.base import CustomBaseModel as BaseModel
from typing import Optional
import datetime


class BlogCreateSchema(BaseModel):
    title: str
    content: str
    image: Optional[str]
    category: Optional[str]


class BlogUpdateSchema(BaseModel):
    title: Optional[str]
    preview: Optional[str]
    content: Optional[str]
    image: Optional[str]
    category: Optional[str]


class BlogSchema(BlogCreateSchema):
    blog_id: int
    user_id: int
    preview: str
    date_posted: datetime.datetime
    last_edited_date: Optional[datetime.datetime]
