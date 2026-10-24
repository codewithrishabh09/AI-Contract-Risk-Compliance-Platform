from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "ai-contract-intelligence"


def test_openapi_has_expected_api_metadata():
    response = client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "AI Contract Intelligence API"
    assert data["info"]["version"] == "1.0.0"
    paths = data["paths"]
    assert "/health" in paths
    assert "/api/v1/auth/login" in paths
    assert "/api/v1/contracts" in paths