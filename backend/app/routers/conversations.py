from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.conversation import ConversationMemberPublic, ConversationPublic, DirectConversationCreate
from ..schemas.message import MessageCreate, MessagePublic
from ..services import conversation_service, message_service

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


@router.get("", response_model=list[ConversationPublic])
def conversations(q: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return conversation_service.list_conversations(db, current_user.id, q)


@router.post("/direct", response_model=ConversationPublic)
def direct(payload: DirectConversationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return conversation_service.create_or_get_direct(db, current_user.id, payload.user_id)


@router.get("/{conversation_id}", response_model=ConversationPublic)
def get_conversation(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return conversation_service.get_conversation(db, conversation_id, current_user.id)


@router.get("/{conversation_id}/members", response_model=list[ConversationMemberPublic])
def members(conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return conversation_service.get_conversation(db, conversation_id, current_user.id).members


@router.get("/{conversation_id}/messages", response_model=list[MessagePublic])
def messages(
    conversation_id: int,
    limit: int = 50,
    before_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return message_service.list_messages(db, conversation_id, current_user.id, limit, before_id)


@router.post("/{conversation_id}/messages", response_model=MessagePublic)
def create_message(conversation_id: int, payload: MessageCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return message_service.create_message(db, conversation_id, current_user.id, payload)
