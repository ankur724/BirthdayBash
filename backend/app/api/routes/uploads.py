import time
import uuid
from pathlib import Path

from fastapi import APIRouter, UploadFile

router = APIRouter(prefix="/uploads", tags=["uploads"])

UPLOAD_DIR = Path(__file__).resolve().parents[3] / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Uploads are meant to be short-lived (just long enough for someone to open a
# shared drop) — sweep out anything older than this on every upload so the
# folder doesn't grow forever.
RETENTION_SECONDS = 1 * 24 * 60 * 60


def _sweep_expired_uploads() -> None:
    cutoff = time.time() - RETENTION_SECONDS
    for path in UPLOAD_DIR.iterdir():
        if path.is_file() and path.stat().st_mtime < cutoff:
            path.unlink(missing_ok=True)


@router.post("/photo")
async def upload_photo(file: UploadFile):
    _sweep_expired_uploads()
    ext = Path(file.filename or "").suffix or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(await file.read())
    return {"url": f"/static/uploads/{filename}"}
