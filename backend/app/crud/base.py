from typing import TypeVar, Generic, List, Tuple, Any, Type, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import declared_attr
from sqlalchemy import update, delete, select, and_, BinaryExpression
from sqlalchemy.orm.decl_api import DeclarativeMeta
from app.db.base_class import Base

ModelType = TypeVar("ModelType")


class CRUD(Generic[ModelType]):
    @declared_attr
    def __tablename__(self) -> str:
        return self.__class__.__name__.lower()

    @classmethod
    async def create(
        cls: DeclarativeMeta, session: AsyncSession, data: dict
    ) -> ModelType:
        obj = cls(**data)
        session.add(obj)
        await session.commit()
        return obj

    @classmethod
    async def get_one(cls: Base, session: AsyncSession) -> ModelType:

        stmt = select(cls)
        result = await session.execute(stmt)
        return result.scalar()

    @classmethod
    async def get_one_by_filter(
        cls: Base,
        session: AsyncSession,
        filter_conditions: List[Tuple[str, Any]] = None,
        join_table: Type[Base] = None,
        join_filter_conditions: List[Tuple[str, Any]] = None,
    ) -> ModelType:

        stmt = select(cls)

        if join_table:
            stmt = stmt.join(join_table)

        if filter_conditions:
            stmt = stmt.where(
                and_(*(getattr(cls, k) == v for k, v in filter_conditions))
            )

        if join_table and join_filter_conditions:
            stmt = stmt.where(
                and_(*(getattr(join_table, k) == v for k, v in join_filter_conditions))
            )

        result = await session.execute(stmt)
        return result.scalar()

    @classmethod
    async def get_all_by_filter(
        cls: Base,
        session: AsyncSession,
        filter_conditions: List[Tuple[str, Any]] = None,
        join_table: Type[Base] = None,
        join_filter_conditions: List[Tuple[str, Any]] = None,
    ) -> List[ModelType]:

        stmt = select(cls)

        if join_table:
            stmt = stmt.join(join_table)

        if filter_conditions:
            stmt = stmt.where(
                and_(*(getattr(cls, k) == v for k, v in filter_conditions))
            )

        if join_table and join_filter_conditions:
            stmt = stmt.where(
                and_(*(getattr(join_table, k) == v for k, v in join_filter_conditions))
            )

        result = await session.execute(stmt)
        return result.scalars().all()

    @classmethod
    async def get_all(cls: Base, session: AsyncSession) -> List[ModelType]:
        stmt = select(cls)
        result = await session.execute(stmt)
        return result.scalars().all()

    @classmethod
    async def update_one_by_filter(
        cls: Base,
        session: AsyncSession,
        data: dict,
        filter_conditions: List[Tuple[str, Any]],
    ) -> ModelType:
        data = {key: value for key, value in data.items() if value is not None}
        stmt = (
            update(cls)
            .returning(cls)
            .where(and_(*(getattr(cls, k) == v for k, v in filter_conditions)))
            .values(**data)
        )
        res = await session.execute(stmt)
        await session.commit()
        updated_object = res.fetchone()

        return updated_object

    @classmethod
    async def delete_one_by_filter(
        cls: Base, session: AsyncSession, filter_conditions: List[Tuple[str, Any]]
    ) -> ModelType:
        stmt = (
            delete(cls)
            .returning(cls)
            .where(and_(*(getattr(cls, k) == v for k, v in filter_conditions)))
        )
        res = await session.execute(stmt)
        await session.commit()
        deleted_object = res.fetchone()
        return deleted_object
