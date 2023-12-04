from fastapi import APIRouter
from typing import Dict
from app.models.count import Count
from app.api.deps import CurrentSession

router = APIRouter()


@router.post("")
async def add_count(session: CurrentSession) -> Dict[str, int]:
    return await Count.initialize_or_update_count(session, 1)


@router.get("")
async def get_count(session: CurrentSession) -> Dict[str, int]:
    return await Count.get_count(session)
