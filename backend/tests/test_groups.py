from .conftest import signup


def test_group_creation_and_admin_permissions(client):
    alice_headers, _ = signup(client, "alice")
    bob_headers, bob = signup(client, "bob")
    _, charlie = signup(client, "charlie")
    group = client.post("/api/groups", headers=alice_headers, json={"name": "Team", "member_ids": [bob["id"]]})
    assert group.status_code == 200
    group_id = group.json()["id"]
    message = client.post(f"/api/conversations/{group_id}/messages", headers=bob_headers, json={"content": "Hi team"})
    assert message.status_code == 200
    blocked = client.delete(f"/api/groups/{group_id}/members/{charlie['id']}", headers=bob_headers)
    assert blocked.status_code == 403
    added = client.post(f"/api/groups/{group_id}/members", headers=alice_headers, json={"user_id": charlie["id"]})
    assert added.status_code == 200
