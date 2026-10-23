from __future__ import annotations

import logging
import time

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.request_context import get_request_id


logger = logging.getLogger("api.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()

        response = None

        try:
            response = await call_next(request)
            return response

        finally:
            duration_ms = round(
                (time.perf_counter() - start_time) * 1000,
                2,
            )

            client_host = (
                request.client.host
                if request.client
                else "-"
            )

            status_code = (
                response.status_code
                if response is not None
                else 500
            )

            logger.info(
                "request_completed "
                "request_id=%s method=%s path=%s "
                "status=%s duration_ms=%s client=%s",
                get_request_id(),
                request.method,
                request.url.path,
                status_code,
                duration_ms,
                client_host,
            )