from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.user import UserPublic, UserUpdate
from ..services import user_service

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/search", response_model=list[UserPublic])
def search(q: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return user_service.search_users(db, q, current_user.id)


@router.get("/{user_id}", response_model=UserPublic)
def get_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/me", response_model=UserPublic)
def update_me(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return user_service.update_profile(db, current_user, payload)
