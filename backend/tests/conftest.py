import os
import sys
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_swipchat.db"
os.environ["JWT_SECRET"] = "test-secret"
sys.path.append(str(Path(__file__).resolve().parents[1]))

import pytest
from fastapi.testclient import TestClient
from app.database import Base, engine
from app.main import app


@pytest.fixture()
def client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as test_client:
        yield test_client


def signup(client: TestClient, username: str):
    client.post("/api/auth/register", json={"username": username, "display_name": username.title(), "password": "password123"})
    result = client.post("/api/auth/verify-otp", json={"username": username, "otp": "123456"})
    token = result.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, result.json()["user"]
