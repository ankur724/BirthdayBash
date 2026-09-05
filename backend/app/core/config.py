from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "BirthdayBash"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/birthdaybash"
    SECRET_KEY: str = "change-me"
    BACKEND_CORS_ORIGINS: list[str] = ["*"]


settings = Settings()
