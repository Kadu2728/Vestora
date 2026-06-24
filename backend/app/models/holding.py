from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class Holding(Base, TimestampMixin):
    """Posição consolidada: quantidade e preço médio de um ativo para um usuário."""

    __tablename__ = "holdings"
    __table_args__ = (
        UniqueConstraint("user_id", "asset_id", name="uq_holdings_user_asset"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    asset_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("assets.id", ondelete="RESTRICT"), nullable=False
    )

    quantity: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False, default=0)
    average_price: Mapped[Decimal] = mapped_column(Numeric(18, 8), nullable=False, default=0)

    user: Mapped["User"] = relationship(back_populates="holdings")  # noqa: F821
    asset: Mapped["Asset"] = relationship(back_populates="holdings")  # noqa: F821
