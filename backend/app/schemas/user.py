from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    phone: str | None = None
    display_name: str
    avatar_url: str | None = None
    is_online: bool
    last_seen: datetime | None = None
    created_at: datetime


class UserUpdate(BaseModel):
    display_name: str | None = None
    avatar_url: str | None = None
