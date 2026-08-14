from pydantic import BaseModel


class PrivacySettings(BaseModel):
    read_receipts: bool = True
    typing_indicators: bool = True
    online_status: bool = True


class NotificationSettings(BaseModel):
    message_notifications: bool = True
    group_notifications: bool = True


class AppearanceSettings(BaseModel):
    theme: str = "system"
    dark_mode: bool = False


class SettingsPublic(BaseModel):
    privacy: PrivacySettings = PrivacySettings()
    notifications: NotificationSettings = NotificationSettings()
    appearance: AppearanceSettings = AppearanceSettings()
    placeholders: list[str] = [
        "Voice Calls",
        "Video Calls",
        "Stories",
        "Linked Devices",
        "Real End-to-End Encryption",
    ]
    encryption_notice: str = "Encryption is simulated for this assignment. This project does not provide production-grade end-to-end security."


class SettingsUpdate(BaseModel):
    privacy: PrivacySettings | None = None
    notifications: NotificationSettings | None = None
    appearance: AppearanceSettings | None = None
