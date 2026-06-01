import hmac
from collections.abc import Callable

from fastapi import Cookie, Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    access_token: str | None = Cookie(default=None, alias=settings.auth_cookie_name),
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    token = _get_request_token(credentials, access_token)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject.isdigit():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )

    user = UserRepository(db).get(int(subject))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is inactive",
        )

    return user


def require_csrf_token(
    access_token: str | None = Cookie(default=None, alias=settings.auth_cookie_name),
    x_csrf_token: str | None = Header(default=None, alias="X-CSRF-Token"),
) -> None:
    if access_token is None:
        return

    payload = decode_access_token(access_token)
    expected_token = payload.get("csrf") if payload else None
    if not isinstance(expected_token, str) or not x_csrf_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="CSRF token required",
        )
    if not secrets_compare(expected_token, x_csrf_token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid CSRF token",
        )


def require_roles(*role_names: str) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        current_role = current_user.role.name if current_user.role else None
        if current_role not in role_names:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        return current_user

    return dependency


def _get_request_token(
    credentials: HTTPAuthorizationCredentials | None,
    access_token: str | None,
) -> str | None:
    if credentials is not None and credentials.scheme.lower() == "bearer":
        return credentials.credentials
    return access_token


def secrets_compare(left: str, right: str) -> bool:
    return hmac.compare_digest(left, right)
