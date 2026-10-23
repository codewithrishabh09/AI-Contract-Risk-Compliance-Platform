from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


CONTRACT_ID = "00000000-0000-0000-0000-000000000000"
VERSION_ID = "00000000-0000-0000-0000-000000000000"


def test_findings_requires_authentication():
    response = client.get(
        f"/api/v1/contracts/{CONTRACT_ID}/versions/{VERSION_ID}/findings",
    )

    assert response.status_code in {401, 403}


def test_dashboard_requires_authentication():
    response = client.get(
        f"/api/v1/contracts/{CONTRACT_ID}/versions/{VERSION_ID}/dashboard",
    )

    assert response.status_code in {401, 403}