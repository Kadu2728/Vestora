from pydantic import BaseModel, ConfigDict

from app.models.asset import AssetClass


class AssetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ticker: str
    name: str
    asset_class: AssetClass
    exchange: str
    currency: str
