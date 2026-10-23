from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_contract_list_requires_authentication():
    response = client.get(
        "/api/v1/contracts",
    )

    assert response.status_code in {401, 403}


def test_contract_creation_requires_authentication():
    response = client.post(
        "/api/v1/contracts",
        json={
            "title": "Test Contract",
            "contract_type": "NDA",
        },
    )

    assert response.status_code in {401, 403}


def test_contract_detail_requires_authentication():
    response = client.get(
        "/api/v1/contracts/00000000-0000-0000-0000-000000000000",
    )

    assert response.status_code in {401, 403}