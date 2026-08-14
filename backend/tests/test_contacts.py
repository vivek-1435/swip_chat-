from .conftest import signup


def test_add_and_remove_contact(client):
    alice_headers, _ = signup(client, "alice")
    _, bob = signup(client, "bob")
    added = client.post("/api/contacts", headers=alice_headers, json={"contact_user_id": bob["id"]})
    assert added.status_code == 200
    duplicate = client.post("/api/contacts", headers=alice_headers, json={"contact_user_id": bob["id"]})
    assert duplicate.status_code == 409
    removed = client.delete(f"/api/contacts/{bob['id']}", headers=alice_headers)
    assert removed.status_code == 200
