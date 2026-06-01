from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_csrf_token
from app.core.config import settings
from app.core.security import verify_password
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AuthSessionResponse, BootstrapRequest, LoginRequest
from app.schemas.user import UserRead, UserProfileUpdate, UserUpdate
from app.services.auth_service import AuthService
from app.services.user_service import UserService

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    return AuthService(db)


def get_user_service(db: Session = Depends(get_db)) -> UserService:
    return UserService(db)


@router.post("/login", response_model=AuthSessionResponse)
def login(
    payload: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
) -> AuthSessionResponse:
    access_token, user, csrf_token = service.authenticate(payload.email, payload.password)
    _set_auth_cookies(response, access_token, csrf_token)
    return AuthSessionResponse(user=user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    _clear_auth_cookies(response)


@router.post("/bootstrap", response_model=UserRead)
def bootstrap_superadmin(
    payload: BootstrapRequest,
    service: AuthService = Depends(get_auth_service),
) -> UserRead:
    return service.bootstrap_superadmin(payload)


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@router.patch("/me", response_model=UserRead)
def update_me(
    payload: UserProfileUpdate,
    _: None = Depends(require_csrf_token),
    current_user: User = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserRead:
    if payload.password is not None and not verify_password(
        payload.current_password or "",
        current_user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Password lama tidak sesuai.",
        )

    update_payload = UserUpdate(
        **payload.model_dump(exclude_unset=True, exclude={"current_password"})
    )
    return service.update_user(current_user.id, update_payload)


def _set_auth_cookies(response: Response, access_token: str, csrf_token: str) -> None:
    max_age = settings.access_token_expire_minutes * 60
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=access_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=max_age,
        path="/",
    )
    response.set_cookie(
        key=settings.csrf_cookie_name,
        value=csrf_token,
        httponly=False,
        secure=settings.auth_cookie_secure,
        samesite=settings.auth_cookie_samesite,
        max_age=max_age,
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(key=settings.auth_cookie_name, path="/")
    response.delete_cookie(key=settings.csrf_cookie_name, path="/")
