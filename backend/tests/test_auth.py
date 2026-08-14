from .conftest import signup


def test_registration_otp_and_login(client):
    headers, user = signup(client, "alice")
    assert user["username"] == "alice"
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    login = client.post("/api/auth/login", json={"identifier": "alice", "password": "password123"})
    assert login.status_code == 200


def test_invalid_otp_rejected(client):
    client.post("/api/auth/register", json={"username": "alice", "display_name": "Alice", "password": "password123"})
    result = client.post("/api/auth/verify-otp", json={"username": "alice", "otp": "000000"})
    assert result.status_code == 400
