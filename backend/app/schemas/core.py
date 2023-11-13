from app.schemas.base import CustomBaseModel as BaseModel
from typing import Optional
import datetime


class BlogCreateRequestModel(BaseModel):
    title: str
    content: str
    preview: str
    category: Optional[str]


class BlogUpdateRequestModel(BaseModel):
    title: Optional[str]
    content: Optional[str]
    preview: Optional[str]
    image: Optional[str]
    category: Optional[str]


class BlogResponseModel(BlogCreateRequestModel):
    blog_id: int
    user_id: int
    preview: str
    image: str
    date_posted: datetime.datetime
    last_edited_date: Optional[datetime.datetime]
