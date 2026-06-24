from enum import Enum as PyEnum

from sqlalchemy import Enum, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class AssetClass(str, PyEnum):
    ACOES = "acoes"
    FIIS = "fiis"
    ETF = "etf"
    RENDA_FIXA = "renda_fixa"
    CRIPTO = "cripto"
    INTERNACIONAL = "internacional"


class Asset(Base, TimestampMixin):
    __tablename__ = "assets"
    __table_args__ = (UniqueConstraint("ticker", name="uq_assets_ticker"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    ticker: Mapped[str] = mapped_column(String(20), index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    asset_class: Mapped[AssetClass] = mapped_column(
        Enum(AssetClass, native_enum=False), nullable=False
    )
    exchange: Mapped[str] = mapped_column(String(20), default="B3", nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="BRL", nullable=False)

    holdings: Mapped[list["Holding"]] = relationship(  # noqa: F821
        back_populates="asset"
    )
    transactions: Mapped[list["Transaction"]] = relationship(  # noqa: F821
        back_populates="asset"
    )
    dividend_payments: Mapped[list["DividendPayment"]] = relationship(  # noqa: F821
        back_populates="asset"
    )
