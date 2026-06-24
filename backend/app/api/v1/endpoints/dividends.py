from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_active_user
from app.db.session import get_db
from app.models.asset import Asset
from app.models.dividend import DividendPayment
from app.models.user import User
from app.schemas.dividend import DividendCreate, DividendRead

router = APIRouter()


@router.get("", response_model=list[DividendRead])
def list_dividends(
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> list[dict]:
    stmt = (
        select(DividendPayment, Asset.ticker)
        .join(Asset, Asset.id == DividendPayment.asset_id)
        .where(DividendPayment.user_id == current_user.id)
        .order_by(DividendPayment.payment_date.desc())
        .limit(limit)
    )
    rows = db.execute(stmt).all()
    return [
        {
            "id": dividend.id,
            "ticker": ticker,
            "type": dividend.type,
            "amount": float(dividend.amount),
            "payment_date": dividend.payment_date,
        }
        for dividend, ticker in rows
    ]


@router.post("", response_model=DividendRead, status_code=status.HTTP_201_CREATED)
def add_dividend(
    payload: DividendCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    asset = db.query(Asset).filter(Asset.ticker == payload.ticker.upper()).first()
    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ativo não encontrado na carteira. Adicione-o primeiro.",
        )

    dividend = DividendPayment(
        user_id=current_user.id,
        asset_id=asset.id,
        type=payload.type,
        amount=payload.amount,
        payment_date=payload.payment_date,
    )
    db.add(dividend)
    db.commit()

    return {
        "id": dividend.id,
        "ticker": asset.ticker,
        "type": dividend.type,
        "amount": float(dividend.amount),
        "payment_date": dividend.payment_date,
    }
