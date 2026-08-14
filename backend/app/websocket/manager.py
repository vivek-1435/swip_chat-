from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[int, set[WebSocket]] = {}

    async def connect(self, user_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.setdefault(user_id, set()).add(websocket)

    def disconnect(self, user_id: int, websocket: WebSocket) -> None:
        sockets = self.active_connections.get(user_id)
        if not sockets:
            return
        sockets.discard(websocket)
        if not sockets:
            self.active_connections.pop(user_id, None)

    async def send_personal_message(self, user_id: int, payload: dict) -> None:
        for socket in list(self.active_connections.get(user_id, set())):
            await socket.send_json(payload)

    async def broadcast_to_users(self, user_ids: list[int], payload: dict) -> None:
        for user_id in set(user_ids):
            await self.send_personal_message(user_id, payload)


manager = ConnectionManager()
