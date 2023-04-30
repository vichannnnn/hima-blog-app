from app.schemas.base import CustomBaseModel as BaseModel
from typing import Optional
from app.schemas.blog_post import BlogPostSchema


class CategoryCreateSchema(BaseModel):
    category_name: str


class CategoryUpdateSchema(BaseModel):
    category_name: Optional[str]


class CategorySchema(CategoryCreateSchema):
    category_id: int
    user_id: int


class UpdateBlogPostCategorySchema(BaseModel):
    category_id: int
    post_id: int


class BlogPostCategorySchema(BaseModel):
    association_id: Optional[int]
    category: CategorySchema
    blog_post: BlogPostSchema
