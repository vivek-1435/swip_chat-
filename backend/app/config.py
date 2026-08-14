from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SwipChat"
    database_url: str = "sqlite:///./swipchat.db"
    jwt_secret: str = "dev-change-me"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60 * 24 * 7
    cors_allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    mock_otp: str = "123456"

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache
def get_settings() -> Settings:
    return Settings()
