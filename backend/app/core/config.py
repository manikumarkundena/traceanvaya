from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    # AI Configuration
    AI_PROVIDER: str = "gemini"  # "gemini" or "openai" or "test"
    AI_MODEL: str = "gemini-3.5-flash-lite"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Public demo & request safeguards
    RATE_LIMIT_PER_MINUTE: int = 30
    MAX_AGENT_BODY_BYTES: int = 131072  # 128 KB

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./traceanvaya.db"

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origin_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def async_database_url(self) -> str:
        """Normalize managed PostgreSQL URLs (Neon/Render/Railway) for SQLAlchemy asyncpg."""
        from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse

        url = self.DATABASE_URL.strip()
        if url.startswith("postgres://"):
            url = "postgresql+asyncpg://" + url[len("postgres://"):]
        elif url.startswith("postgresql://") and "+asyncpg" not in url:
            url = "postgresql+asyncpg://" + url[len("postgresql://"):]

        if url.startswith("postgresql+asyncpg://") and "?" in url:
            parsed = urlparse(url)
            params = []
            for key, value in parse_qsl(parsed.query, keep_blank_values=True):
                if key == "sslmode":
                    if value in ("require", "verify-ca", "verify-full"):
                        params.append(("ssl", "require"))
                elif key == "channel_binding":
                    continue
                else:
                    params.append((key, value))
            url = urlunparse(parsed._replace(query=urlencode(params)))

        return url


settings = Settings()
