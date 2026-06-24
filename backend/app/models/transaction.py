from datetime import date
from enum import Enum as PyEnum

from decimal import Decimal

from sqlalchemy import Date, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class TransactionType(str, PyEnum):
    BUY = "buy"
    SELL = "sell"


class Transaction(Base, TimestampMixin):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    asset_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("assets.id", ondelete="RESTRICT"), nullable=False
    )

    type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType, native_enum=False), nullable=False
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False)
    fees: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False, default=0)
    executed_at: Mapped[date] = mapped_column(Date, nullable=False)

    user: Mapped["User"] = relationship(back_populates="transactions")  # noqa: F821
    asset: Mapped["Asset"] = relationship(back_populates="transactions")  # noqa: F821
