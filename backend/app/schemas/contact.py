from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .user import UserPublic


class ContactCreate(BaseModel):
    contact_user_id: int
    saved_name: str | None = None


class ContactPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    contact_user_id: int
    saved_name: str | None
    created_at: datetime
    contact_user: UserPublic
