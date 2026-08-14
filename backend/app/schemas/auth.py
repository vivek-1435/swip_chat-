from pydantic import BaseModel, Field
from .user import UserPublic


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    phone: str | None = Field(default=None, max_length=30)
    display_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)
    avatar_url: str | None = None


class OTPRequest(BaseModel):
    username: str
    otp: str


class LoginRequest(BaseModel):
    identifier: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
    message: str = "Authenticated"
