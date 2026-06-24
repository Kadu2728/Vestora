from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.asset import Asset
from app.models.holding import Holding
from app.models.user import User
from app.schemas.holding import HoldingCreate, HoldingWithQuote
from app.services.portfolio_service import PortfolioService

router = APIRouter()


@router.get("", response_model=list[HoldingWithQuote])
async def list_holdings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[HoldingWithQuote]:
    return await PortfolioService(db).get_holdings_with_quotes(current_user.id)


@router.post("", response_model=HoldingWithQuote, status_code=status.HTTP_201_CREATED)
async def add_holding(
    payload: HoldingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> HoldingWithQuote:
    ticker = payload.ticker.upper()

    asset = db.query(Asset).filter(Asset.ticker == ticker).first()
    if asset is None:
        asset = Asset(
            ticker=ticker,
            name=payload.name or ticker,
            asset_class=payload.asset_class,
        )
        db.add(asset)
        db.flush()

    holding = (
        db.query(Holding)
        .filter(Holding.user_id == current_user.id, Holding.asset_id == asset.id)
        .first()
    )

    if holding:
        # Já existe posição: consolida preço médio
        total_quantity = float(holding.quantity) + payload.quantity
        total_cost = (float(holding.quantity) * float(holding.average_price)) + (
            payload.quantity * payload.average_price
        )
        holding.quantity = total_quantity
        holding.average_price = total_cost / total_quantity if total_quantity else 0
    else:
        holding = Holding(
            user_id=current_user.id,
            asset_id=asset.id,
            quantity=payload.quantity,
            average_price=payload.average_price,
        )
        db.add(holding)

    db.commit()

    service = PortfolioService(db)
    holdings = await service.get_holdings_with_quotes(current_user.id)

    total_value = sum(h.current_value for h in holdings)
    total_invested = sum(h.total_invested for h in holdings)
    service.record_daily_snapshot(current_user.id, total_value, total_invested)

    return next(h for h in holdings if h.ticker == ticker)
