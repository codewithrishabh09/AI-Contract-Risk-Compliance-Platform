from __future__ import annotations

import logging
from typing import Any

from app.core.request_context import get_request_id


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)


def log_event(
    logger: logging.Logger,
    event: str,
    **fields: Any,
) -> None:
    context = {
        "event": event,
        "request_id": get_request_id(),
        **fields,
    }

    formatted = " ".join(
        f"{key}={value}"
        for key, value in context.items()
    )

    logger.info(formatted)