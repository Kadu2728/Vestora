from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models.dividend import DividendType


class DividendCreate(BaseModel):
    ticker: str = Field(min_length=1, max_length=20)
    type: DividendType
    amount: float = Field(gt=0)
    payment_date: date


class DividendRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ticker: str
    type: DividendType
    amount: float
    payment_date: date
