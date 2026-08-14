from fastapi import APIRouter, Depends
from ..auth.dependencies import get_current_user
from ..models import User
from ..schemas.settings import SettingsPublic, SettingsUpdate
from ..services import settings_service

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("", response_model=SettingsPublic)
def settings(_: User = Depends(get_current_user)):
    return settings_service.get_settings_snapshot()


@router.patch("", response_model=SettingsPublic)
def update_settings(payload: SettingsUpdate, _: User = Depends(get_current_user)):
    return settings_service.preview_settings_update(payload)
