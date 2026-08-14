from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.message import MessagePublic, ReactionCreate
from ..services import message_service

router = APIRouter(prefix="/api/messages", tags=["messages"])


@router.post("/{message_id}/delivered", response_model=MessagePublic)
def delivered(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return message_service.mark_delivered(db, message_id, current_user.id)


@router.post("/{message_id}/read", response_model=MessagePublic)
def read(message_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return message_service.mark_read(db, message_id, current_user.id)


@router.post("/{message_id}/reactions", response_model=MessagePublic)
def reaction(message_id: int, payload: ReactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return message_service.react(db, message_id, current_user.id, payload.emoji)
