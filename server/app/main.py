from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.contracts import router as contracts_router
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
    contracts_router,
    prefix="/api/v1",
)