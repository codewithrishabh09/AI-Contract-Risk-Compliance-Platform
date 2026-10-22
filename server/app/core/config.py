from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL

cors_origins: list[str] = []
class Settings(BaseSettings):
    app_name: str = "AI Contract Intelligence"
    environment: str = "development"

    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "contract_intelligence"
    db_user: str = "contract_admin"
    db_password: str

    llm_provider: str = "groq"
    llm_model: str = "openai/gpt-oss-20b"
    llm_base_url: str | None = None
    llm_api_key: str | None = None
    openai_api_key: str | None = None

    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30

    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> URL:
        return URL.create(
            drivername="postgresql+psycopg",
            username=self.db_user,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

@field_validator("cors_origins", mode="before")
@classmethod
def parse_cors_origins(cls, value: object) -> list[str]:
    if isinstance(value, str):
        return [
            origin.strip()
            for origin in value.split(",")
            if origin.strip()
        ]

    if isinstance(value, list):
        return value

    return []