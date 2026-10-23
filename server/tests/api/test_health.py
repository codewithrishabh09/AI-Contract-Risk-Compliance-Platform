from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "ai-contract-intelligence"


def test_health_contains_request_id():
    response = client.get("/health")

    assert response.status_code == 200
    assert "X-Request-ID" in response.headers


def test_custom_request_id_is_preserved():
    request_id = "test-request-123"

    response = client.get(
        "/health",
        headers={"X-Request-ID": request_id},
    )

    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == request_id