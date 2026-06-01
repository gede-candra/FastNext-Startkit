from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import hash_password
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: Session) -> None:
        self.role_repository = RoleRepository(db)
        self.repository = UserRepository(db)

    def list_users(self, *, skip: int = 0, limit: int = 100) -> list[User]:
        return self.repository.list(skip=skip, limit=limit)

    def get_user(self, user_id: int) -> User:
        user = self.repository.get(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user

    def create_user(self, data: UserCreate) -> User:
        self._ensure_role_exists(data.role_id)
        self._ensure_email_available(data.email)
        return self.repository.create(data, hash_password(data.password))

    def update_user(self, user_id: int, data: UserUpdate) -> User:
        user = self.get_user(user_id)

        if data.role_id is not None:
            self._ensure_role_exists(data.role_id)
        if data.email is not None:
            self._ensure_email_available(data.email, current_user_id=user.id)

        password_hash = hash_password(data.password) if data.password is not None else None
        return self.repository.update(user, data, password_hash)

    def delete_user(self, user_id: int) -> None:
        user = self.get_user(user_id)
        self.repository.delete(user)

    def _ensure_role_exists(self, role_id: int) -> None:
        if self.role_repository.get(role_id) is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Role does not exist",
            )

    def _ensure_email_available(self, email: str, current_user_id: int | None = None) -> None:
        existing = self.repository.get_by_email(email)
        if existing is not None and existing.id != current_user_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )
