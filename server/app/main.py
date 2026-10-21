from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.version_analysis import (
    router as version_analysis_router,
)
from app.api.v1.findings import router as findings_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.auth import router as auth_router
from app.api.v1.contracts import router as contracts_router
from app.api.v1.rag import router as rag_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    yield


app = FastAPI(
    title="AI Contract Intelligence Platform",
    description=(
        "Backend API for contract management, document processing, "
        "risk analysis, and compliance intelligence."
    ),
    version="0.1.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Check whether the API application is running."""
    return {
        "status": "healthy",
        "service": "ai-contract-intelligence",
    }


app.include_router(
    auth_router,
    prefix="/api/v1",
)

app.include_router(
    contracts_router,
    prefix="/api/v1",
)

app.include_router(
    rag_router,
    prefix="/api/v1",
)

app.include_router(
    analysis_router,
    prefix="/api/v1",
)

app.include_router(
    jobs_router,
    prefix="/api/v1",
)

app.include_router(
    dashboard_router,
    prefix="/api/v1",
)

app.include_router(
    findings_router,
    prefix="/api/v1",
)

app.include_router(
    version_analysis_router,
    prefix="/api/v1",
)