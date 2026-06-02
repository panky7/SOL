from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse
from starlette.middleware.cors import CORSMiddleware
from datetime import datetime, timezone
import os
import logging
import base64
import html
import urllib.parse

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

@api_router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "sophie-lamour-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": os.environ.get("ENVIRONMENT", os.environ.get("ENV", "development")),
        "database": "mock" if os.environ.get("MOCK_DB") == "true" else "dynamodb",
    }

@api_router.get("/ready")
async def readiness_check():
    required_env = ["JWT_SECRET", "FRONTEND_URL"]
    missing_env = [name for name in required_env if not os.environ.get(name)]
    status_code = 200 if not missing_env else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "ready": not missing_env,
            "status": "ready" if not missing_env else "not_ready",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "missing": missing_env,
        },
    )

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

def first_public_frontend_url() -> str:
    frontend_url = os.environ.get("FRONTEND_URL", "")
    for candidate in frontend_url.split(","):
        candidate = candidate.strip().rstrip("/")
        if candidate and "localhost" not in candidate:
            return candidate
    return ""

def get_public_origin(request: Request) -> str:
    explicit_url = os.environ.get("PUBLIC_SITE_URL") or os.environ.get("SITE_URL")
    if explicit_url:
        return explicit_url.rstrip("/")

    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    if host and "execute-api" not in host:
        scheme = request.headers.get("x-forwarded-proto", "https")
        if "localhost" in host or host.startswith("127.0.0.1"):
            scheme = "http"
        return f"{scheme}://{host}".rstrip("/")

    frontend_origin = first_public_frontend_url()
    if frontend_origin:
        return frontend_origin

    if os.environ.get("ENVIRONMENT", "prod") == "prod":
        return "https://www.sophielamourcoaching.fr"
    return "https://d3ltn3xymy1clc.cloudfront.net"

def absolutize_url(url: str, origin: str) -> str:
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("/"):
        return f"{origin}{urllib.parse.quote(url, safe='/:%?=&')}"
    return f"{origin}/{urllib.parse.quote(url, safe='/:%?=&')}"

@app.on_event("startup")
async def startup_event():
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@sophielamour.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "SophieAdmin2025!")
    existing = await db.users.find_one({"email": admin_email})

    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "_id": "admin-user",
            "email": admin_email,
            "password_hash": hashed,
            "name": "Sophie Lamour",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})

    # Write credentials
    try:
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
    except Exception as e:
        logger.warning(f"Could not write credentials file (expected on read-only environments like AWS Lambda): {e}")

import re

