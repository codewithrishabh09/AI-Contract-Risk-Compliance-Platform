from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models.user import User


def test_login_rejects_invalid_payload(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={},
    )

    assert response.status_code == 422


def test_register_rejects_invalid_payload(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={},
    )

    assert response.status_code == 422


def test_me_requires_authentication(client: TestClient):
    response = client.get("/api/v1/auth/me")

    assert response.status_code in {401, 403}


def test_login_returns_access_token(
    client: TestClient,
    test_user: User,
):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user.email,
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["access_token"]
    assert data["token_type"] == "bearer"


def test_login_rejects_invalid_password(
    client: TestClient,
    test_user: User,
):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user.email,
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_login_rejects_unknown_email(
    client: TestClient,
):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_me_returns_authenticated_user(
    authenticated_client: TestClient,
    test_user: User,
):
    response = authenticated_client.get(
        "/api/v1/auth/me"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == str(test_user.id)
    assert data["organization_id"] == str(
        test_user.organization_id
    )
    assert data["email"] == test_user.email
    assert data["full_name"] == test_user.full_name
    assert data["role"] == test_user.role
    assert data["status"] == "ACTIVE"


def test_inactive_user_cannot_login(
    client: TestClient,
    db_session: Session,
    test_user: User,
):
    test_user.status = "SUSPENDED"
    db_session.flush()

    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": test_user.email,
            "password": "TestPassword123!",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."


def test_authenticated_request_without_valid_token_is_rejected(
    client: TestClient,
):
    client.headers.update(
        {
            "Authorization": "Bearer invalid-token",
        }
    )

    response = client.get(
        "/api/v1/auth/me"
    )

    assert response.status_code == 401