from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt

from app.core.config import settings


def create_access_token(
    *,
    user_id: UUID,
    organization_id: UUID,
) -> str:
    """Create a JWT access token for an authenticated user."""

    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(
        minutes=settings.jwt_access_token_expire_minutes
    )

    payload = {
        "sub": str(user_id),
        "org": str(organization_id),
        "iat": now,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token."""

    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )