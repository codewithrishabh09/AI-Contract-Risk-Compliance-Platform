from __future__ import annotations

from typing import Final

from fastapi import HTTPException, status


SAFE_HTTP_METHODS: Final[set[str]] = {
    "GET",
    "HEAD",
    "OPTIONS",
}

SECURITY_HEADERS: Final[dict[str, str]] = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": (
        "camera=(), microphone=(), geolocation=(), payment=()"
    ),
    "Content-Security-Policy": (
        "default-src 'self'; "
        "frame-ancestors 'none'; "
        "object-src 'none'; "
        "base-uri 'self'"
    ),
}


def raise_unauthorized(detail: str = "Authentication required.") -> None:
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )