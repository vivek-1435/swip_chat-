from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..auth.dependencies import get_current_user
from ..database import get_db
from ..models import User
from ..schemas.contact import ContactCreate, ContactPublic
from ..services import contact_service

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


@router.get("", response_model=list[ContactPublic])
def contacts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return contact_service.list_contacts(db, current_user.id)


@router.post("", response_model=ContactPublic)
def add_contact(payload: ContactCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return contact_service.add_contact(db, current_user.id, payload.contact_user_id, payload.saved_name)


@router.delete("/{user_id}")
def remove_contact(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    contact_service.remove_contact(db, current_user.id, user_id)
    return {"success": True, "message": "Contact removed"}
