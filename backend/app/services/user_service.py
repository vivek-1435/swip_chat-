from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from ..models import User
from ..schemas.user import UserUpdate


def search_users(db: Session, q: str, current_user_id: int) -> list[User]:
    stmt = select(User).where(User.id != current_user_id)
    if q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(User.username.ilike(term), User.display_name.ilike(term), User.phone.ilike(term)))
    
    return list(db.scalars(stmt.limit(20)))


def update_profile(db: Session, user: User, payload: UserUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user
