from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_login_rejects_invalid_payload():
    response = client.post(
        "/api/v1/auth/login",
        json={},
    )

    assert response.status_code == 422


def test_register_rejects_invalid_payload():
    response = client.post(
        "/api/v1/auth/register",
        json={},
    )

    assert response.status_code == 422


def test_me_requires_authentication():
    response = client.get(
        "/api/v1/auth/me",
    )

    assert response.status_code in {401, 403}