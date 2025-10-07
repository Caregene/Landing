from fastapi import FastAPI
from routers.health import router as health_router
from routers.proxy import router as proxy_router

app = FastAPI(title="api-gateway", version="0.1.0")
app.include_router(health_router)
app.include_router(proxy_router, prefix="/api")


