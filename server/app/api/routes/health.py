from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.dependencies import get_db

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
    session.execute(text("SELECT 1"))

    return {
        "status": "ready",
        "database": "ok",
    }