from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.conversation import ConversationPublic, GroupCreate, GroupMemberAdd, GroupMemberUpdate, GroupUpdate
from ..services import group_service

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.post("", response_model=ConversationPublic)
def create_group(payload: GroupCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.create_group(db, current_user.id, payload.name, payload.avatar_url, payload.member_ids)


@router.patch("/{group_id}", response_model=ConversationPublic)
def update_group(group_id: int, payload: GroupUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.update_group(db, group_id, current_user.id, payload.name, payload.avatar_url)


@router.post("/{group_id}/members", response_model=ConversationPublic)
def add_member(group_id: int, payload: GroupMemberAdd, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.add_group_member(db, group_id, current_user.id, payload.user_id)


@router.delete("/{group_id}/members/{user_id}", response_model=ConversationPublic)
def remove_member(group_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.remove_group_member(db, group_id, current_user.id, user_id)


@router.patch("/{group_id}/members/{user_id}", response_model=ConversationPublic)
def update_member_role(group_id: int, user_id: int, payload: GroupMemberUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return group_service.update_group_member_role(db, group_id, current_user.id, user_id, payload.role)

@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_group(group_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    group_service.delete_group(db, group_id, current_user.id)
    return None
