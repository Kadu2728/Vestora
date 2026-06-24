from datetime import date

from pydantic import BaseModel


class PortfolioSummary(BaseModel):
    total_patrimony: float
    total_invested: float
    total_profitability_pct: float
    monthly_dividends: float
    monthly_dividends_change_pct: float
    last_updated: str


class AllocationSlice(BaseModel):
    asset_class: str
    label: str
    value: float
    percentage: float


class EvolutionPoint(BaseModel):
    date: date
    total_value: float
