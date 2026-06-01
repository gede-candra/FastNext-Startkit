from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.role import Role
from app.schemas.role import RoleCreate, RoleUpdate


class RoleRepository:
    def __init__(self, db: Session) -> None:
        self.db = db

    def list(self, *, skip: int = 0, limit: int = 100) -> list[Role]:
        statement = select(Role).offset(skip).limit(limit).order_by(Role.id)
        return list(self.db.scalars(statement).all())

    def get(self, role_id: int) -> Role | None:
        return self.db.get(Role, role_id)

    def get_by_name(self, name: str) -> Role | None:
        statement = select(Role).where(Role.name == name)
        return self.db.scalar(statement)

    def create(self, data: RoleCreate) -> Role:
        role = Role(**data.model_dump())
        self.db.add(role)
        self.db.commit()
        self.db.refresh(role)
        return role

    def update(self, role: Role, data: RoleUpdate) -> Role:
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(role, field, value)

        self.db.commit()
        self.db.refresh(role)
        return role

    def delete(self, role: Role) -> None:
        self.db.delete(role)
        self.db.commit()
