from __future__ import annotations

from redis import Redis

from app.core.config import settings


redis_client = Redis.from_url(
    settings.redis_url,
    decode_responses=True,
    socket_connect_timeout=2,
    socket_timeout=2,
)


def check_redis_connection() -> bool:
    try:
        return bool(redis_client.ping())
    except Exception:
        return False