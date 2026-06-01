from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)


@router.get("/", response_model=list[UserRead])
def list_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_roles("superadmin")),
    service: UserService = Depends(get_user_service),
) -> list[UserRead]:
    return service.list_users(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserRead)
def get_user(
    user_id: int,
    current_user: User = Depends(require_roles("superadmin")),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    return service.get_user(user_id)


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    current_user: User = Depends(require_roles("superadmin")),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    return service.create_user(payload)


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: UserUpdate,
    current_user: User = Depends(require_roles("superadmin")),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    return service.update_user(user_id, payload)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_user: User = Depends(require_roles("superadmin")),
    service: UserService = Depends(get_user_service),
) -> Response:
    service.delete_user(user_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
