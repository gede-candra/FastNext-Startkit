"""Import SQLAlchemy models here so Alembic can detect metadata."""
from app.models.role import Role
from app.models.user import User

__all__ = ["Role", "User"]
