# Sophie Lamour - Life Coaching Website PRD

## Original Problem Statement
Build a modern, elegant, SEO-optimised life coaching website for Sophie Lamour. French (primary) with English toggle. Non-technical admin panel for blogs and testimonials. Blue gradient color palette. Native contact form with RGPD consent, WhatsApp contact button, Google Maps, Rich Text Editor for blog creation.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI (modular routes) + MongoDB (Motor async driver)
  - `server.py` — thin orchestrator, startup/shutdown, CORS
  - `routes/__init__.py` — shared db connection
  - `routes/auth.py` — JWT auth, login/logout/me
  - `routes/blog.py` — blog CRUD
  - `routes/testimonials.py` — testimonials CRUD
  - `routes/contact.py` — contact form + admin view
  - `routes/uploads.py` — file uploads/downloads (MongoDB binary)
- **Auth**: JWT (httpOnly cookies) with bcrypt
- **Rich Text**: Vanilla Quill 2.x (useRef, React 19 safe)
- **i18n**: Custom LanguageContext (FR/EN toggle)
- **File Storage**: MongoDB binary (base64) for Kubernetes persistence
- **SEO**: sitemap.xml, robots.txt, Helmet meta tags on all pages

## Site Structure
### Navigation: Accueil | Qui suis-je ? | Services (dropdown) | Blog | Contact

### Services (5 bookable, in dropdown):
1. Accompagnement personnel
2. Accompagnement professionnel
3. Accompagnement parentalite
4. Home Organising
5. Yoga du Rire

### Techniques (homepage "Mes outils & approches" section):
1. Ikigai
2. Art-therapie
3. Pleine conscience

## Key Endpoints
- POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
- GET/POST /api/blog/posts, GET/PUT/DELETE /api/blog/posts/:id
- GET/POST /api/testimonials, PUT/DELETE /api/testimonials/:id
- POST /api/contact, GET /api/contact/requests (admin)
- POST /api/uploads, GET /api/uploads/:id, GET /api/uploads/:id/thumbnail

## Admin Credentials
- Email: admin@sophielamour.com
- Password: SophieAdmin2025!

## Completed
- All core pages, services, techniques
- Logo with "Coach de vie & developpement" tagline
- Updated logo to client's ChatGPT-generated transparent PNG (2026-04-28)
- Favicon matching logo botanical element
- Admin dashboard (blogs, testimonials, contact messages)
- Blog CRUD with rich text editor
- Contact form with RGPD + service checkboxes
- SEO: sitemap.xml, robots.txt, standardized meta titles
- Backend modularized into route files
- Gmail SMTP email notifications on contact form submission
- "Mes certifications" section on About page with 4 diploma images in lightbox (2026-04-22)
- Certification badges on all 4 service pages with lightbox modals (2026-04-22)
- Diplomas converted from PDF to JPG photo display with lightbox (2026-04-22)
- Privacy Policy page (/privacy) and Terms of Service page (/terms) (2026-04-22)
- Meta domain verification tag added for Facebook (2026-04-22)
- Footer links to Privacy Policy and CGU (2026-04-22)

## P1 - Pending (Blocked on user input)
- Facebook Feed Integration (needs Meta Developer credentials or manual approach decision)
- Google Reviews Integration (needs Google Places API key + Place ID)

## P2 - Backlog
- Social media auto-posting for blogs
- Restrict CORS to specific production origins