@app.get("/blog/{slug:path}", response_class=HTMLResponse)
async def serve_blog_post_preview(slug: str, request: Request):
    # 1. Fetch post from DynamoDB/mock db
    # Clean the slug by removing any trailing slashes
    clean_slug = slug.strip("/")
    
    post = None
    if clean_slug:
        post = await db.blog_posts.find_one({"slug": clean_slug})
        if not post and len(clean_slug) > 50:
            post = await db.blog_posts.find_one({"slug": clean_slug[:50]})
        
    # 2. Locate index.html
    index_path = ROOT_DIR / "index.html"
    if not index_path.exists():
        # local development fallback path
        index_path = ROOT_DIR.parent / "frontend" / "build" / "index.html"
        
    if not index_path.exists():
        return HTMLResponse(
            content="<html><body><h1>Sophie Lamour Coaching</h1><p>Frontend is not built. Please run npm run build in the frontend directory.</p></body></html>",
            status_code=500
        )

    with open(index_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # If post not found or clean_slug is empty, return unmodified index.html for SPA to route
    if not post:
        return HTMLResponse(content=html_content)

    # 3. Determine language
    lang = "fr"
    # Check query param first
    if "lang" in request.query_params:
        lang = request.query_params["lang"]
    else:
        # Check Accept-Language header
        accept_lang = request.headers.get("accept-language", "")
        if "en" in accept_lang.lower() and "fr" not in accept_lang.lower():
            lang = "en"

    # Get title and excerpt based on language. Facebook-specific fields let
    # admins tune the link preview without changing the article itself.
    title = post.get("facebook_title") or (post.get("title_fr") if lang == "fr" else post.get("title_en"))
    excerpt = post.get("facebook_description") or (post.get("excerpt_fr") if lang == "fr" else post.get("excerpt_en"))
    
    # Fallbacks if a language field is missing
    if not title:
        title = post.get("title_fr") or post.get("title_en") or "Sophie Lamour"
    if not excerpt:
        excerpt = post.get("excerpt_fr") or post.get("excerpt_en") or ""

    # Clear HTML tags from excerpt
    clean_excerpt = re.sub(r'<[^>]+>', '', excerpt)

    # 4. Construct metadata
    origin = get_public_origin(request)
    host = urllib.parse.urlparse(origin).netloc
    
    # Percent-encode slug to ensure RFC-compliant ASCII URL for crawlers
    encoded_slug = urllib.parse.quote(clean_slug)
    post_url = f"{origin}/blog/{encoded_slug}"
    
    featured_image = post.get("facebook_image") or post.get("featured_image") or ""
    image_type = "image/jpeg" # safe default
    featured_image_url = ""
    
    if featured_image:
        featured_image_url = absolutize_url(featured_image, origin)

        # Determine MIME type if it's an uploaded file
        if "/api/uploads/" in featured_image:
            try:
                # Extract file_id from URL path
                file_id = featured_image.split("/api/uploads/")[-1].split("?")[0].split("/")[0]
                upload_item = await db.uploads.find_one({"file_id": file_id})
                if upload_item and upload_item.get("content_type"):
                    image_type = upload_item["content_type"]
            except Exception as e:
                logger.warning(f"Error resolving upload content type: {e}")
                
    meta_title = html.escape(title, quote=True)
    meta_excerpt = html.escape(clean_excerpt, quote=True)
    meta_post_url = html.escape(post_url, quote=True)
    meta_site_name = html.escape(host.upper(), quote=True)
    meta_image_url = html.escape(featured_image_url, quote=True)

    og_image_tag = f'''<meta property="og:image" content="{meta_image_url}"/>
<meta property="og:image:secure_url" content="{meta_image_url}"/>
<meta property="og:image:type" content="{html.escape(image_type, quote=True)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>''' if featured_image else ''
    twitter_image_tag = f'<meta name="twitter:image" content="{meta_image_url}"/>' if featured_image else ''

    # 5. Perform replacements in html_content
    # Replace title
    default_title = "<title>Sophie Lamour | Coach de vie et développement personnel</title>"
    if default_title in html_content:
        html_content = html_content.replace(default_title, f"<title>{meta_title} - Sophie Lamour</title>")
    else:
        html_content = re.sub(r"<title>.*?</title>", f"<title>{meta_title} - Sophie Lamour</title>", html_content)

    # Replace meta description
    default_desc = '<meta name="description" content="Sophie Lamour - Coach de vie et développement personnel. Accompagnement personnalisé en coaching professionnel, parentalité, home organising et ikigaï."/>'
    if default_desc in html_content:
        html_content = html_content.replace(default_desc, f'<meta name="description" content="{meta_excerpt}"/>')
    else:
        html_content = re.sub(r'<meta name="description" content=".*?"/?>', f'<meta name="description" content="{meta_excerpt}"/>', html_content)

    # Inject Open Graph and Twitter card tags
    og_tags = f"""<link rel="canonical" href="{meta_post_url}"/>
<meta property="og:title" content="{meta_title}"/>
<meta property="og:description" content="{meta_excerpt}"/>
{og_image_tag}
<meta property="og:url" content="{meta_post_url}"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="{meta_site_name}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{meta_title}"/>
<meta name="twitter:description" content="{meta_excerpt}"/>
{twitter_image_tag}
</head>"""

    html_content = html_content.replace("</head>", og_tags)
    
    return HTMLResponse(content=html_content)

from mangum import Mangum
asgi_handler = Mangum(app)

def handler(event, context):
    if isinstance(event, dict) and event.get("source") == "aws.events":
        logger.info("Received Lambda keep-warm event")
        return {"statusCode": 204, "body": ""}
    return asgi_handler(event, context)

