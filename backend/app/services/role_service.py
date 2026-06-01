from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.role import Role
from app.repositories.role_repository import RoleRepository
from app.schemas.role import RoleCreate, RoleUpdate


class RoleService:
    def __init__(self, db: Session) -> None:
        self.repository = RoleRepository(db)

    def list_roles(self, *, skip: int = 0, limit: int = 100) -> list[Role]:
        return self.repository.list(skip=skip, limit=limit)

    def get_role(self, role_id: int) -> Role:
        role = self.repository.get(role_id)
        if role is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Role not found",
            )
        return role

    def create_role(self, data: RoleCreate) -> Role:
        existing = self.repository.get_by_name(data.name)
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Role name already exists",
            )

        return self.repository.create(data)

    def update_role(self, role_id: int, data: RoleUpdate) -> Role:
        role = self.get_role(role_id)
        if data.name is not None:
            existing = self.repository.get_by_name(data.name)
            if existing is not None and existing.id != role.id:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Role name already exists",
                )

        return self.repository.update(role, data)

    def delete_role(self, role_id: int) -> None:
        role = self.get_role(role_id)
        self.repository.delete(role)
