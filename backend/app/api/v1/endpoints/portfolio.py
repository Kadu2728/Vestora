from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.portfolio import AllocationSlice, EvolutionPoint, PortfolioSummary
from app.services.portfolio_service import PortfolioService

router = APIRouter()


@router.get("/summary", response_model=PortfolioSummary)
async def get_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> PortfolioSummary:
    return await PortfolioService(db).get_summary(current_user.id)


@router.get("/allocation", response_model=list[AllocationSlice])
async def get_allocation(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[AllocationSlice]:
    return await PortfolioService(db).get_allocation(current_user.id)


@router.get("/evolution", response_model=list[EvolutionPoint])
def get_evolution(
    days: int = 365,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[EvolutionPoint]:
    return PortfolioService(db).get_evolution(current_user.id, days=days)
