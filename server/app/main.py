from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

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
from app.core.logging import configure_logging
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.request_id import RequestIDMiddleware


# Swagger UI loads JS/CSS from a CDN and runs an inline script,
# so a strict Content-Security-Policy must be skipped on these paths.
DOCS_PATHS = ("/docs", "/redoc", "/openapi.json")

configure_logging()


OPENAPI_TAGS = [
    {
        "name": "Health",
        "description": "Service liveness and readiness checks.",
    },
    {
        "name": "Authentication",
        "description": "User registration, login and current-user lookup.",
    },
    {
        "name": "Contracts",
        "description": (
            "Create contracts, list them, and upload document versions."
        ),
    },
    {
        "name": "RAG",
        "description": (
            "Ask questions about a contract version. Answers are grounded "
            "in retrieved clauses and include validated citations."
        ),
    },
    {
        "name": "Contract Analysis",
        "description": (
            "Run AI risk analysis on a contract version and "
            "retrieve the findings."
        ),
    },
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    yield


app = FastAPI(
    title="AI Contract Intelligence API",
    description=(
        "Enterprise-grade AI Contract Intelligence platform for "
        "contract analysis, risk detection, compliance review, "
        "semantic search, and auditability.\n\n"
        "**Authentication:** call `POST /api/v1/auth/login`, then use "
        "the **Authorize** button with the returned access token."
    ),
    version="1.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=OPENAPI_TAGS,
    lifespan=lifespan,
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
    expose_headers=[
        "X-Request-ID",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
    ],
)


@app.middleware("http")
async def security_headers_middleware(
    request: Request,
    call_next,
) -> Response:
    """Attach security headers to every API response."""
    response = await call_next(request)

    is_docs = request.url.path.startswith(DOCS_PATHS)

    for header_name, header_value in SECURITY_HEADERS.items():
        if is_docs and header_name.lower() == "content-security-policy":
            continue
        response.headers[header_name] = header_value

    return response


@app.middleware("http")
async def rate_limit_headers_middleware(request, call_next):
    response = await call_next(request)

    limit = getattr(request.state, "rate_limit_limit", None)
    remaining = getattr(request.state, "rate_limit_remaining", None)

    if limit is not None:
        response.headers["X-RateLimit-Limit"] = str(limit)

    if remaining is not None:
        response.headers["X-RateLimit-Remaining"] = str(
            remaining
        )

    return response


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