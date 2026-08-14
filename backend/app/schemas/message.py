from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from .user import UserPublic


class MessageCreate(BaseModel):
    content: str = Field(min_length=1, max_length=4000)
    message_type: str = "text"
    reply_to_id: int | None = None


class MessageReceiptPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    delivered_at: datetime | None = None
    read_at: datetime | None = None


class MessageReactionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    emoji: str


class MessagePublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    conversation_id: int
    sender_id: int
    content: str
    message_type: str
    status: str
    reply_to_id: int | None = None
    created_at: datetime
    updated_at: datetime
    edited_at: datetime | None = None
    deleted_at: datetime | None = None
    sender: UserPublic
    receipts: list[MessageReceiptPublic] = []
    reactions: list[MessageReactionPublic] = []


class ReactionCreate(BaseModel):
    emoji: str = Field(min_length=1, max_length=20)
