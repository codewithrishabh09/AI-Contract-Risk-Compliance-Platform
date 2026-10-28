import uuid
from collections.abc import Callable
from enum import Enum
from typing import Annotated, Any

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from redis.exceptions import RedisError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.permissions import (
    Permission,
    ROLE_PERMISSIONS,
)
from app.core.redis import redis_client
from app.core.security.jwt import decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.services.rate_limiter import RateLimitExceeded, RateLimiter

security = HTTPBearer(
    auto_error=True,
)

DatabaseSession = Annotated[
    Session,
    Depends(get_db),
]


def get_current_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials,
        Depends(security),
    ],
    session: DatabaseSession,
) -> User:
    """
    Validate the Bearer JWT and return the authenticated user.
    """

    token = credentials.credentials

    try:
        payload = decode_access_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user_id = payload.get("sub")
    organization_id = payload.get("org")

    if not user_id or not organization_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        parsed_user_id = uuid.UUID(user_id)
        parsed_organization_id = uuid.UUID(organization_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = UserRepository.get_by_id(
        session,
        parsed_user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.organization_id != parsed_organization_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is not active.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


CurrentUser = Annotated[
    User,
    Depends(get_current_user),
]


def _role_name(role: Any) -> str:
    """Normalize a role (str or Enum) to an upper-case string."""
    if isinstance(role, Enum):
        role = role.value
    return str(role).strip().upper()


def require_roles(*allowed_roles: str) -> Callable[..., Any]:
    """
    Create a dependency that allows access only to users
    with one of the specified roles.
    """

    normalized_roles = {
        role.strip().upper()
        for role in allowed_roles
    }

    def role_checker(
        current_user: CurrentUser,
    ) -> User:
        if _role_name(current_user.role) not in normalized_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )

        return current_user

    return role_checker


def _permissions_for_role(role: Any) -> set:
    """
    Look up permissions for a role regardless of key style in
    ROLE_PERMISSIONS (enum, lower-case, or upper-case string).
    """
    direct = ROLE_PERMISSIONS.get(role)
    if direct is not None:
        return direct

    target = _role_name(role)
    for key, permissions in ROLE_PERMISSIONS.items():
        if _role_name(key) == target:
            return permissions

    return set()


def require_permissions(
    *required_permissions: Permission,
):
    """
    Create a dependency that allows access only to users whose role
    grants ALL of the required permissions.

    Flow: JWT -> CurrentUser -> role -> ROLE_PERMISSIONS -> permission check
    """

    def dependency(
        current_user: CurrentUser,
    ) -> User:
        user_permissions = _permissions_for_role(current_user.role)

        if not all(
            permission in user_permissions
            for permission in required_permissions
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions.",
            )

        return current_user

    return dependency


rate_limiter = RateLimiter(redis_client)


def get_client_identifier(request: Request) -> str:
    forwarded_for = request.headers.get("X-Forwarded-For")

    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    return request.client.host if request.client else "unknown"


def rate_limit(
    *,
    limit: int,
    window_seconds: int = 60,
):
    async def dependency(request: Request) -> None:
        # Bypass rate limiting completely in test environment
        if settings.environment == "test":
            request.state.rate_limit_remaining = limit
            request.state.rate_limit_limit = limit
            return

        identifier = get_client_identifier(request)

        try:
            remaining, _ = rate_limiter.check(
                key=identifier,
                limit=limit,
                window_seconds=window_seconds,
            )

            request.state.rate_limit_remaining = remaining
            request.state.rate_limit_limit = limit

        except RateLimitExceeded as exc:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={
                    "Retry-After": str(window_seconds),
                },
            ) from exc

        except RedisError:
            # Redis outage should not take down the entire API.
            request.state.rate_limit_remaining = limit
            request.state.rate_limit_limit = limit

    return dependency