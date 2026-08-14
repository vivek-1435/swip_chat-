from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session
from ..auth.jwt import create_access_token
from ..auth.password import hash_password, verify_password
from ..config import get_settings
from ..models import User
from ..schemas.auth import LoginRequest, RegisterRequest


def register(db: Session, payload: RegisterRequest) -> User:
    clauses = [User.username == payload.username]
    if payload.phone:
        clauses.append(User.phone == payload.phone)
    existing = db.scalar(select(User).where(or_(*clauses)))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username or phone already exists")
    user = User(
        username=payload.username,
        phone=payload.phone,
        display_name=payload.display_name,
        avatar_url=payload.avatar_url,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def verify_otp(db: Session, username: str, otp: str) -> tuple[str, User]:
    if otp != get_settings().mock_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid mock OTP")
    user = db.scalar(select(User).where(User.username == username))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return create_access_token(user.id), user


def login(db: Session, payload: LoginRequest) -> tuple[str, User]:
    user = db.scalar(select(User).where(or_(User.username == payload.identifier, User.phone == payload.identifier)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_verified:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Please verify the mock OTP first")
    return create_access_token(user.id), user
