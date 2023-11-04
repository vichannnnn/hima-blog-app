from fastapi import status
from fastapi.testclient import TestClient

PING_URL = "/ping"
HELLO_WORLD_URL = "/hello"


def test_ping_example(test_client: TestClient) -> None:
    response = test_client.get(PING_URL)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"status": "ok"}


def test_hello_world_example(test_client: TestClient) -> None:
    response = test_client.get(HELLO_WORLD_URL)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"Hello": "World!"}
