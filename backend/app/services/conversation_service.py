from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy import and_, desc, func, select
from sqlalchemy.orm import Session, joinedload
from ..models import Conversation, ConversationMember, Message, MessageReceipt, User


def ensure_member(db: Session, conversation_id: int, user_id: int) -> ConversationMember:
    member = db.scalar(
        select(ConversationMember).where(
            ConversationMember.conversation_id == conversation_id,
            ConversationMember.user_id == user_id,
            ConversationMember.left_at.is_(None),
        )
    )
    if member is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not a member of this conversation")
    return member


def ensure_admin(db: Session, conversation_id: int, user_id: int) -> ConversationMember:
    member = ensure_member(db, conversation_id, user_id)
    if member.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required")
    return member


def _decorate(db: Session, conversation: Conversation, current_user_id: int) -> Conversation:
    last_message = db.scalar(
        select(Message)
        .where(Message.conversation_id == conversation.id, Message.deleted_at.is_(None))
        .order_by(Message.created_at.desc())
        .limit(1)
    )
    unread_count = db.scalar(
        select(func.count(Message.id))
        .join(MessageReceipt, MessageReceipt.message_id == Message.id)
        .where(
            Message.conversation_id == conversation.id,
            Message.sender_id != current_user_id,
            MessageReceipt.user_id == current_user_id,
            MessageReceipt.read_at.is_(None),
        )
    )
    conversation.last_message = last_message
    conversation.unread_count = unread_count or 0
    return conversation


def list_conversations(db: Session, user_id: int, q: str | None = None) -> list[Conversation]:
    rows = list(
        db.scalars(
            select(Conversation)
            .join(ConversationMember)
            .options(joinedload(Conversation.members).joinedload(ConversationMember.user))
            .where(ConversationMember.user_id == user_id, ConversationMember.left_at.is_(None))
            .order_by(desc(Conversation.updated_at))
        )
        .unique()
    )
    if q:
        needle = q.lower()
        rows = [
            c
            for c in rows
            if (c.name and needle in c.name.lower())
            or any(m.user_id != user_id and needle in m.user.display_name.lower() for m in c.members)
        ]
    return [_decorate(db, c, user_id) for c in rows]


def get_conversation(db: Session, conversation_id: int, user_id: int) -> Conversation:
    ensure_member(db, conversation_id, user_id)
    conversation = db.scalar(
        select(Conversation)
        .options(joinedload(Conversation.members).joinedload(ConversationMember.user))
        .where(Conversation.id == conversation_id)
        .execution_options(populate_existing=True)
    )
    if conversation is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return _decorate(db, conversation, user_id)


def create_or_get_direct(db: Session, current_user_id: int, other_user_id: int) -> Conversation:
    if current_user_id == other_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Choose another user")
    if db.get(User, other_user_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    candidates = db.scalars(
        select(Conversation)
        .join(ConversationMember)
        .where(Conversation.type == "direct", ConversationMember.user_id.in_([current_user_id, other_user_id]))
    ).unique()
    for convo in candidates:
        member_ids = {m.user_id for m in convo.members if m.left_at is None}
        if member_ids == {current_user_id, other_user_id}:
            return get_conversation(db, convo.id, current_user_id)
    convo = Conversation(type="direct", created_by=current_user_id)
    db.add(convo)
    db.flush()
    db.add_all(
        [
            ConversationMember(conversation_id=convo.id, user_id=current_user_id, role="member"),
            ConversationMember(conversation_id=convo.id, user_id=other_user_id, role="member"),
        ]
    )
    db.commit()
    return get_conversation(db, convo.id, current_user_id)


def create_group(db: Session, creator_id: int, name: str, avatar_url: str | None, member_ids: list[int]) -> Conversation:
    ids = sorted(set(member_ids + [creator_id]))
    users = db.scalars(select(User).where(User.id.in_(ids))).all()
    if len(users) != len(ids):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="One or more members were not found")
    convo = Conversation(type="group", name=name, avatar_url=avatar_url, created_by=creator_id)
    db.add(convo)
    db.flush()
    db.add_all(
        [
            ConversationMember(conversation_id=convo.id, user_id=user_id, role="admin" if user_id == creator_id else "member")
            for user_id in ids
        ]
    )
    db.commit()
    return get_conversation(db, convo.id, creator_id)


def update_group(db: Session, conversation_id: int, user_id: int, name: str | None, avatar_url: str | None) -> Conversation:
    ensure_admin(db, conversation_id, user_id)
    convo = db.get(Conversation, conversation_id)
    if convo is None or convo.type != "group":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    if name is not None:
        convo.name = name
    if avatar_url is not None:
        convo.avatar_url = avatar_url
    convo.updated_at = datetime.now(timezone.utc)
    db.commit()
    return get_conversation(db, conversation_id, user_id)


def add_group_member(db: Session, conversation_id: int, actor_id: int, user_id: int) -> Conversation:
    ensure_admin(db, conversation_id, actor_id)
    if db.get(User, user_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    existing = db.scalar(select(ConversationMember).where(ConversationMember.conversation_id == conversation_id, ConversationMember.user_id == user_id))
    if existing and existing.left_at is None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User is already a member")
    if existing:
        existing.left_at = None
    else:
        db.add(ConversationMember(conversation_id=conversation_id, user_id=user_id, role="member"))
    db.commit()
    return get_conversation(db, conversation_id, actor_id)


def remove_group_member(db: Session, conversation_id: int, actor_id: int, user_id: int) -> Conversation:
    ensure_admin(db, conversation_id, actor_id)
    member = ensure_member(db, conversation_id, user_id)
    if member.role == "admin" and member.user_id == actor_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Admins cannot remove themselves here")
    member.left_at = datetime.now(timezone.utc)
    db.commit()
    return get_conversation(db, conversation_id, actor_id)


def update_group_member_role(db: Session, conversation_id: int, actor_id: int, user_id: int, role: str) -> Conversation:
    ensure_admin(db, conversation_id, actor_id)
    member = ensure_member(db, conversation_id, user_id)
    if role not in ["admin", "member"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")
    member.role = role
    db.commit()
    return get_conversation(db, conversation_id, actor_id)


def delete_group(db: Session, conversation_id: int, actor_id: int) -> dict:
    ensure_admin(db, conversation_id, actor_id)
    convo = db.get(Conversation, conversation_id)
    if convo is None or convo.type != "group":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Group not found")
    db.delete(convo)
    db.commit()
    return {"success": True}
