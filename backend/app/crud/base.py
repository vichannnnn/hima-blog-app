from typing import TypeVar, Generic, Optional, Sequence, Type, Dict, Any
from fastapi import Response as FastAPIResponse
from sqlalchemy import update, delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import declared_attr
from sqlalchemy import exc as SQLAlchemyExceptions, and_

from app.db.base_class import Base
from app.utils.exceptions import AppError

ModelType = TypeVar("ModelType", bound=Base)


class CRUD(Generic[ModelType]):
    @declared_attr  # type: ignore
    def __tablename__(self) -> str:
        return self.__class__.__name__.lower()

    @classmethod
    async def create(  # type: ignore
        cls: Type[ModelType], session: AsyncSession, data: Dict[str, Any]
    ) -> ModelType:
        try:
            obj = cls(**data)
            session.add(obj)
            # import pdb
            # pdb.set_trace()
            await session.commit()
            return obj

        except SQLAlchemyExceptions.IntegrityError as exc:
            await session.rollback()
            if str(exc).find("ForeignKeyViolationError") != -1:
                raise AppError.RESOURCES_NOT_FOUND_ERROR
            elif str(exc).find("UniqueViolationError") != -1:
                raise AppError.RESOURCES_ALREADY_EXISTS_ERROR from exc

    @classmethod
    async def get(cls: Type[ModelType], session: AsyncSession, slug: str) -> ModelType:  # type: ignore
        stmt = select(cls).where(cls.slug == slug)
        result = await session.execute(stmt)
        instance = result.scalar()

        if instance is None:
            raise AppError.RESOURCES_NOT_FOUND_ERROR
        return instance

    @classmethod
    async def update(  # type: ignore
        cls: Type[ModelType], session: AsyncSession, slug: str, data: Dict[str, Any]
    ) -> ModelType:
        stmt = update(cls).returning(cls).where(cls.slug == slug).values(**data)
        res = await session.execute(stmt)
        await session.commit()
        updated_instance = res.scalar()

        if updated_instance is None:
            await session.rollback()
            raise AppError.RESOURCES_NOT_FOUND_ERROR
        return updated_instance

    @classmethod
    async def delete(  # type: ignore
        cls: Type[ModelType], session: AsyncSession, slug: str
    ) -> FastAPIResponse:
        stmt = delete(cls).returning(cls).where(cls.slug == slug)
        res = await session.execute(stmt)
        await session.commit()
        deleted_instance = res.scalar()

        if not deleted_instance:
            await session.rollback()
            raise AppError.RESOURCES_NOT_FOUND_ERROR
        return FastAPIResponse(status_code=204)

    @classmethod
    async def get_all(  # type: ignore
        cls: Type[ModelType],
        session: AsyncSession,
        filter_: Optional[Dict[str, Any]] = None,
    ) -> Sequence[ModelType]:
        stmt = select(cls)
        if filter_:
            conditions = [getattr(cls, key) == value for key, value in filter_.items()]
            stmt = stmt.where(and_(*conditions))
        result = await session.execute(stmt)
        return result.scalars().all()
