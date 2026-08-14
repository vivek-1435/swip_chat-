from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from ..models import Contact, User


def list_contacts(db: Session, user_id: int) -> list[Contact]:
    return list(
        db.scalars(
            select(Contact)
            .options(joinedload(Contact.contact_user))
            .where(Contact.user_id == user_id)
            .order_by(Contact.created_at.desc())
        )
    )


def add_contact(db: Session, user_id: int, contact_user_id: int, saved_name: str | None = None) -> Contact:
    if user_id == contact_user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot add yourself")
    if db.get(User, contact_user_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    existing = db.scalar(select(Contact).where(Contact.user_id == user_id, Contact.contact_user_id == contact_user_id))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Contact already exists")
    contact = Contact(user_id=user_id, contact_user_id=contact_user_id, saved_name=saved_name)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return db.scalar(select(Contact).options(joinedload(Contact.contact_user)).where(Contact.id == contact.id))


def remove_contact(db: Session, user_id: int, contact_user_id: int) -> None:
    contact = db.scalar(select(Contact).where(Contact.user_id == user_id, Contact.contact_user_id == contact_user_id))
    if contact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    db.delete(contact)
    db.commit()
