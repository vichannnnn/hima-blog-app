from app.api.endpoints import blog, blog_post, blog_post_category, example, auth
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(example.router, tags=["Example"])
api_router.include_router(blog.router, tags=["Blog"], prefix="/blog")
api_router.include_router(blog_post.router, tags=["Blog Post"], prefix="/post")
api_router.include_router(
    blog_post_category.router, tags=["Blog Post Category"], prefix="/category"
)
api_router.include_router(auth.router, tags=["Authentication"], prefix="/auth")
