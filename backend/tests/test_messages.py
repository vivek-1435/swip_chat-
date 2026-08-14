from .conftest import signup


def test_message_reply_reaction_delivery_and_read_flow(client):
    alice_headers, _ = signup(client, "alice")
    bob_headers, bob = signup(client, "bob")
    convo = client.post("/api/conversations/direct", headers=alice_headers, json={"user_id": bob["id"]}).json()

    first = client.post(f"/api/conversations/{convo['id']}/messages", headers=alice_headers, json={"content": "First"})
    assert first.status_code == 200
    first_id = first.json()["id"]

    reply = client.post(
        f"/api/conversations/{convo['id']}/messages",
        headers=bob_headers,
        json={"content": "Replying", "reply_to_id": first_id},
    )
    assert reply.status_code == 200
    assert reply.json()["reply_to_id"] == first_id

    delivered = client.post(f"/api/messages/{first_id}/delivered", headers=bob_headers)
    assert delivered.status_code == 200
    assert delivered.json()["status"] == "delivered"

    read = client.post(f"/api/messages/{first_id}/read", headers=bob_headers)
    assert read.status_code == 200
    assert read.json()["status"] == "read"
    assert any(receipt["user_id"] == bob["id"] and receipt["read_at"] for receipt in read.json()["receipts"])

    reacted = client.post(f"/api/messages/{first_id}/reactions", headers=bob_headers, json={"emoji": "👍"})
    assert reacted.status_code == 200
    assert reacted.json()["reactions"][0]["emoji"] == "👍"


def test_unauthorized_user_cannot_read_private_messages(client):
    alice_headers, _ = signup(client, "alice")
    _, bob = signup(client, "bob")
    charlie_headers, _ = signup(client, "charlie")
    convo = client.post("/api/conversations/direct", headers=alice_headers, json={"user_id": bob["id"]}).json()

    blocked = client.get(f"/api/conversations/{convo['id']}/messages", headers=charlie_headers)
    assert blocked.status_code == 403
