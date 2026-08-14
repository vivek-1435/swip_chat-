from datetime import datetime, timezone
from fastapi import WebSocket
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..models import ConversationMember, User
from ..schemas.message import MessageCreate, MessagePublic
from ..services import conversation_service, message_service
from .events import ClientEvent
from .manager import manager


def conversation_user_ids(db: Session, conversation_id: int) -> list[int]:
    return list(
        db.scalars(
            select(ConversationMember.user_id).where(
                ConversationMember.conversation_id == conversation_id,
                ConversationMember.left_at.is_(None),
            )
        )
    )


async def set_presence(db: Session, user_id: int, online: bool) -> None:
    user = db.get(User, user_id)
    if user:
        user.is_online = online
        user.last_seen = None if online else datetime.now(timezone.utc)
        db.commit()


async def handle_event(db: Session, websocket: WebSocket, user_id: int, raw: dict) -> None:
    try:
        event = ClientEvent(**raw)
        if event.type == "send_message":
            if event.conversation_id is None or event.content is None:
                raise ValueError("Missing message fields")
            message = message_service.create_message(
                db,
                event.conversation_id,
                user_id,
                MessageCreate(content=event.content, reply_to_id=event.reply_to_id),
            )
            payload = {"type": "new_message", "message": MessagePublic.model_validate(message).model_dump(mode="json")}
            await manager.broadcast_to_users(conversation_user_ids(db, event.conversation_id), payload)
            return
        if event.type in {"typing_start", "typing_stop"}:
            if event.conversation_id is None:
                raise ValueError("Missing conversation_id")
            conversation_service.ensure_member(db, event.conversation_id, user_id)
            await manager.broadcast_to_users(
                [uid for uid in conversation_user_ids(db, event.conversation_id) if uid != user_id],
                {"type": "typing", "conversation_id": event.conversation_id, "user_id": user_id, "active": event.type == "typing_start"},
            )
            return
        if event.type == "mark_read":
            if event.conversation_id is None:
                raise ValueError("Missing conversation_id")
            updates = message_service.mark_conversation_read(db, event.conversation_id, user_id, event.message_id)
            ids = conversation_user_ids(db, event.conversation_id)
            for message in updates:
                await manager.broadcast_to_users(ids, {"type": "message_status", "message_id": message.id, "status": "read"})
            return
        await websocket.send_json({"type": "error", "message": "Unknown event type"})
    except Exception as exc:
        try:
            await websocket.send_json({"type": "error", "message": str(exc)})
        except Exception:
            pass
