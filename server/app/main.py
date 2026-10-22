from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.routes.health import router as health_router
from app.api.v1.version_analysis import (
    router as version_analysis_router,
)
from app.api.v1.audit import router as audit_router
from app.api.v1.findings import router as findings_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.auth import router as auth_router
from app.api.v1.contracts import router as contracts_router
from app.api.v1.rag import router as rag_router
from app.core.config import settings
from app.core.security import SECURITY_HEADERS
from app.core.exceptions import unhandled_exception_handler


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
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.middleware("http")
async def security_headers_middleware(
    request: Request,
    call_next,
) -> Response:
    """Attach security headers to every API response."""
    response = await call_next(request)

    for header_name, header_value in SECURITY_HEADERS.items():
        response.headers[header_name] = header_value

    return response


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Check whether the API application is running."""
    return {
        "status": "healthy",
        "service": "ai-contract-intelligence",
    }


app.include_router(health_router)

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

app.include_router(
    audit_router,
    prefix="/api/v1",
)

app.add_exception_handler(
    Exception,
    unhandled_exception_handler,
)