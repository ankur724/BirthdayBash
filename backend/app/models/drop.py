import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.gift import Gift


class Drop(Base):
    """A single birthday-surprise 'drop' created by a user and shared via a link."""

    __tablename__ = "drops"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    share_code: Mapped[str] = mapped_column(String(12), unique=True, index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(60), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    theme_key: Mapped[str] = mapped_column(String(20), nullable=False, default="star")
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    memory_photo_url_1: Mapped[str | None] = mapped_column(String(500), nullable=True)
    memory_photo_url_2: Mapped[str | None] = mapped_column(String(500), nullable=True)
    memory_photo_url_3: Mapped[str | None] = mapped_column(String(500), nullable=True)

    selected_gift_id: Mapped[str | None] = mapped_column(
        ForeignKey("gifts.id"), nullable=True
    )
    selected_gift: Mapped[Gift | None] = relationship("Gift", lazy="joined")

    created_by_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    viewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
