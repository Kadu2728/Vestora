from fastapi import APIRouter

from app.api.v1.endpoints import auth, dividends, holdings, live, portfolio, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
api_router.include_router(users.router, prefix="/users", tags=["Usuários"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["Carteira"])
api_router.include_router(holdings.router, prefix="/holdings", tags=["Ativos"])
api_router.include_router(dividends.router, prefix="/dividends", tags=["Dividendos"])
api_router.include_router(live.router, tags=["Tempo real"])
