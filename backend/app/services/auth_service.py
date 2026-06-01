import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import BootstrapRequest
from app.schemas.user import UserCreate


class AuthService:
    def __init__(self, db: Session) -> None:
        self.role_repository = RoleRepository(db)
        self.repository = UserRepository(db)

    def authenticate(self, email: str, password: str) -> tuple[str, User, str]:
        user = self.repository.get_by_email(email)
        if user is None or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is inactive",
            )

        full_user = self.repository.get(user.id) or user
        csrf_token = secrets.token_urlsafe(32)
        token = create_access_token(
            subject=str(user.id),
            extra_claims={
                "csrf": csrf_token,
                "role": full_user.role.name if full_user.role else None,
            },
        )
        return token, full_user, csrf_token

    def bootstrap_superadmin(self, data: BootstrapRequest) -> User:
        if self.repository.count_with_password() > 0:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bootstrap is only allowed before the first password user exists",
            )

        return self.create_superuser(data)

    def create_superuser(self, data: BootstrapRequest) -> User:
        role = self.role_repository.get_by_name("superadmin")
        if role is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Superadmin role does not exist",
            )
        if self.repository.get_by_email(data.email) is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already exists",
            )

        user_data = UserCreate(
            name=data.name,
            email=data.email,
            password=data.password,
            is_active=True,
            role_id=role.id,
        )
        return self.repository.create(user_data, hash_password(data.password))
