# Architecture

SwipChat follows a unified conversation model. Direct and group chats both use `conversations`, `conversation_members`, `messages`, and `message_receipts`.

```text
User
↓
Next.js UI
↓
REST/WebSocket
↓
FastAPI
↓
Routers
↓
Services
↓
SQLAlchemy
↓
SQLite
```

Real-time flow:

```text
User A
↓
WebSocket
↓
ConnectionManager
↓
MessageService
↓
Database
↓
ConnectionManager
↓
WebSocket
↓
User B
```

Authentication uses JWT bearer tokens. The frontend persists only the token for demo session restoration. A production build should prefer hardened cookies and stricter CSRF/session controls.

Encryption is simulated through `mock_encrypt()` and `mock_decrypt()`. This project does not provide production-grade end-to-end security.
