from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import secrets
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import html

from routes import db
from routes.auth import get_current_user

router = APIRouter(prefix="/contact")
logger = logging.getLogger(__name__)

SERVICE_LABELS = {
    "personnel": "Accompagnement personnel",
    "professionnel": "Accompagnement professionnel",
    "parentalite": "Accompagnement parentalité",
    "home-organising": "Home Organising",
    "yoga-du-rire": "Yoga du Rire",
    "autre": "Autre / Je ne sais pas encore"
}


class ContactRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = None
    interestedServices: List[str] = []
    message: str
    consent: bool = False


def send_notification_email(contact: dict):
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_email = os.environ.get("SMTP_EMAIL")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    notify_email = os.environ.get("NOTIFY_EMAIL")

    if not all([smtp_host, smtp_email, smtp_password, notify_email]):
        logger.warning("SMTP not configured, skipping email notification")
        return

    # Sanitize inputs to prevent HTML Injection / XSS in emails
    first_name_esc = html.escape(contact.get('firstName', ''))
    last_name_esc = html.escape(contact.get('lastName', ''))
    email_esc = html.escape(contact.get('email', ''))
    phone_esc = html.escape(contact.get('phone', '')) if contact.get('phone') else "Non renseigné"
    message_esc = html.escape(contact.get('message', ''))

    services_list = ""
    for svc_id in contact.get("interestedServices", []):
        label = SERVICE_LABELS.get(svc_id, svc_id)
        services_list += f"  - {html.escape(label)}\n"
    if not services_list:
        services_list = "  - Non spécifié\n"

    text_body = f"""Nouveau message de contact reçu sur sophielamourcoaching.com

Nom : {first_name_esc} {last_name_esc}
Email : {email_esc}
Téléphone : {phone_esc}

Services souhaités :
{services_list}
Message :
{message_esc}

---
Reçu le {datetime.now(timezone.utc).strftime('%d/%m/%Y à %H:%M')} UTC
Vous pouvez répondre directement à cet email pour contacter {first_name_esc}.
"""

    services_badges = ''.join(
        f'<span style="display:inline-block;background:#CAF0F8;color:#0077B6;padding:4px 12px;border-radius:20px;font-size:13px;margin:2px 4px 2px 0;">{html.escape(SERVICE_LABELS.get(s, s))}</span>' 
        for s in contact.get("interestedServices", [])
    ) or '<span style="color:#999;">Non spécifié</span>'

    html_body = f"""
<div style="font-family: 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
  <div style="background: linear-gradient(135deg, #48CAE4, #0077B6); padding: 24px 32px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px; font-weight: 600;">Nouveau message de contact</h1>
    <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">sophielamourcoaching.com</p>
  </div>
  <div style="padding: 32px; border: 1px solid #CAF0F8; border-top: none; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #023E8A; font-weight: 600; width: 140px; vertical-align: top;">Nom</td>
        <td style="padding: 8px 0; color: #03045E;">{first_name_esc} {last_name_esc}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #023E8A; font-weight: 600; vertical-align: top;">Email</td>
        <td style="padding: 8px 0; color: #03045E;"><a href="mailto:{email_esc}" style="color: #0077B6;">{email_esc}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #023E8A; font-weight: 600; vertical-align: top;">Téléphone</td>
        <td style="padding: 8px 0; color: #03045E;">{phone_esc}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #023E8A; font-weight: 600; vertical-align: top;">Services</td>
        <td style="padding: 8px 0; color: #03045E;">{services_badges}</td>
      </tr>
    </table>
    <div style="background: #f8fcfe; border-radius: 8px; padding: 20px; border-left: 4px solid #48CAE4;">
      <p style="color: #023E8A; font-weight: 600; margin: 0 0 8px; font-size: 14px;">Message :</p>
      <p style="color: #03045E; margin: 0; line-height: 1.7; white-space: pre-wrap;">{message_esc}</p>
    </div>
    <p style="color: #90A4AE; font-size: 12px; margin-top: 24px; text-align: center;">
      Répondez directement à cet email pour contacter {first_name_esc}.
    </p>
  </div>
</div>
"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Nouveau contact : {contact['firstName']} {contact['lastName']}"
    msg["From"] = f"Sophie Lamour Coaching <{smtp_email}>"
    msg["To"] = notify_email
    msg["Reply-To"] = contact["email"]

    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, [notify_email], msg.as_string())
        logger.info(f"Notification email sent for contact from {contact['email']}")
    except Exception as e:
        logger.error(f"Failed to send notification email: {e}")


@router.post("")
async def submit_contact(contact: ContactRequest):
    contact_dict = contact.model_dump()
    contact_dict["id"] = secrets.token_urlsafe(8)
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    contact_dict["status"] = "new"
    await db.contact_requests.insert_one(contact_dict)

    try:
        send_notification_email(contact_dict)
    except Exception as e:
        logger.error(f"Email notification error: {e}")

    return {"message": "Message envoy\u00e9 avec succ\u00e8s"}

@router.get("/requests", dependencies=[Depends(get_current_user)])
async def get_contact_requests(request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    requests_list = await db.contact_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return requests_list
