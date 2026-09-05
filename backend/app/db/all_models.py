"""Import every model so Base.metadata is fully populated.

Used by Alembic autogenerate and anywhere Base.metadata.create_all() is called
directly (e.g. app/seed.py). Regular request handling doesn't need this — routes
import the specific models they use.
"""

from app.db.base import Base  # noqa: F401
from app.models.drop import Drop  # noqa: F401
from app.models.gift import Gift  # noqa: F401
