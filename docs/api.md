# API

Auth:

- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Users and contacts:

- `GET /api/users/search?q=`
- `GET /api/users/{user_id}`
- `PATCH /api/users/me`
- `GET /api/contacts`
- `POST /api/contacts`
- `DELETE /api/contacts/{user_id}`

Conversations and messages:

- `GET /api/conversations`
- `POST /api/conversations/direct`
- `GET /api/conversations/{conversation_id}`
- `GET /api/conversations/{conversation_id}/members`
- `GET /api/conversations/{conversation_id}/messages?limit=50&before_id=`
- `POST /api/conversations/{conversation_id}/messages`
- `POST /api/messages/{message_id}/delivered`
- `POST /api/messages/{message_id}/read`
- `POST /api/messages/{message_id}/reactions`

Groups:

- `POST /api/groups`
- `PATCH /api/groups/{group_id}`
- `POST /api/groups/{group_id}/members`
- `DELETE /api/groups/{group_id}/members/{user_id}`

Settings:

- `GET /api/settings`
- `PATCH /api/settings`

WebSocket: `WS /ws/{user_id}?token=JWT`

Client events: `send_message`, `typing_start`, `typing_stop`, `mark_read`.

Server events: `new_message`, `message_status`, `typing`, `presence`, `error`.

Message flow:

```text
Alice types "Hello Bob"
↓
Frontend validates message
↓
WebSocket send_message event
↓
FastAPI receives event
↓
Authenticate Alice
↓
Verify Alice belongs to conversation
↓
Persist message in database
↓
Create delivery event
↓
Broadcast to conversation members
↓
Bob receives message
↓
Bob's client acknowledges delivery
↓
Backend updates message receipt
↓
Bob opens conversation
↓
Client sends mark_read
↓
Backend updates read receipt
↓
Alice receives read status
```
