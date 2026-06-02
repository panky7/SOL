from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import logging
import os
import re
import secrets
import urllib.parse

from routes import db
from routes.auth import get_current_user

router = APIRouter(prefix="/blog")
logger = logging.getLogger(__name__)

DEFAULT_PUBLIC_SITE_URL = "https://www.sophielamourcoaching.fr"
DEFAULT_FACEBOOK_HASHTAGS = "#SophieLamourCoaching #Coaching #BienEtre"
CATEGORY_HASHTAGS = {
    "Organisation": "#HomeOrganising #RangementConscient #BienEtre",
    "Bien-\u00eatre": "#BienEtre #DeveloppementPersonnel",
    "Coaching": "#Coaching #SophieLamourCoaching",
    "Parentalit\u00e9": "#Parentalite #Famille #Coaching",
    "D\u00e9veloppement personnel": "#DeveloppementPersonnel #Coaching",
}


class BlogPostCreate(BaseModel):
    title_fr: str
    title_en: str
    content_fr: str
    content_en: str
    excerpt_fr: str
    excerpt_en: str
    featured_image: Optional[str] = None
    category: str
    status: str = "draft"
    share_to_social: bool = False
    facebook_post_text: Optional[str] = None
    facebook_title: Optional[str] = None
    facebook_description: Optional[str] = None
    facebook_image: Optional[str] = None
    facebook_hashtags: Optional[str] = None

class BlogPostUpdate(BaseModel):
    title_fr: Optional[str] = None
    title_en: Optional[str] = None
    content_fr: Optional[str] = None
    content_en: Optional[str] = None
    excerpt_fr: Optional[str] = None
    excerpt_en: Optional[str] = None
    featured_image: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    facebook_post_text: Optional[str] = None
    facebook_title: Optional[str] = None
    facebook_description: Optional[str] = None
    facebook_image: Optional[str] = None
    facebook_hashtags: Optional[str] = None


def strip_html(value: Optional[str]) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", value)).strip()


def compact_text(value: str, max_length: int) -> str:
    value = strip_html(value)
    if len(value) <= max_length:
        return value
    return value[: max_length - 1].rstrip() + "\u2026"


def get_public_site_url(request: Request) -> str:
    explicit_url = os.environ.get("PUBLIC_SITE_URL") or os.environ.get("SITE_URL")
    if explicit_url:
        return explicit_url.rstrip("/")

    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    if host and "execute-api" not in host:
        proto = request.headers.get("x-forwarded-proto", "https")
        if "localhost" in host or host.startswith("127.0.0.1"):
            proto = "http"
        return f"{proto}://{host}".rstrip("/")

    frontend_url = os.environ.get("FRONTEND_URL", "")
    for candidate in frontend_url.split(","):
        candidate = candidate.strip().rstrip("/")
        if candidate and "localhost" not in candidate:
            return candidate

    return DEFAULT_PUBLIC_SITE_URL


def absolutize_url(url: Optional[str], base_url: str) -> str:
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("/"):
        return f"{base_url}{urllib.parse.quote(url, safe='/:%?=&')}"
    return f"{base_url}/{urllib.parse.quote(url, safe='/:%?=&')}"


def get_blog_url(post: dict, request: Request) -> str:
    base_url = get_public_site_url(request)
    slug = urllib.parse.quote(post["slug"].strip("/"))
    return f"{base_url}/blog/{slug}"


def default_hashtags(post: dict) -> str:
    return CATEGORY_HASHTAGS.get(post.get("category", ""), DEFAULT_FACEBOOK_HASHTAGS)


def build_facebook_message(post: dict) -> str:
    message = strip_html(post.get("facebook_post_text"))
    hashtags = strip_html(post.get("facebook_hashtags")) or default_hashtags(post)
    if not message:
        intro = compact_text(post.get("excerpt_fr") or post.get("title_fr") or "", 220)
        message = intro
    if hashtags and hashtags not in message:
        message = f"{message}\n\n{hashtags}".strip()
    return message


def build_facebook_share_payload(post: dict, request: Request) -> dict:
    base_url = get_public_site_url(request)
    link = get_blog_url(post, request)
    title = compact_text(post.get("facebook_title") or post.get("title_fr") or "", 110)
    description = compact_text(post.get("facebook_description") or post.get("excerpt_fr") or "", 220)
    image = absolutize_url(post.get("facebook_image") or post.get("featured_image"), base_url)

    return {
        "platform": "facebook",
        "posting_mode": "feed_link_with_open_graph",
        "message": build_facebook_message(post),
        "link": link,
        "link_preview": {
            "title": title,
            "description": description,
            "image": image,
            "domain": urllib.parse.urlparse(base_url).netloc.upper(),
            "url": link,
        },
    }


@router.get("/posts")
async def get_blog_posts(status: Optional[str] = None, limit: int = 100):
    query = {}
    if status:
        query["status"] = status
    posts = await db.blog_posts.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    return posts

@router.get("/posts/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post and len(slug) > 50:
        post = await db.blog_posts.find_one({"slug": slug[:50]}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post

@router.post("/posts", dependencies=[Depends(get_current_user)])
async def create_blog_post(post: BlogPostCreate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    slug = post.title_fr.lower().replace(" ", "-").replace("'", "")[:50]
    post_dict = post.model_dump()
    post_dict["slug"] = slug
    post_dict["id"] = slug
    post_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    post_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    post_dict["author_id"] = user["_id"]
    share_to_social = post_dict.pop("share_to_social", False)
    await db.blog_posts.insert_one(post_dict)
    post_dict.pop("_id", None)
    if share_to_social and post_dict["status"] == "published":
        logger.info(f"Social media sharing requested for post: {post_dict['title_fr']}")
        created_at = datetime.now(timezone.utc).isoformat()
        facebook_share = build_facebook_share_payload(post_dict, request)
        await db.social_share_queue.insert_one({
            "id": f"facebook-{post_dict['id']}-{secrets.token_urlsafe(6)}",
            "platform": "facebook",
            "post_id": post_dict["id"],
            "post_title": post_dict["title_fr"],
            "post_url": facebook_share["link"],
            "facebook_message": facebook_share["message"],
            "facebook_preview": facebook_share["link_preview"],
            "created_at": created_at,
            "updated_at": created_at,
            "status": "pending",
            "payload": facebook_share
        })
    return post_dict

@router.put("/posts/{post_id}", dependencies=[Depends(get_current_user)])
async def update_blog_post(post_id: str, post_update: BlogPostUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    update_data = {k: v for k, v in post_update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    updated_post = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return updated_post

@router.delete("/posts/{post_id}", dependencies=[Depends(get_current_user)])
async def delete_blog_post(post_id: str, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}
