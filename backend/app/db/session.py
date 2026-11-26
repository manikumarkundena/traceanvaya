from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

Base = declarative_base()

db_url = settings.async_database_url
is_sqlite = db_url.startswith("sqlite")

# Configure async engine (supports SQLite async and PostgreSQL asyncpg)
engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    **({} if is_sqlite else {"pool_pre_ping": True, "pool_size": 5, "max_overflow": 10}),
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
