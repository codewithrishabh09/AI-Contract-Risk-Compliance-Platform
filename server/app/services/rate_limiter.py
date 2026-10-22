from __future__ import annotations

import time

from redis import Redis


class RateLimitExceeded(Exception):
    """Raised when a client exceeds the configured request limit."""


class RateLimiter:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client

    def check(
        self,
        *,
        key: str,
        limit: int,
        window_seconds: int = 60,
    ) -> tuple[int, int]:
        current_window = int(time.time()) // window_seconds

        redis_key = f"rate-limit:{key}:{current_window}"

        current_count = self.redis.incr(redis_key)

        if current_count == 1:
            self.redis.expire(redis_key, window_seconds + 2)

        remaining = max(0, limit - current_count)

        if current_count > limit:
            raise RateLimitExceeded()

        return remaining, window_seconds