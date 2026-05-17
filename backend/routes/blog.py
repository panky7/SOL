from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
import logging

from routes import db
from routes.auth import get_current_user

router = APIRouter(prefix="/blog")
logger = logging.getLogger(__name__)


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
        await db.social_share_queue.insert_one({
            "post_id": post_dict["id"],
            "post_title": post_dict["title_fr"],
            "post_url": f"/blog/{post_dict['slug']}",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "pending"
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
