from pydantic import BaseModel, ConfigDict


class GiftOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    price: float
    mrp: float
    rating: str
    reviews: str
    tag: str | None
    icon_key: str
