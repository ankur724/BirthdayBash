from sqlalchemy import Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Gift(Base):
    __tablename__ = "gifts"

    id: Mapped[str] = mapped_column(String(40), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    price: Mapped[int] = mapped_column(Numeric(12, 2), nullable=False)
    mrp: Mapped[int] = mapped_column(Numeric(12, 2), nullable=False)
    rating: Mapped[str] = mapped_column(String(10), nullable=False)
    reviews: Mapped[str] = mapped_column(String(20), nullable=False)
    tag: Mapped[str | None] = mapped_column(String(40), nullable=True)
    icon_key: Mapped[str] = mapped_column(String(40), nullable=False)
