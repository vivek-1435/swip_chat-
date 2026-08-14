from .conftest import signup


def test_direct_conversation_and_message_persistence(client):
    alice_headers, _ = signup(client, "alice")
    _, bob = signup(client, "bob")
    convo = client.post("/api/conversations/direct", headers=alice_headers, json={"user_id": bob["id"]})
    assert convo.status_code == 200
    message = client.post(f"/api/conversations/{convo.json()['id']}/messages", headers=alice_headers, json={"content": "Hello Bob"})
    assert message.status_code == 200
    messages = client.get(f"/api/conversations/{convo.json()['id']}/messages", headers=alice_headers)
    assert messages.json()[0]["content"] == "Hello Bob"


def test_non_member_cannot_send(client):
    alice_headers, _ = signup(client, "alice")
    _, bob = signup(client, "bob")
    charlie_headers, _ = signup(client, "charlie")
    convo = client.post("/api/conversations/direct", headers=alice_headers, json={"user_id": bob["id"]}).json()
    blocked = client.post(f"/api/conversations/{convo['id']}/messages", headers=charlie_headers, json={"content": "Sneaky"})
    assert blocked.status_code == 403
