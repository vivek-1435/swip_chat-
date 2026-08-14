from .conftest import signup


def test_user_search_and_profile_update(client):
    alice_headers, _ = signup(client, "alice")
    _, bob = signup(client, "bob")

    results = client.get("/api/users/search?q=bo", headers=alice_headers)
    assert results.status_code == 200
    assert results.json()[0]["username"] == "bob"

    profile = client.patch(
        "/api/users/me",
        headers=alice_headers,
        json={"display_name": "Alice Secure", "avatar_url": "/avatars/alice.svg"},
    )
    assert profile.status_code == 200
    assert profile.json()["display_name"] == "Alice Secure"
    assert profile.json()["avatar_url"] == "/avatars/alice.svg"

    fetched = client.get(f"/api/users/{bob['id']}", headers=alice_headers)
    assert fetched.status_code == 200
    assert fetched.json()["username"] == "bob"


def test_settings_placeholder_api_requires_auth(client):
    anonymous = client.get("/api/settings")
    assert anonymous.status_code == 401

    headers, _ = signup(client, "alice")
    settings = client.get("/api/settings", headers=headers)
    assert settings.status_code == 200
    assert settings.json()["privacy"]["read_receipts"] is True
    assert "Real End-to-End Encryption" in settings.json()["placeholders"]

    updated = client.patch("/api/settings", headers=headers, json={"appearance": {"theme": "dark", "dark_mode": True}})
    assert updated.status_code == 200
    assert updated.json()["appearance"]["theme"] == "dark"
