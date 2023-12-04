from app.api.endpoints import core, example, auth, count
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(example.router, tags=["Example"])
api_router.include_router(core.router, tags=["Core"], prefix="/blog")
api_router.include_router(core.blogs_router, tags=["Core"], prefix="/blogs")
api_router.include_router(auth.router, tags=["Authentication"], prefix="/auth")
api_router.include_router(count.router, tags=["Count"], prefix="/count")
