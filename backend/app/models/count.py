from app.crud.base import CRUD
from app.db.base_class import Base
from app.db.database import AsyncSession

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import text, select, update
import pytz

TIMEZONE = pytz.timezone("Asia/Shanghai")


class Count(Base, CRUD["Count"]):
    __tablename__: str = "count"  # type: ignore
    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    count: Mapped[int] = mapped_column(nullable=False, server_default=text("0"))

    @classmethod
    async def initialize_or_update_count(
        cls, session: AsyncSession, increment: int = 1
    ):
        result = await session.execute(select(cls))
        count_instance = result.scalars().first()

        if count_instance is None:
            await super().create(
                session,
                {
                    "id": 1,
                    "count": increment,
                },
            )
            return {"count": increment}
        else:
            count = count_instance.count
            new_count = count + increment
            stmt = update(cls).where(cls.id == 1).values(count=new_count)
            await session.execute(stmt)
        await session.commit()
        return {"count": new_count}

    @classmethod
    async def get_count(cls, session: AsyncSession):
        result = await session.execute(select(cls))
        count_instance = result.scalars().first()

        if count_instance:
            return {"count": count_instance.count}

        else:
            return {"count": 0}
