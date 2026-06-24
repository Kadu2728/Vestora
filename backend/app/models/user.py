from datetime import datetime, timedelta, timezone
from enum import Enum as PyEnum

from sqlalchemy import Boolean, DateTime, Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.config import settings
from app.db.session import Base
from app.models.base import TimestampMixin, generate_uuid


class PlanType(str, PyEnum):
    TRIAL = "trial"
    FREE = "free"
    INVESTIDOR = "investidor"
    PRO = "pro"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    plan: Mapped[PlanType] = mapped_column(
        Enum(PlanType, native_enum=False), default=PlanType.TRIAL, nullable=False
    )
    trial_ends_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    is_demo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    holdings: Mapped[list["Holding"]] = relationship(  # noqa: F821
        back_populates="user", cascade="all, delete-orphan"
    )
    transactions: Mapped[list["Transaction"]] = relationship(  # noqa: F821
        back_populates="user", cascade="all, delete-orphan"
    )
    dividend_payments: Mapped[list["DividendPayment"]] = relationship(  # noqa: F821
        back_populates="user", cascade="all, delete-orphan"
    )
    portfolio_snapshots: Mapped[list["PortfolioSnapshot"]] = relationship(  # noqa: F821
        back_populates="user", cascade="all, delete-orphan"
    )

    @staticmethod
    def new_trial_expiry() -> datetime:
        return datetime.now(timezone.utc) + timedelta(days=settings.TRIAL_DURATION_DAYS)

    @property
    def is_trial_active(self) -> bool:
        if self.plan != PlanType.TRIAL or self.trial_ends_at is None:
            return False
        trial_ends_at = self.trial_ends_at
        if trial_ends_at.tzinfo is None:
            trial_ends_at = trial_ends_at.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) < trial_ends_at

    @property
    def has_active_access(self) -> bool:
        """True se o usuário pode acessar funcionalidades pagas (trial válido ou plano pago)."""
        return self.plan in (PlanType.INVESTIDOR, PlanType.PRO) or self.is_trial_active
