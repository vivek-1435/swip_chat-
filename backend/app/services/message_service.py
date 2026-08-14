from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from ..models import Conversation, ConversationMember, Message, MessageReaction, MessageReceipt
from ..schemas.message import MessageCreate
from ..services.conversation_service import ensure_member
from ..utils.mock_encryption import mock_decrypt, mock_encrypt
from ..utils.validators import require_message_text


def _load_message(db: Session, message_id: int) -> Message:
    message = db.scalar(
        select(Message)
        .options(joinedload(Message.sender), joinedload(Message.receipts), joinedload(Message.reactions))
        .where(Message.id == message_id)
    )
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    message.content = mock_decrypt(message.content)
    return message


def list_messages(db: Session, conversation_id: int, user_id: int, limit: int = 50, before_id: int | None = None) -> list[Message]:
    ensure_member(db, conversation_id, user_id)
    query = (
        select(Message)
        .options(joinedload(Message.sender), joinedload(Message.receipts), joinedload(Message.reactions))
        .where(Message.conversation_id == conversation_id, Message.deleted_at.is_(None))
        .order_by(Message.created_at.desc())
        .limit(min(limit, 100))
    )
    if before_id:
        query = query.where(Message.id < before_id)
    rows = list(db.scalars(query).unique())
    for row in rows:
        row.content = mock_decrypt(row.content)
    return list(reversed(rows))


def create_message(db: Session, conversation_id: int, sender_id: int, payload: MessageCreate) -> Message:
    ensure_member(db, conversation_id, sender_id)
    require_message_text(payload.content)
    if payload.reply_to_id:
        reply = db.get(Message, payload.reply_to_id)
        if reply is None or reply.conversation_id != conversation_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reply target")
    message = Message(
        conversation_id=conversation_id,
        sender_id=sender_id,
        content=mock_encrypt(payload.content.strip()),
        message_type=payload.message_type,
        status="sent",
        reply_to_id=payload.reply_to_id,
    )
    db.add(message)
    convo = db.get(Conversation, conversation_id)
    if convo:
        convo.updated_at = datetime.now(timezone.utc)
    db.flush()
    members = db.scalars(
        select(ConversationMember).where(ConversationMember.conversation_id == conversation_id, ConversationMember.left_at.is_(None))
    )
    now = datetime.now(timezone.utc)
    for member in members:
        db.add(
            MessageReceipt(
                message_id=message.id,
                user_id=member.user_id,
                delivered_at=now if member.user_id == sender_id else None,
                read_at=now if member.user_id == sender_id else None,
            )
        )
    db.commit()
    return _load_message(db, message.id)


def mark_delivered(db: Session, message_id: int, user_id: int) -> Message:
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    ensure_member(db, message.conversation_id, user_id)
    receipt = db.scalar(select(MessageReceipt).where(MessageReceipt.message_id == message_id, MessageReceipt.user_id == user_id))
    if receipt is None:
        receipt = MessageReceipt(message_id=message_id, user_id=user_id)
        db.add(receipt)
    receipt.delivered_at = receipt.delivered_at or datetime.now(timezone.utc)
    message.status = "delivered"
    db.commit()
    return _load_message(db, message_id)


def mark_read(db: Session, message_id: int, user_id: int) -> Message:
    message = mark_delivered(db, message_id, user_id)
    receipt = db.scalar(select(MessageReceipt).where(MessageReceipt.message_id == message_id, MessageReceipt.user_id == user_id))
    if receipt:
        receipt.read_at = receipt.read_at or datetime.now(timezone.utc)
    message.status = "read"
    db.commit()
    return _load_message(db, message_id)


def mark_conversation_read(db: Session, conversation_id: int, user_id: int, through_message_id: int | None = None) -> list[Message]:
    ensure_member(db, conversation_id, user_id)
    query = select(Message).where(Message.conversation_id == conversation_id, Message.sender_id != user_id)
    if through_message_id:
        query = query.where(Message.id <= through_message_id)
    messages = list(db.scalars(query))
    updated: list[Message] = []
    for message in messages:
        receipt = db.scalar(select(MessageReceipt).where(MessageReceipt.message_id == message.id, MessageReceipt.user_id == user_id))
        if receipt and receipt.read_at is None:
            receipt.delivered_at = receipt.delivered_at or datetime.now(timezone.utc)
            receipt.read_at = datetime.now(timezone.utc)
            message.status = "read"
            updated.append(message)
    db.commit()
    return [_load_message(db, message.id) for message in updated]


def react(db: Session, message_id: int, user_id: int, emoji: str) -> Message:
    message = db.get(Message, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    ensure_member(db, message.conversation_id, user_id)
    existing = db.scalar(select(MessageReaction).where(MessageReaction.message_id == message_id, MessageReaction.user_id == user_id, MessageReaction.emoji == emoji))
    if existing:
        db.delete(existing)
    else:
        db.add(MessageReaction(message_id=message_id, user_id=user_id, emoji=emoji))
    db.commit()
    return _load_message(db, message_id)
