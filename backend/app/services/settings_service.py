from ..schemas.settings import SettingsPublic, SettingsUpdate


def get_settings_snapshot() -> SettingsPublic:
    return SettingsPublic()


def preview_settings_update(payload: SettingsUpdate) -> SettingsPublic:
    current = SettingsPublic()
    data = current.model_dump()
    update = payload.model_dump(exclude_unset=True, exclude_none=True)
    for section, values in update.items():
        data[section].update(values)
    return SettingsPublic(**data)
