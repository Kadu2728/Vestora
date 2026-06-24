from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import PlanType


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: EmailStr
    plan: PlanType
    is_verified: bool
    is_demo: bool
    trial_ends_at: datetime | None
    is_trial_active: bool
    has_active_access: bool
