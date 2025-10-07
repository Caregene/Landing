from fastapi import FastAPI, UploadFile, File
from routers.health import router as health_router
from minio import Minio
import os

app = FastAPI(title="files-svc", version="0.1.0")
app.include_router(health_router)


def get_minio():
    endpoint = os.getenv("MINIO_ENDPOINT", "http://localhost:9000").replace("http://", "").replace("https://", "")
    access = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    secret = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    return Minio(endpoint, access_key=access, secret_key=secret, secure=False)


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    client = get_minio()
    bucket = os.getenv("MINIO_BUCKET", "files")
    if not client.bucket_exists(bucket):
        client.make_bucket(bucket)
    data = await file.read()
    client.put_object(bucket, file.filename, data=data, length=len(data))
    return {"ok": True, "filename": file.filename}


