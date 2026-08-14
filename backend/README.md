# SwipChat Backend

FastAPI, SQLAlchemy, SQLite, JWT auth, and WebSockets.

Setup:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py
uvicorn app.main:app --reload
```

Tests:

```bash
pytest
```

Demo users after seeding: `alice`, `bob`, `charlie`, `david`, `emma`, `frank`; password `password123`.
