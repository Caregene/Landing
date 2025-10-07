from fastapi import APIRouter

router = APIRouter()


@router.get("/v1/hello")
def hello():
    """Placeholder route to represent gateway endpoints."""
    return {"message": "hello from api-gateway"}


