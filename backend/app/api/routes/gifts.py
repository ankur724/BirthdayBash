from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.gift import Gift
from app.schemas.gift import GiftOut

router = APIRouter(prefix="/gifts", tags=["gifts"])


@router.get("", response_model=list[GiftOut])
def list_gifts(db: Session = Depends(get_db)):
    return db.scalars(select(Gift)).all()
