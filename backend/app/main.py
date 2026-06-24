from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.db.session import Base, engine

# Garante que todos os modelos estão registrados no metadata antes do create_all
import app.models  # noqa: F401,E402


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Em produção, prefira `alembic upgrade head` no pipeline de deploy.
    # Mantemos o create_all aqui só como rede de segurança em dev local.
    if settings.ENVIRONMENT == "development":
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API da plataforma Vestora — patrimônio, dividendos e rentabilidade em tempo real.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Health"])
def health_check() -> dict:
    return {"status": "ok", "service": settings.PROJECT_NAME, "environment": settings.ENVIRONMENT}
