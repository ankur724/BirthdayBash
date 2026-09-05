"""Seed the gift catalog. Run with: python -m app.seed"""

from app.db.all_models import Base
from app.db.session import SessionLocal, engine
from app.models.gift import Gift

GIFTS = [
    dict(id="iphone", name="iPhone 16 Pro Max", price=134900, mrp=149900, rating="4.8", reviews="12.4k", tag="Bestseller", icon_key="smartphone"),
    dict(id="macbook", name="MacBook Pro M4", price=249900, mrp=269900, rating="4.9", reviews="6.1k", tag=None, icon_key="laptop"),
    dict(id="ps5", name="PS5 + 5 games", price=64990, mrp=74990, rating="4.7", reviews="9.8k", tag="Deal", icon_key="gamepad2"),
    dict(id="tesla", name="Tesla Model 3", price=3499000, mrp=3699000, rating="4.9", reviews="820", tag="Trending", icon_key="car"),
    dict(id="rolex", name="Rolex Submariner", price=950000, mrp=999000, rating="4.9", reviews="1.1k", tag=None, icon_key="watch"),
    dict(id="maldives", name="Trip to Maldives", price=350000, mrp=399000, rating="4.8", reviews="3.4k", tag=None, icon_key="plane"),
    dict(id="lv", name="Louis Vuitton bag", price=280000, mrp=305000, rating="4.7", reviews="2.2k", tag=None, icon_key="shopping-bag"),
    dict(id="pc", name="Gaming PC setup", price=180000, mrp=199000, rating="4.6", reviews="5.6k", tag="Deal", icon_key="monitor"),
]


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for data in GIFTS:
            if db.get(Gift, data["id"]) is None:
                db.add(Gift(**data))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print(f"Seeded {len(GIFTS)} gifts.")
