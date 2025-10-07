from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest):
    # Demo-only: accept any password for demo user
    if body.email.endswith("@example.com"):
        return TokenResponse(access_token="demo-token")
    raise HTTPException(status_code=401, detail="invalid_credentials")













