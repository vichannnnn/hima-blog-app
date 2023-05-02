from app.api.api import api_router
from fastapi import FastAPI
from fastapi.middleware import cors
import os

app = FastAPI(
    root_path="/api/v1",
    docs_url=None if os.getenv("PRODUCTION") == "true" else "/docs",
    redoc_url=None if os.getenv("PRODUCTION") == "true" else "/redoc",
)

app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.on_event("startup")
async def on_startup() -> None:
    pass


@app.on_event("shutdown")
async def shutdown_event() -> None:
    pass
