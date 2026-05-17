from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
import logging
import base64

from routes import db
from routes.auth import router as auth_router, hash_password, verify_password
from routes.blog import router as blog_router
from routes.testimonials import router as testimonials_router
from routes.contact import router as contact_router
from routes.uploads import router as uploads_router, generate_thumbnail_bytes

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Mount all route modules
api_router.include_router(auth_router)
api_router.include_router(blog_router)
api_router.include_router(testimonials_router)
api_router.include_router(contact_router)
api_router.include_router(uploads_router)

app.include_router(api_router)

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in frontend_url.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await db.blog_posts.create_index("slug", unique=True)
    await db.uploads.create_index("file_id", unique=True)

    # Migrate any filesystem-based uploads to MongoDB
    upload_dir = ROOT_DIR / "uploads"
    if upload_dir.exists():
        async for doc in db.uploads.find({"data": {"$exists": False}, "stored_name": {"$exists": True}}):
            file_path = upload_dir / doc["stored_name"]
            if file_path.exists():
                try:
                    file_data = file_path.read_bytes()
                    update_fields = {"data": base64.b64encode(file_data).decode('utf-8')}
                    if doc.get("is_image"):
                        thumb_data = generate_thumbnail_bytes(file_data)
                        if thumb_data:
                            update_fields["thumbnail_data"] = base64.b64encode(thumb_data).decode('utf-8')
                    await db.uploads.update_one({"file_id": doc["file_id"]}, {"$set": update_fields})
                except Exception as e:
                    logging.warning(f"Failed to migrate upload {doc['file_id']}: {e}")

    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@sophielamour.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "SophieAdmin2025!")
    existing = await db.users.find_one({"email": admin_email})

    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Sophie Lamour",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    # Write credentials
    memory_dir = ROOT_DIR.parent / "memory"
    memory_dir.mkdir(exist_ok=True)
    with open(memory_dir / "test_credentials.md", "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin Account\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- GET /api/auth/me\n")
        f.write(f"- POST /api/auth/logout\n")

@app.on_event("shutdown")
async def shutdown_db_client():
    from routes import client
    client.close()

from mangum import Mangum
handler = Mangum(app)
