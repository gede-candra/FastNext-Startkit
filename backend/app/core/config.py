from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Starter API"
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    allowed_origins: str = "http://localhost:3000"
    database_url: str | None = None
    db_engine: str = "django.db.backends.postgresql"
    db_name: str = "app_starter"
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_host: str = "localhost"
    db_port: str = "5432"
    auth_secret_key: str = "change-me-in-env"
    auth_cookie_name: str = "begos_finance_session"
    auth_cookie_secure: bool = False
    auth_cookie_samesite: str = "lax"
    csrf_cookie_name: str = "begos_finance_csrf"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def resolved_database_url(self) -> str:
        if self.database_url:
            return self.database_url

        engine = self.db_engine.strip().lower()
        if engine == "django.db.backends.postgresql":
            return (
                f"postgresql+psycopg://{self.db_user}:{self.db_password}"
                f"@{self.db_host}:{self.db_port}/{self.db_name}"
            )
        if engine == "django.db.backends.mysql":
            return (
                f"mysql+pymysql://{self.db_user}:{self.db_password}"
                f"@{self.db_host}:{self.db_port}/{self.db_name}"
            )
        if engine == "django.db.backends.sqlite3":
            if self.db_name in (":memory:", "memory"):
                return "sqlite:///:memory:"
            return f"sqlite:///{self.db_name}"

        raise ValueError(
            "Unsupported DB_ENGINE. Use one of: "
            "django.db.backends.postgresql, "
            "django.db.backends.mysql, "
            "django.db.backends.sqlite3"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
