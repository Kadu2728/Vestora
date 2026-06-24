from datetime import date, datetime, timedelta, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.dividend import DividendPayment
from app.models.holding import Holding
from app.models.portfolio_snapshot import PortfolioSnapshot
from app.schemas.holding import HoldingWithQuote
from app.schemas.portfolio import AllocationSlice, EvolutionPoint, PortfolioSummary
from app.services.market_data import MarketDataService

ASSET_CLASS_LABELS = {
    "acoes": "Ações",
    "fiis": "FIIs",
    "etf": "ETFs",
    "renda_fixa": "Renda Fixa",
    "cripto": "Cripto",
    "internacional": "Internacional",
}


class PortfolioService:
    def __init__(self, db: Session):
        self.db = db

    def _list_holdings(self, user_id: str) -> list[Holding]:
        stmt = select(Holding).where(Holding.user_id == user_id)
        return list(self.db.scalars(stmt))

    async def get_holdings_with_quotes(self, user_id: str) -> list[HoldingWithQuote]:
        holdings = self._list_holdings(user_id)
        if not holdings:
            return []

        tickers = [holding.asset.ticker for holding in holdings]
        quotes = await MarketDataService.get_quotes(tickers)

        enriched: list[HoldingWithQuote] = []
        for holding in holdings:
            quantity = float(holding.quantity)
            average_price = float(holding.average_price)
            current_price = quotes.get(holding.asset.ticker, average_price)

            total_invested = quantity * average_price
            current_value = quantity * current_price
            profitability = (
                ((current_value - total_invested) / total_invested) * 100
                if total_invested > 0
                else 0.0
            )

            enriched.append(
                HoldingWithQuote(
                    id=holding.id,
                    ticker=holding.asset.ticker,
                    name=holding.asset.name,
                    asset_class=holding.asset.asset_class.value,
                    quantity=quantity,
                    average_price=average_price,
                    current_price=current_price,
                    total_invested=round(total_invested, 2),
                    current_value=round(current_value, 2),
                    profitability_pct=round(profitability, 2),
                )
            )
        return enriched

    def _monthly_dividends(self, user_id: str) -> tuple[float, float]:
        today = date.today()
        start_this_month = today.replace(day=1)
        start_last_month = (start_this_month - timedelta(days=1)).replace(day=1)

        this_month = self.db.scalar(
            select(func.coalesce(func.sum(DividendPayment.amount), 0)).where(
                DividendPayment.user_id == user_id,
                DividendPayment.payment_date >= start_this_month,
            )
        )
        last_month = self.db.scalar(
            select(func.coalesce(func.sum(DividendPayment.amount), 0)).where(
                DividendPayment.user_id == user_id,
                DividendPayment.payment_date >= start_last_month,
                DividendPayment.payment_date < start_this_month,
            )
        )
        return float(this_month or 0), float(last_month or 0)

    async def get_summary(self, user_id: str) -> PortfolioSummary:
        holdings = await self.get_holdings_with_quotes(user_id)
        total_value = sum(h.current_value for h in holdings)
        total_invested = sum(h.total_invested for h in holdings)
        profitability = (
            ((total_value - total_invested) / total_invested) * 100
            if total_invested > 0
            else 0.0
        )

        this_month, last_month = self._monthly_dividends(user_id)
        change_pct = ((this_month - last_month) / last_month) * 100 if last_month > 0 else 0.0

        return PortfolioSummary(
            total_patrimony=round(total_value, 2),
            total_invested=round(total_invested, 2),
            total_profitability_pct=round(profitability, 2),
            monthly_dividends=round(this_month, 2),
            monthly_dividends_change_pct=round(change_pct, 2),
            last_updated=datetime.now(timezone.utc).isoformat(),
        )

    async def get_allocation(self, user_id: str) -> list[AllocationSlice]:
        holdings = await self.get_holdings_with_quotes(user_id)
        total_value = sum(h.current_value for h in holdings) or 1.0

        grouped: dict[str, float] = {}
        for holding in holdings:
            grouped[holding.asset_class] = grouped.get(holding.asset_class, 0) + holding.current_value

        slices = [
            AllocationSlice(
                asset_class=asset_class,
                label=ASSET_CLASS_LABELS.get(asset_class, asset_class),
                value=round(value, 2),
                percentage=round((value / total_value) * 100, 1),
            )
            for asset_class, value in grouped.items()
        ]
        return sorted(slices, key=lambda item: item.value, reverse=True)

    def get_evolution(self, user_id: str, days: int = 365) -> list[EvolutionPoint]:
        cutoff = date.today() - timedelta(days=days)
        stmt = (
            select(PortfolioSnapshot)
            .where(
                PortfolioSnapshot.user_id == user_id,
                PortfolioSnapshot.snapshot_date >= cutoff,
            )
            .order_by(PortfolioSnapshot.snapshot_date)
        )
        snapshots = self.db.scalars(stmt).all()
        return [
            EvolutionPoint(date=s.snapshot_date, total_value=float(s.total_value))
            for s in snapshots
        ]

    def record_daily_snapshot(self, user_id: str, total_value: float, total_invested: float) -> None:
        """Grava (ou atualiza) a foto patrimonial do dia — chamado após mudanças na carteira."""
        today = date.today()
        existing = self.db.scalar(
            select(PortfolioSnapshot).where(
                PortfolioSnapshot.user_id == user_id,
                PortfolioSnapshot.snapshot_date == today,
            )
        )
        if existing:
            existing.total_value = total_value
            existing.total_invested = total_invested
        else:
            self.db.add(
                PortfolioSnapshot(
                    user_id=user_id,
                    snapshot_date=today,
                    total_value=total_value,
                    total_invested=total_invested,
                )
            )
        self.db.commit()
