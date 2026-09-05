from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud import drop as drop_crud
from app.schemas.drop import DropCreate, DropOut, DropUpdate

router = APIRouter(prefix="/drops", tags=["drops"])


@router.post("", response_model=DropOut, status_code=201)
def create_drop(payload: DropCreate, db: Session = Depends(get_db)):
    return drop_crud.create_drop(db, payload)


@router.get("/{share_code}", response_model=DropOut)
def get_drop(share_code: str, db: Session = Depends(get_db)):
    drop = drop_crud.get_drop_by_share_code(db, share_code)
    if drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")
    drop_crud.mark_viewed(db, drop)
    return drop


@router.patch("/{share_code}", response_model=DropOut)
def update_drop(share_code: str, payload: DropUpdate, db: Session = Depends(get_db)):
    drop = drop_crud.get_drop_by_share_code(db, share_code)
    if drop is None:
        raise HTTPException(status_code=404, detail="Drop not found")
    return drop_crud.set_selected_gift(db, drop, payload.selected_gift_id)
