from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações da aplicação, lidas de variáveis de ambiente (.env)."""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # Geral
    PROJECT_NAME: str = "Vestora API"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    API_V1_PREFIX: str = "/api/v1"

    # Banco de dados
    # Dev local: sqlite. Produção: postgresql+psycopg2://user:pass@host/db (Neon)
    DATABASE_URL: str = "sqlite:///./vestora.db"

    # Segurança / JWT
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_USE_OPENSSL_RAND_HEX_32"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS — string separada por vírgula no .env (evita parsing JSON automático de listas)
    CORS_ORIGINS: str = "http://localhost:3000,https://vestora.vercel.app"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    def model_post_init(self, __context) -> None:
        if self.ENVIRONMENT == "production" and (
            self.SECRET_KEY == "CHANGE_ME_IN_PRODUCTION_USE_OPENSSL_RAND_HEX_32"
            or len(self.SECRET_KEY) < 32
        ):
            raise ValueError(
                "SECRET_KEY insegura para produção. Gere uma com: "
                "python -c \"import secrets; print(secrets.token_hex(32))\""
            )

    # Trial gratuito
    TRIAL_DURATION_DAYS: int = 14

    # Provedor de cotações (brapi.dev — API pública para B3)
    MARKET_DATA_BASE_URL: str = "https://brapi.dev/api"
    MARKET_DATA_API_TOKEN: str | None = None
    MARKET_DATA_CACHE_TTL_SECONDS: int = 60


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
