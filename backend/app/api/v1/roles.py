from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.role import RoleCreate, RoleRead, RoleUpdate
from app.services.role_service import RoleService

router = APIRouter(prefix="/roles", tags=["roles"])


def get_role_service(db: Session = Depends(get_db)) -> RoleService:
    return RoleService(db)


@router.get("/", response_model=list[RoleRead])
def list_roles(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_roles("superadmin")),
    service: RoleService = Depends(get_role_service),
) -> list[RoleRead]:
    return service.list_roles(skip=skip, limit=limit)


@router.get("/{role_id}", response_model=RoleRead)
def get_role(
    role_id: int,
    current_user: User = Depends(require_roles("superadmin")),
    service: RoleService = Depends(get_role_service),
) -> RoleRead:
    return service.get_role(role_id)


@router.post("/", response_model=RoleRead, status_code=status.HTTP_201_CREATED)
def create_role(
    payload: RoleCreate,
    current_user: User = Depends(require_roles("superadmin")),
    service: RoleService = Depends(get_role_service),
) -> RoleRead:
    return service.create_role(payload)


@router.put("/{role_id}", response_model=RoleRead)
def update_role(
    role_id: int,
    payload: RoleUpdate,
    current_user: User = Depends(require_roles("superadmin")),
    service: RoleService = Depends(get_role_service),
) -> RoleRead:
    return service.update_role(role_id, payload)


@router.delete("/{role_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_role(
    role_id: int,
    current_user: User = Depends(require_roles("superadmin")),
    service: RoleService = Depends(get_role_service),
) -> Response:
    service.delete_role(role_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
