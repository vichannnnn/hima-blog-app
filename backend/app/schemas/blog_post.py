from app.schemas.base import CustomBaseModel as BaseModel
from typing import Optional
from datetime import date, datetime
from pydantic import validator
import json


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.strftime("%d %B %Y")
        return super().default(obj)


class BlogPostCreateSchema(BaseModel):
    title: str
    content: str
    preview: str


class BlogPostUpdateSchema(BaseModel):
    title: Optional[str]
    content: Optional[str]
    preview: Optional[str]


class BlogPostSchema(BlogPostCreateSchema):
    user_id: int
    post_id: Optional[int] = None
    date_posted: Optional[str]
    image: str

    @validator("date_posted", pre=True)
    def parse_date(cls, value):
        if isinstance(value, date):
            return value.strftime("%d %B %Y")
        elif isinstance(value, str):
            try:
                date_obj = datetime.strptime(value, "%d %B %Y").date()
                return date_obj.isoformat()
            except ValueError:
                raise ValueError("Invalid date format")
        else:
            raise ValueError("Invalid date format")
