from datetime import datetime, timedelta, timezone
from app.auth.password import hash_password
from app.database import Base, SessionLocal, create_all, engine
from app.models import Conversation, ConversationMember, Message, MessageReceipt, User


def avatar(name: str) -> str:
    return f"https://api.dicebear.com/9.x/initials/svg?seed={name}"


def main() -> None:
    Base.metadata.drop_all(bind=engine)
    create_all()
    db = SessionLocal()
    try:
        people = [
            ("alice", "Alice Morgan"),
            ("bob", "Bob Chen"),
            ("charlie", "Charlie Singh"),
            ("david", "David Park"),
            ("emma", "Emma Rivera"),
            ("frank", "Frank Okafor"),
        ]
        users: dict[str, User] = {}
        for i, (username, name) in enumerate(people, start=1):
            user = User(
                username=username,
                phone=f"+1555000{i:03d}",
                display_name=name,
                avatar_url=avatar(name),
                password_hash=hash_password("password123"),
                is_verified=True,
            )
            db.add(user)
            users[username] = user
        db.flush()

        def direct(a: str, b: str) -> Conversation:
            c = Conversation(type="direct", created_by=users[a].id)
            db.add(c)
            db.flush()
            db.add_all(
                [
                    ConversationMember(conversation_id=c.id, user_id=users[a].id),
                    ConversationMember(conversation_id=c.id, user_id=users[b].id),
                ]
            )
            return c

        alice_bob = direct("alice", "bob")
        alice_charlie = direct("alice", "charlie")
        product = Conversation(type="group", name="Product Signal", avatar_url=avatar("Product Signal"), created_by=users["alice"].id)
        weekend = Conversation(type="group", name="Weekend Plans", avatar_url=avatar("Weekend Plans"), created_by=users["emma"].id)
        db.add_all([product, weekend])
        db.flush()
        for username in ["alice", "bob", "charlie", "david"]:
            db.add(ConversationMember(conversation_id=product.id, user_id=users[username].id, role="admin" if username == "alice" else "member"))
        for username in ["emma", "frank", "alice", "bob"]:
            db.add(ConversationMember(conversation_id=weekend.id, user_id=users[username].id, role="admin" if username == "emma" else "member"))
        db.flush()

        samples = [
            (alice_bob, "alice", "Morning. Did the prototype feel calmer after the spacing pass?", 120),
            (alice_bob, "bob", "Much calmer. The unread badge finally stopped shouting.", 118),
            (alice_bob, "alice", "Good. I want this to feel private, not sleepy.", 116),
            (alice_bob, "bob", "Agreed. I pushed notes into the group chat.", 114),
            (alice_charlie, "charlie", "Can you review the websocket reconnection copy?", 80),
            (alice_charlie, "alice", "Yes, send it over.", 79),
            (product, "alice", "Standup thread: receipts, groups, mobile polish.", 70),
            (product, "bob", "Receipts are passing locally.", 68),
            (product, "charlie", "I found one edge case around non-members.", 66),
            (product, "david", "I can take the settings placeholders.", 64),
            (product, "alice", "Perfect. Meeting at 5 for a quick demo pass.", 62),
            (weekend, "emma", "Dinner Saturday?", 40),
            (weekend, "frank", "I am in.", 39),
            (weekend, "bob", "Same. Somewhere quiet?", 38),
            (weekend, "alice", "Quiet sounds ideal.", 37),
        ]
        for convo, sender, text, minutes in samples:
            msg = Message(
                conversation_id=convo.id,
                sender_id=users[sender].id,
                content=text,
                status="read",
                created_at=datetime.now(timezone.utc) - timedelta(minutes=minutes),
                updated_at=datetime.now(timezone.utc) - timedelta(minutes=minutes),
            )
            convo.updated_at = msg.created_at
            db.add(msg)
            db.flush()
            member_ids = [m.user_id for m in convo.members]
            for member_id in member_ids:
                db.add(
                    MessageReceipt(
                        message_id=msg.id,
                        user_id=member_id,
                        delivered_at=msg.created_at,
                        read_at=None if member_id == users["alice"].id and sender != "alice" and minutes < 70 else msg.created_at,
                    )
                )
        db.commit()
        print("Seeded demo users: alice/bob/charlie/david/emma/frank with password password123")
    finally:
        db.close()


if __name__ == "__main__":
    main()
