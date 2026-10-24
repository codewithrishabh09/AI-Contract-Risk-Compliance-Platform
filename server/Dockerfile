# syntax=docker/dockerfile:1.7

FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DEFAULT_TIMEOUT=300 \
    PIP_RETRIES=10

WORKDIR /build

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# CPU-only PyTorch first: much smaller and faster than the CUDA build.
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --prefix=/install \
        torch --index-url https://download.pytorch.org/whl/cpu

# Let pip see the torch we just installed, so it is not downloaded again.
ENV PYTHONPATH=/install/lib/python3.12/site-packages

RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --prefix=/install -r requirements.txt


FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq5 \
        libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN useradd \
    --create-home \
    --shell /usr/sbin/nologin \
    app

COPY --from=builder /install /usr/local

COPY app ./app
COPY alembic.ini .
COPY alembic ./alembic
COPY requirements.txt .

RUN mkdir -p /app/storage \
    && chown -R app:app /app

USER app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]