from __future__ import annotations

from contextvars import ContextVar

_request_id_ctx: ContextVar[str | None] = ContextVar(
    "request_id",
    default=None,
)


def set_request_id(request_id: str) -> None:
    """Store the current request's ID in the async context."""
    _request_id_ctx.set(request_id)


def get_request_id() -> str | None:
    """Return the current request's ID, or None outside a request."""
    return _request_id_ctx.get()