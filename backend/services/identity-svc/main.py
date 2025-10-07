"""
Identity Service (FastAPI)

Folders:
- routers/: API endpoints
- models/: SQLAlchemy models
- schemas/: Pydantic models
- repos/: CRUD repositories
- tests/: Unit tests
"""
from fastapi import FastAPI
from routers.health import router as health_router
from routers.auth import router as auth_router

app = FastAPI(title="identity-svc", version="0.1.0")

app.include_router(health_router, prefix="/")
app.include_router(auth_router, prefix="/auth", tags=["auth"])













