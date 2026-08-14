from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .message import MessagePublic
from .user import UserPublic


class DirectConversationCreate(BaseModel):
    user_id: int


class ConversationMemberPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    role: str
    joined_at: datetime
    left_at: datetime | None = None
    user: UserPublic


class ConversationPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    name: str | None = None
    avatar_url: str | None = None
    created_by: int
    created_at: datetime
    updated_at: datetime
    members: list[ConversationMemberPublic] = []
    last_message: MessagePublic | None = None
    unread_count: int = 0


class GroupCreate(BaseModel):
    name: str = Field(min_length=1, max_length=140)
    avatar_url: str | None = None
    member_ids: list[int] = Field(default_factory=list)


class GroupUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=140)
    avatar_url: str | None = None


class GroupMemberAdd(BaseModel):
    user_id: int


class GroupMemberUpdate(BaseModel):
    role: str = Field(min_length=1, max_length=50)
