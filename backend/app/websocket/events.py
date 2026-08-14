from pydantic import BaseModel


class ClientEvent(BaseModel):
    type: str
    conversation_id: int | None = None
    content: str | None = None
    message_id: int | None = None
    reply_to_id: int | None = None
