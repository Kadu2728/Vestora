from pydantic import BaseModel, ConfigDict, Field

from app.models.asset import AssetClass
from app.schemas.asset import AssetRead


class HoldingCreate(BaseModel):
    ticker: str = Field(min_length=1, max_length=20)
    quantity: float = Field(gt=0)
    average_price: float = Field(gt=0)
    # Usados apenas se o ticker ainda não existir no catálogo de ativos
    name: str | None = None
    asset_class: AssetClass = AssetClass.ACOES


class HoldingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    asset: AssetRead
    quantity: float
    average_price: float


class HoldingWithQuote(BaseModel):
    """Posição enriquecida com a cotação atual, usada nos endpoints de carteira."""

    id: str
    ticker: str
    name: str
    asset_class: str
    quantity: float
    average_price: float
    current_price: float
    total_invested: float
    current_value: float
    profitability_pct: float
