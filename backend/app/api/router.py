from fastapi import APIRouter

from app.api.routes import drops, gifts, uploads

api_router = APIRouter()
api_router.include_router(drops.router)
api_router.include_router(gifts.router)
api_router.include_router(uploads.router)
