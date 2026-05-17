from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
import secrets

from routes import db
from routes.auth import get_current_user

router = APIRouter(prefix="/testimonials")


class TestimonialCreate(BaseModel):
    name: str
    text_fr: str
    text_en: str
    rating: int = Field(ge=1, le=5)
    photo: Optional[str] = None

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    text_fr: Optional[str] = None
    text_en: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    photo: Optional[str] = None


@router.get("")
async def get_testimonials():
    testimonials = await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return testimonials

@router.post("", dependencies=[Depends(get_current_user)])
async def create_testimonial(testimonial: TestimonialCreate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    testimonial_dict = testimonial.model_dump()
    testimonial_dict["id"] = secrets.token_urlsafe(8)
    testimonial_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.testimonials.insert_one(testimonial_dict)
    testimonial_dict.pop("_id", None)
    return testimonial_dict

@router.put("/{testimonial_id}", dependencies=[Depends(get_current_user)])
async def update_testimonial(testimonial_id: str, testimonial_update: TestimonialUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    update_data = {k: v for k, v in testimonial_update.model_dump().items() if v is not None}
    result = await db.testimonials.update_one({"id": testimonial_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    updated = await db.testimonials.find_one({"id": testimonial_id}, {"_id": 0})
    return updated

@router.delete("/{testimonial_id}", dependencies=[Depends(get_current_user)])
async def delete_testimonial(testimonial_id: str, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}
