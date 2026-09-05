import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.gift import GiftOut


class DropCreate(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    age: int = Field(ge=1, le=120)
    message: str = Field(min_length=1, max_length=240)
    theme_key: str = "star"
    photo_url: str | None = None
    memory_photo_url_1: str | None = None
    memory_photo_url_2: str | None = None
    memory_photo_url_3: str | None = None
    created_by_email: str | None = None


class DropUpdate(BaseModel):
    selected_gift_id: str | None = None


class DropOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    share_code: str
    name: str
    age: int
    message: str
    theme_key: str
    photo_url: str | None
    memory_photo_url_1: str | None
    memory_photo_url_2: str | None
    memory_photo_url_3: str | None
    selected_gift: GiftOut | None = None
    created_at: datetime
    viewed_at: datetime | None
