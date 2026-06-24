"""
Popula uma carteira de demonstração para o usuário recém-cadastrado.

Assim, no primeiro acesso (período de teste grátis), o dashboard já aparece
com ativos, dividendos e evolução patrimonial reais — sem o usuário precisar
conectar uma corretora antes de entender o produto.
"""

import random
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.asset import Asset, AssetClass
from app.models.dividend import DividendPayment, DividendType
from app.models.holding import Holding
from app.models.portfolio_snapshot import PortfolioSnapshot
from app.models.user import User

_DEMO_ASSETS: list[dict] = [
    {"ticker": "PETR4", "name": "Petrobras PN", "asset_class": AssetClass.ACOES, "quantity": 500, "average_price": 28.40},
    {"ticker": "ITUB4", "name": "Itaú Unibanco PN", "asset_class": AssetClass.ACOES, "quantity": 300, "average_price": 24.10},
    {"ticker": "MXRF11", "name": "Maxi Renda FII", "asset_class": AssetClass.FIIS, "quantity": 1200, "average_price": 10.20},
    {"ticker": "HGLG11", "name": "CSHG Logística FII", "asset_class": AssetClass.FIIS, "quantity": 400, "average_price": 158.30},
    {"ticker": "IVVB11", "name": "iShares S&P 500", "asset_class": AssetClass.ETF, "quantity": 150, "average_price": 158.90},
]


def _get_or_create_asset(db: Session, data: dict) -> Asset:
    asset = db.query(Asset).filter(Asset.ticker == data["ticker"]).first()
    if asset:
        return asset
    asset = Asset(
        ticker=data["ticker"],
        name=data["name"],
        asset_class=data["asset_class"],
    )
    db.add(asset)
    db.flush()
    return asset


def seed_demo_portfolio(db: Session, user: User) -> None:
    existing = db.query(Holding).filter(Holding.user_id == user.id).first()
    if existing:
        return  # já tem carteira — não sobrescreve

    total_invested = Decimal("0")
    for item in _DEMO_ASSETS:
        asset = _get_or_create_asset(db, item)
        quantity = Decimal(str(item["quantity"]))
        average_price = Decimal(str(item["average_price"]))

        db.add(
            Holding(
                user_id=user.id,
                asset_id=asset.id,
                quantity=quantity,
                average_price=average_price,
            )
        )
        total_invested += quantity * average_price

        # Um pagamento de provento recente por ativo, pra lista de dividendos não nascer vazia
        db.add(
            DividendPayment(
                user_id=user.id,
                asset_id=asset.id,
                type=DividendType.RENDIMENTO
                if item["asset_class"] == AssetClass.FIIS
                else DividendType.DIVIDENDO,
                amount=round(float(quantity) * random.uniform(0.15, 0.45), 2),
                payment_date=date.today() - timedelta(days=random.randint(1, 20)),
            )
        )

    # Evolução patrimonial simulada dos últimos 12 meses, terminando no valor investido atual
    today = date.today()
    monthly_growth = random.uniform(0.012, 0.022)
    value = float(total_invested) / ((1 + monthly_growth) ** 11)
    for months_ago in range(11, -1, -1):
        snapshot_date = (today.replace(day=1) - timedelta(days=months_ago * 30))
        value *= 1 + monthly_growth + random.uniform(-0.01, 0.01)
        db.add(
            PortfolioSnapshot(
                user_id=user.id,
                snapshot_date=snapshot_date,
                total_value=round(value, 2),
                total_invested=float(total_invested),
            )
        )

    db.commit()
