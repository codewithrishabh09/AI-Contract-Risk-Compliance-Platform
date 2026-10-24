from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


async def internal_server_error_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)

    logger.exception(
        "unhandled_exception",
        extra={
            "request_id": request_id,
            "path": request.url.path,
            "method": request.method,
        },
    )

    headers = {"X-Request-ID": request_id} if request_id else None

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error.",
            "request_id": request_id,
        },
        headers=headers,
    )


# Backward-compatible name, so the existing import in app/main.py still works.
unhandled_exception_handler = internal_server_error_handler


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(
        Exception,
        internal_server_error_handler,
    )