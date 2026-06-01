from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import HTMLResponse
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

    # Get title and excerpt based on language
    title = post.get("title_fr") if lang == "fr" else post.get("title_en")
    excerpt = post.get("excerpt_fr") if lang == "fr" else post.get("excerpt_en")
    
    # Fallbacks if a language field is missing
    if not title:
        title = post.get("title_fr") or post.get("title_en") or "Sophie Lamour"
    if not excerpt:
        excerpt = post.get("excerpt_fr") or post.get("excerpt_en") or ""

    # Clear HTML tags from excerpt
    clean_excerpt = re.sub(r'<[^>]+>', '', excerpt)

    # 4. Construct metadata
    # Try x-forwarded-host first to support custom domain routing via CloudFront
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    if "execute-api" in host or not host:
        # Fallback to the environment-specific domain if we are bypass routing/accessing Lambda direct
        env = os.environ.get("ENVIRONMENT", "prod")
        if env == "prod":
            host = "www.sophielamourcoaching.com"
        else:
            host = "d3ltn3xymy1clc.cloudfront.net"
            
    scheme = "https" if "localhost" not in host else "http"
    post_url = f"{scheme}://{host}/blog/{clean_slug}"
    
    featured_image = post.get("featured_image") or ""
    if featured_image and not (featured_image.startswith("http://") or featured_image.startswith("https://")):
        # Convert relative image path to absolute URL
        if featured_image.startswith("/"):
            featured_image = f"{scheme}://{host}{featured_image}"
        else:
            featured_image = f"{scheme}://{host}/{featured_image}"
            
    og_image_tag = f'<meta property="og:image" content="{featured_image}"/>' if featured_image else ''
    twitter_image_tag = f'<meta name="twitter:image" content="{featured_image}"/>' if featured_image else ''

    # 5. Perform replacements in html_content
    # Replace title
    default_title = "<title>Sophie Lamour | Coach de vie et développement personnel</title>"
    if default_title in html_content:
        html_content = html_content.replace(default_title, f"<title>{title} - Sophie Lamour</title>")
    else:
        html_content = re.sub(r"<title>.*?</title>", f"<title>{title} - Sophie Lamour</title>", html_content)

    # Replace meta description
    default_desc = '<meta name="description" content="Sophie Lamour - Coach de vie et développement personnel. Accompagnement personnalisé en coaching professionnel, parentalité, home organising et ikigaï."/>'
    if default_desc in html_content:
        html_content = html_content.replace(default_desc, f'<meta name="description" content="{clean_excerpt}"/>')
    else:
        html_content = re.sub(r'<meta name="description" content=".*?"/?>', f'<meta name="description" content="{clean_excerpt}"/>', html_content)

    # Inject Open Graph and Twitter card tags
    og_tags = f"""<meta property="og:title" content="{title}"/>
<meta property="og:description" content="{clean_excerpt}"/>
{og_image_tag}
<meta property="og:url" content="{post_url}"/>
<meta property="og:type" content="article"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="{title}"/>
<meta name="twitter:description" content="{clean_excerpt}"/>
{twitter_image_tag}
</head>"""

    html_content = html_content.replace("</head>", og_tags)
    
    return HTMLResponse(content=html_content)

from mangum import Mangum
handler = Mangum(app)

