import os
from collections.abc import Generator

# This must happen before application settings are imported.
# Pytest will therefore use the dedicated test database.
os.environ["DB_NAME"] = "contract_intelligence_test"
os.environ["ENVIRONMENT"] = "test"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.db.session import SessionLocal, engine
from app.main import app
from app.models.organization import Organization
from app.models.user import User
from app.core.security.password import hash_password


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    """
    Provide a database session for tests.

    Every test gets a clean transaction. Changes are rolled back
    after the test finishes so test data does not leak between tests.
    """
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def test_organization(db_session: Session) -> Organization:
    """
    Create a reusable organization for authentication tests.
    """
    organization = Organization(
        name="LexMind Test Organization",
        slug="lexmind-test-organization",
    )

    db_session.add(organization)
    db_session.flush()
    db_session.refresh(organization)

    return organization


@pytest.fixture
def test_user(
    db_session: Session,
    test_organization: Organization,
) -> User:
    """
    Create an active employee user for authentication tests.
    """
    user = User(
        organization_id=test_organization.id,
        email="test.user@example.com",
        password_hash=hash_password("TestPassword123!"),
        full_name="Test User",
        role="EMPLOYEE",
        status="ACTIVE",
    )

    db_session.add(user)
    db_session.flush()
    db_session.refresh(user)

    return user


@pytest.fixture
def client(
    db_session: Session,
) -> Generator[TestClient, None, None]:
    """
    Provide a FastAPI test client using the test database session.
    """

    def override_get_db():
        yield db_session

    from app.db.session import get_db

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def authenticated_client(
    client: TestClient,
    test_user: User,
) -> TestClient:
    """
    Provide an authenticated client using the test user's JWT.
    """
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user.email,
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200, response.text

    access_token = response.json()["access_token"]

    client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )

    return client