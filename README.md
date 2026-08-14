# SwipChat (Signal Clone)

A modern, real-time messaging application built with a Next.js frontend and a FastAPI backend. This project mimics the core functionality of popular instant messaging apps like Signal or WhatsApp.

## Key Features

- **Real-Time Messaging**: Instant message delivery using WebSockets.
- **Direct & Group Chats**: Support for 1-on-1 conversations and multi-member groups.
- **Group Management**: Group admins can add members, remove members, promote others to admin, or permanently delete the group.
- **Contact Management**: 
  - Save users to your contacts list with custom names (e.g., "Mom", "Best Friend").
  - Custom names seamlessly propagate across the entire UI (sidebar, chat headers, conversation lists).
  - Search and discover users to add, while properly filtering out existing contacts.
- **Read Receipts & Unread Counts**: Track exactly which messages have been seen.
- **Typing Indicators**: See when the other person is typing in real-time.
- **Authentication**: Secure JWT-based registration and login system.
- **Profile Customization**: Users can set display names and avatars.

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **State & Data Fetching**: SWR for REST APIs, custom WebSocket hooks for real-time state synchronization.

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12+)
- **Database**: SQLite with [SQLAlchemy](https://www.sqlalchemy.org/) ORM.
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Real-time**: FastAPI WebSockets with custom connection management.
- **Authentication**: JWT tokens (PyJWT), Passlib for password hashing.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Python (3.12+)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations:
   ```bash
   alembic upgrade head
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will run on `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be accessible at `http://localhost:3000`.

## Architecture & Data Flow

- **REST API**: Used for standard CRUD operations (creating groups, adding contacts, fetching historical messages, authentication).
- **WebSockets**: Used for pushing ephemeral events (`new_message`, `typing_start`, `typing_stop`) directly to connected clients to ensure instant updates without polling.
- **Optimistic UI**: The frontend immediately renders outgoing messages locally before the server acknowledges them, ensuring a snappy user experience. If a message fails, the optimistic update is rolled back.

## License
MIT
