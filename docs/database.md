# Database

```text
users
  ├─ contacts
  └─ conversation_members
       └─ conversations
            └─ messages
                 ├─ message_receipts
                 └─ message_reactions
```

Core tables:

- `users`: identity, profile, avatar, password hash, presence, verification state.
- `contacts`: directed address-book entries with unique user/contact pairs.
- `conversations`: direct or group metadata.
- `conversation_members`: membership and role for every conversation type.
- `messages`: persisted message body, sender, status, optional reply target.
- `message_receipts`: per-user delivered/read timestamps.
- `message_reactions`: optional emoji reactions.

Indexes are defined on username, phone, conversation activity, message conversation/sender/created time, and member lookup fields.
