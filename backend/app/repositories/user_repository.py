from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


class UserRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self, *, skip: int = 0, limit: int = 100) -> list[User]:
        statement = (
            select(User)
            .options(selectinload(User.role))
            .offset(skip)
            .limit(limit)
            .order_by(User.id)
        )
        return list(self.db.scalars(statement).all())

    def count(self) -> int:
        statement = select(func.count()).select_from(User)
        return self.db.scalar(statement) or 0

    def count_with_password(self) -> int:
        statement = select(func.count()).select_from(User).where(User.password != "")
        return self.db.scalar(statement) or 0

    def get(self, user_id: int) -> User | None:
        statement = select(User).options(selectinload(User.role)).where(User.id == user_id)
        return self.db.scalar(statement)

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.db.scalar(statement)

    def create(self, data: UserCreate, password_hash: str) -> User:
        payload = data.model_dump(exclude={"password"})
        payload["password"] = password_hash
        user = User(**payload)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return self.get(user.id) or user

    def update(self, user: User, data: UserUpdate, password_hash: str | None = None) -> User:
        for field, value in data.model_dump(exclude_unset=True, exclude={"password"}).items():
            setattr(user, field, value)
        if password_hash is not None:
            user.password = password_hash

        self.db.commit()
        self.db.refresh(user)
        return self.get(user.id) or user

    def delete(self, user: User) -> None:
        self.db.delete(user)
        self.db.commit()
