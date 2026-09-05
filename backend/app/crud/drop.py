import secrets
import string
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.drop import Drop
from app.schemas.drop import DropCreate

ALPHABET = string.ascii_lowercase + string.digits


def _generate_share_code(db: Session, length: int = 6) -> str:
    while True:
        code = "".join(secrets.choice(ALPHABET) for _ in range(length))
        exists = db.scalar(select(Drop).where(Drop.share_code == code))
        if not exists:
            return code


def create_drop(db: Session, payload: DropCreate) -> Drop:
    drop = Drop(
        share_code=_generate_share_code(db),
        name=payload.name,
        age=payload.age,
        message=payload.message,
        theme_key=payload.theme_key,
        photo_url=payload.photo_url,
        memory_photo_url_1=payload.memory_photo_url_1,
        memory_photo_url_2=payload.memory_photo_url_2,
        memory_photo_url_3=payload.memory_photo_url_3,
        created_by_email=payload.created_by_email,
    )
    db.add(drop)
    db.commit()
    db.refresh(drop)
    return drop


def get_drop_by_share_code(db: Session, share_code: str) -> Drop | None:
    return db.scalar(select(Drop).where(Drop.share_code == share_code))


def set_selected_gift(db: Session, drop: Drop, gift_id: str | None) -> Drop:
    drop.selected_gift_id = gift_id
    db.add(drop)
    db.commit()
    db.refresh(drop)
    return drop


def mark_viewed(db: Session, drop: Drop) -> Drop:
    if drop.viewed_at is None:
        drop.viewed_at = datetime.now(timezone.utc)
        db.add(drop)
        db.commit()
        db.refresh(drop)
    return drop
