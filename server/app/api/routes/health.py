from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.core.redis import check_redis_connection

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "ai-contract-intelligence",
    }


@router.get("/ready")
def readiness_check(
    session: Session = Depends(get_db),
) -> dict[str, str]:
    database_ok = False

    try:
        session.execute(text("SELECT 1"))
        database_ok = True
    except Exception:
        database_ok = False

    redis_ok = check_redis_connection()

    if not database_ok or not redis_ok:
        return {
            "status": "not_ready",
            "database": "ok" if database_ok else "error",
            "redis": "ok" if redis_ok else "error",
        }

    return {
        "status": "ready",
        "database": "ok",
        "redis": "ok",
    }