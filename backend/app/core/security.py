import base64
import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from app.core.config import settings

PASSWORD_ALGORITHM = "pbkdf2_sha256"
PASSWORD_ITERATIONS = 260_000
TOKEN_ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PASSWORD_ITERATIONS,
    ).hex()
    return f"{PASSWORD_ALGORITHM}${PASSWORD_ITERATIONS}${salt}${password_hash}"


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False

    try:
        algorithm, iterations, salt, stored_hash = password_hash.split("$", 3)
    except ValueError:
        return False

    if algorithm != PASSWORD_ALGORITHM:
        return False

    candidate_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        int(iterations),
    ).hex()
    return hmac.compare_digest(candidate_hash, stored_hash)


def create_access_token(subject: str, extra_claims: dict[str, Any] | None = None) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": int(expires_at.timestamp()),
    }
    if extra_claims:
        payload.update(extra_claims)

    header = {"alg": TOKEN_ALGORITHM, "typ": "JWT"}
    signing_input = ".".join(
        [
            _base64url_encode_json(header),
            _base64url_encode_json(payload),
        ]
    )
    signature = _sign(signing_input)
    return f"{signing_input}.{signature}"


def decode_access_token(token: str) -> dict[str, Any] | None:
    parts = token.split(".")
    if len(parts) != 3:
        return None

    signing_input = ".".join(parts[:2])
    expected_signature = _sign(signing_input)
    if not hmac.compare_digest(expected_signature, parts[2]):
        return None

    payload = _base64url_decode_json(parts[1])
    if payload is None:
        return None

    expires_at = payload.get("exp")
    if not isinstance(expires_at, int):
        return None
    if datetime.now(timezone.utc).timestamp() >= expires_at:
        return None

    return payload


def _sign(value: str) -> str:
    digest = hmac.new(
        settings.auth_secret_key.encode("utf-8"),
        value.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return _base64url_encode(digest)


def _base64url_encode_json(value: dict[str, Any]) -> str:
    raw = json.dumps(value, separators=(",", ":"), sort_keys=True).encode("utf-8")
    return _base64url_encode(raw)


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _base64url_decode_json(value: str) -> dict[str, Any] | None:
    try:
        padding = "=" * (-len(value) % 4)
        raw = base64.urlsafe_b64decode(f"{value}{padding}")
        data = json.loads(raw)
    except (ValueError, json.JSONDecodeError):
        return None

    return data if isinstance(data, dict) else None
