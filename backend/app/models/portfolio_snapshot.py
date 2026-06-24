from datetime import date

from decimal import Decimal

from sqlalchemy import Date, ForeignKey, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class PortfolioSnapshot(Base, TimestampMixin):
    """Foto diária do valor total da carteira — usada no gráfico de evolução."""

    __tablename__ = "portfolio_snapshots"
    __table_args__ = (
        UniqueConstraint("user_id", "snapshot_date", name="uq_snapshot_user_date"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    snapshot_date: Mapped[date] = mapped_column(Date, nullable=False)
    total_value: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    total_invested: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)

    user: Mapped["User"] = relationship(back_populates="portfolio_snapshots")  # noqa: F821
