from fastapi import APIRouter, HTTPException, Request, Response, Depends, UploadFile, File
from datetime import datetime, timezone
from pathlib import Path
from PIL import Image
import uuid
import io
import base64
import re

from routes import db
from routes.auth import get_current_user

router = APIRouter(prefix="/uploads")

def sanitize_filename(filename: str) -> str:
    # Ensure it is just the filename, not a path
    name = Path(filename).name
    # Keep alphanumeric, dots, dashes, and underscores
    name = re.sub(r'[^a-zA-Z0-9._-]', '_', name)
    return name

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/ogg", "video/quicktime"}
MAX_FILE_SIZE = 50 * 1024 * 1024


def generate_thumbnail_bytes(file_data: bytes, size=(400, 400)):
    try:
        img = Image.open(io.BytesIO(file_data))
        img.thumbnail(size, Image.LANCZOS)
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        buf = io.BytesIO()
        img.save(buf, 'JPEG', quality=80)
        return buf.getvalue()
    except Exception:
        return None


@router.post("", dependencies=[Depends(get_current_user)])
async def upload_file(request: Request, file: UploadFile = File(...)):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    content_type = file.content_type or ""
    is_image = content_type in ALLOWED_IMAGE_TYPES
    is_video = content_type in ALLOWED_VIDEO_TYPES

    if not is_image and not is_video:
        raise HTTPException(status_code=400, detail="File type not supported. Use JPEG, PNG, GIF, WebP, MP4, WebM, or OGG.")

    file_id = str(uuid.uuid4())

    file_data = b""
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        file_data += chunk
        if len(file_data) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="File too large. Max 50MB.")

    thumbnail_data = None
    thumbnail_url = None
    if is_image:
        thumbnail_data = generate_thumbnail_bytes(file_data)
        if thumbnail_data:
            thumbnail_url = f"/api/uploads/{file_id}/thumbnail"

    safe_filename = sanitize_filename(file.filename or "file")
    file_doc = {
        "file_id": file_id,
        "original_name": safe_filename,
        "content_type": content_type,
        "size": len(file_data),
        "is_image": is_image,
        "is_video": is_video,
        "data": base64.b64encode(file_data).decode('utf-8'),
        "thumbnail_data": base64.b64encode(thumbnail_data).decode('utf-8') if thumbnail_data else None,
        "thumbnail": thumbnail_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "uploaded_by": str(user["_id"])
    }
    await db.uploads.insert_one(file_doc)

    return {
        "file_id": file_id,
        "url": f"/api/uploads/{file_id}",
        "thumbnail_url": thumbnail_url,
        "content_type": content_type,
        "size": len(file_data),
        "original_name": safe_filename
    }

@router.get("/{file_id}")
async def get_upload(file_id: str):
    meta = await db.uploads.find_one({"file_id": file_id})
    if not meta or "data" not in meta:
        raise HTTPException(status_code=404, detail="File not found")
    file_data = base64.b64decode(meta["data"])
    return Response(
        content=file_data,
        media_type=meta["content_type"],
        headers={
            "Content-Disposition": f'inline; filename="{meta.get("original_name", "file")}"',
            "Cache-Control": "public, max-age=31536000"
        }
    )

@router.get("/{file_id}/thumbnail")
async def get_upload_thumbnail(file_id: str):
    meta = await db.uploads.find_one({"file_id": file_id})
    if not meta or not meta.get("thumbnail_data"):
        raise HTTPException(status_code=404, detail="Thumbnail not found")
    thumb_data = base64.b64decode(meta["thumbnail_data"])
    return Response(
        content=thumb_data,
        media_type="image/jpeg",
        headers={"Cache-Control": "public, max-age=31536000"}
    )
