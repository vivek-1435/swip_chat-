from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.auth import LoginRequest, OTPRequest, RegisterRequest, TokenResponse
from ..schemas.user import UserPublic
from ..services import auth_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserPublic)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    return auth_service.register(db, payload)


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    token, user = auth_service.verify_otp(db, payload.username, payload.otp)
    return TokenResponse(access_token=token, user=user, message="Mock OTP verified")


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    token, user = auth_service.login(db, payload)
    return TokenResponse(access_token=token, user=user)


@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out"}


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return user
