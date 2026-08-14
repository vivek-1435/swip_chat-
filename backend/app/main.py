from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .auth.jwt import decode_access_token
from .config import get_settings
from .database import create_all, get_db
from .routers import auth, contacts, conversations, groups, messages, settings as settings_router, users
from .websocket.handlers import conversation_user_ids, handle_event, set_presence
from .websocket.manager import manager

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_all()
    yield

app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_allowed_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(contacts.router)
app.include_router(conversations.router)
app.include_router(messages.router)
app.include_router(groups.router)
app.include_router(settings_router.router)



@app.get("/api/health")
def health():
    return {"success": True, "status": "ok"}


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(user_id: int, websocket: WebSocket, db: Session = Depends(get_db)):
    token = websocket.query_params.get("token")
    authenticated_id = decode_access_token(token or "")
    if authenticated_id != user_id:
        await websocket.close(code=1008)
        return
    await manager.connect(user_id, websocket)
    await set_presence(db, user_id, True)
    # Presence is intentionally lightweight and best-effort.
    try:
        while True:
            data = await websocket.receive_json()
            await handle_event(db, websocket, user_id, data)
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        await set_presence(db, user_id, False)
    finally:
        await manager.broadcast_to_users([], {"type": "noop"})
