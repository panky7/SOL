# Sophie Lamour - Life Coaching Website Documentation

## Project Overview
A modern, elegant life coaching website for Sophie Lamour, featuring a beautiful blue gradient color palette, multi-page navigation, admin panel for content management, and bilingual support (French/English).

---

## 🎨 Color Palette

### Primary Colors
- **Navy Dark**: `#03045E` - Main text, headings
- **Blue Dark**: `#023E8A` - Secondary text, subheadings  
- **Blue Medium**: `#0077B6` - Links, primary buttons
- **Bright Blue**: `#0096C7` - Hover states, accents

### Secondary Colors
- **Cyan Blue**: `#00B4D8` - Highlights, CTAs
- **Light Cyan**: `#48CAE4` - Icons, decorative elements
- **Very Light Cyan**: `#90E0EF` - Subtle backgrounds
- **Pale Cyan**: `#ADE8F4` - Borders, dividers
- **Very Pale Cyan**: `#CAF0F8` - Section backgrounds

### Additional
- **White**: `#FFFFFF` - Main background
- **WhatsApp Green**: `#25D366` - WhatsApp button

---

## 📱 Contact Information

- **Email**: contact@sophielamour.com
- **Phone**: +33 6 89 84 47 78
- **WhatsApp**: https://wa.me/33689844778
- **Location**: Château-Landon 77570, France
- **Google Maps**: https://www.google.com/maps/place/Château-Landon,+77570+France/@48.1522,2.7006,13z

---

## 📄 Page Structure

### 1. HOME (Accueil) `/`
**Purpose**: Landing page showcasing Sophie's services and value proposition

**Sections**:
- **Hero Section**:
  - Large heading: "Découvrez votre raison d'être"
  - Brief intro paragraph
  - Two CTAs: "Prendre rendez-vous" and "En savoir plus"
  - Professional photo of Sophie
  
- **Services Grid** (6 cards):
  1. Accompagnement Personnel - Personal coaching
  2. Accompagnement Professionnel - Professional coaching
  3. Accompagnement Parentalité - Parenting support
  4. Home Organising - Home organization
  5. Ikigaï - Finding purpose
  6. Art-thérapie - Art therapy
  
- **Testimonials Carousel**:
  - Client testimonials with 5-star ratings
  - Name, photo (optional), quote
  - Smooth carousel navigation
  
- **Blog Preview**:
  - 3 latest published blog posts
  - Thumbnail, title, excerpt, date
  - "Lire la suite" links
  
- **CTA Banner**:
  - "Prêt à commencer votre transformation?"
  - Direct link to appointment booking

**Key Features**:
- Smooth scroll behavior
- Hover animations on service cards
- Responsive grid layouts
- SEO optimized meta tags

---

### 2. QUI SUIS-JE? (About) `/qui-suis-je`
**Purpose**: Tell Sophie's story and establish credibility

**Content**:
- **Hero Section**:
  - Main heading: "Qui suis-je?"
  - Professional photo of Sophie
  
- **Sophie's Story**:
  - Personal introduction
  - 20+ years in commerce
  - 2018 transformation moment
  - Journey to coaching (2020)
  
- **Core Values** (4 cards):
  1. **Bienveillance** - Kindness & non-judgment
  2. **Authenticité** - Living according to values
  3. **Lâcher-prise** - Letting go & releasing energy
  4. **Quête de sens** - Search for meaning & purpose
  
- **Professional Journey**:
  - Coaching certifications
  - Ikigaï philosophy training
  - Laughter yoga certification

**Design Elements**:
- Two-column layout (text + photo)
- Value cards with hover effects
- Timeline-style content presentation

---

### 3. SERVICES (Hub Page) `/services`
**Purpose**: Overview of all coaching services offered

**Content**:
- Introduction paragraph
- 4 main service categories displayed as cards:
  1. Accompagnement Personnel
  2. Accompagnement Professionnel
  3. Accompagnement Parentalité
  4. Home Organising
  
- Each card includes:
  - Icon
  - Service title
  - Brief description
  - "Découvrir" link to detailed page

**Navigation**: Links to individual service pages

---

### 4. SERVICES - SUB-PAGES

#### a) `/services/personnel` - Personal Coaching
**Target Audience**: Individuals seeking life balance and purpose

**Key Questions Addressed**:
- Feeling lost in life?
- Facing a new life stage?
- Feeling exhausted or overwhelmed?

**What to Expect**:
- Exploring passions and forgotten dreams
- Navigating life transitions
- Stress management and emotional regulation
- Finding inner balance

---

#### b) `/services/professionnel` - Professional Coaching
**Target Audience**: Professionals in career transition or seeking alignment

**Key Questions Addressed**:
- Professional transition period?
- Overwhelmed by daily work?
- Have an idea but hesitate to launch?

**What to Expect**:
- Career reorientation support
- Work-life organization
- Project structuring and action planning
- Aligning career with values

---

#### c) `/services/parentalite` - Parenting Support
**Target Audience**: Parents and expecting parents

**Key Questions Addressed**:
- Expecting or just welcomed a newborn?
- Child going through difficult period?
- Tensions with teenager?

**What to Expect**:
- Pregnancy and newborn preparation
- Emotional management for children
- Family conflict resolution
- Adolescent relationship building

---

#### d) `/services/home-organising` - Home Organization
**Target Audience**: Those seeking a harmonious living environment

**Key Questions Addressed**:
- Home feels cluttered or oppressive?
- Need a more harmonious environment?
- Want to focus on essentials?

**What to Expect**:
- Space simplification
- Mental clarity through organization
- Creating a soothing environment
- Focusing on what matters

---

### 5. BLOG `/blog`
**Purpose**: Share insights, tips, and thought leadership

**Features**:
- Grid layout of all published posts
- Each post card shows:
  - Featured image (if available)
  - Publication date
  - Category tag
  - Title (FR/EN)
  - Excerpt (FR/EN)
  - "Lire la suite" link
  
**Post Categories**:
- Développement personnel
- Coaching
- Parentalité
- Bien-être
- Organisation

**Individual Post Page** `/blog/:slug`:
- Full article content
- Featured image
- Meta information (date, category, author)
- Social sharing buttons (Facebook, LinkedIn)
- Back to blog navigation

**SEO Features**:
- Auto-generated meta descriptions
- Open Graph tags
- Unique slugs based on French title

---

### 6. TÉMOIGNAGES (Testimonials) `/temoignages`
**Purpose**: Social proof and client success stories

**Display**:
- Grid layout (3 columns on desktop)
- Each testimonial includes:
  - Opening quote mark
  - Client quote (FR/EN)
  - Star rating (1-5)
  - Client name
  - Photo (optional)

**Management**:
- Fully manageable from admin panel
- Add/edit/delete capabilities

---

### 7. RENDEZ-VOUS (Appointments) `/rendez-vous`
**Purpose**: Book coaching sessions

**Features**:
- **Calendly Integration**:
  - Embedded booking calendar
  - Direct availability viewing
  - Automatic confirmation emails
  - Timezone handling
  
- **Fallback Option**:
  - "Can't find suitable time?" message
  - Direct link to contact page

**Booking Flow**:
1. User visits page
2. Views available slots via Calendly
3. Selects date/time
4. Completes booking form
5. Receives confirmation

---

### 8. CONTACT `/contact`
**Purpose**: Direct communication channel

**Contact Methods**:
1. **Email**: contact@sophielamour.com
2. **Phone**: +33 6 89 84 47 78 (clickable tel: link)
3. **WhatsApp**: Direct chat button (https://wa.me/33689844778)
4. **Location**: France

**Contact Form Fields**:
- Name (required)
- Email (required)
- Phone (optional)
- Subject (required)
- Message (required)

**Form Behavior**:
- Stores submissions in MongoDB
- Displays success/error messages
- Clears form after successful submission
- Visible in admin dashboard

**Additional Features**:
- Office location info (if provided)
- Social media links
- Floating WhatsApp button (site-wide)

---

## 🔐 Admin Panel

### Access
- **URL**: `/admin/login`
- **Email**: admin@sophielamour.com
- **Password**: SophieAdmin2025!

### Dashboard `/admin/dashboard`

**Three Main Tabs**:

#### 1. Articles de blog (Blog Posts)
**Features**:
- Table view of all posts (published + drafts)
- Columns: Title, Status, Date, Actions
- **Actions**:
  - ✏️ Edit post
  - 🗑️ Delete post (with confirmation)
  - ➕ Create new post

**Create/Edit Blog Post**:
- Title (French & English)
- Excerpt (French & English)
- Content (French & English) - HTML supported
- Featured image URL
- Category dropdown
- Status: Draft or Published
- **Social Media Sharing**:
  - Checkbox: "Share automatically to social media"
  - When checked + published, queues post for sharing
  - Backend stores in `social_share_queue` collection
  - Ready for Facebook, Instagram, LinkedIn integration

#### 2. Témoignages (Testimonials)
**Features**:
- Grid/card view of all testimonials
- **Actions**:
  - Edit testimonial
  - Delete testimonial (with confirmation)
  - Add new testimonial

**Create/Edit Testimonial**:
- Client name
- Testimonial text (French & English)
- Star rating (1-5)
- Photo URL (optional)

#### 3. Messages (Contact Requests)
**Features**:
- List view of all contact form submissions
- Display: Name, Email, Phone, Subject, Message, Date
- Read-only view
- Sorted by date (newest first)

**No Actions**: View only (emails sent automatically)

---

## 🌐 Internationalization (i18n)

### Supported Languages
- **French (FR)** - Primary
- **English (EN)** - Secondary

### Language Toggle
- Located in header (top-right)
- Format: "FR / EN"
- Active language displayed in bold blue
- Instant switching without page reload

### How It Works
- React Context (`LanguageContext`)
- `useLanguage()` hook provides:
  - `language` - current language
  - `toggleLanguage()` - switch function
  - `t(french, english)` - translation function

### Content Structure
- All user-facing text uses `t()` function
- Example: `t('Bonjour', 'Hello')`
- Blog posts store both FR and EN versions
- Testimonials store both FR and EN text

---

## 🎯 Key Features

### 1. Floating WhatsApp Button
- **Position**: Fixed bottom-right corner
- **Color**: WhatsApp green gradient
- **Behavior**:
  - Fades in after 1 second
  - Scales on hover
  - Shows "WhatsApp" tooltip
  - Direct link to wa.me/33689844778
- **Visibility**: All public pages (not admin)

### 2. Responsive Design
- **Mobile**: < 768px
  - Hamburger menu
  - Stacked layouts
  - Full-width cards
  
- **Tablet**: 768px - 1024px
  - 2-column grids
  - Collapsible navigation
  
- **Desktop**: > 1024px
  - Full navigation bar
  - 3-column grids
  - Wider layouts

### 3. SEO Optimization
- Unique meta title per page
- Meta descriptions
- Semantic HTML5 (article, section, header, footer, nav)
- Clean URL slugs
- Alt text on images
- Open Graph tags ready
- Mobile-first approach

**JSON-LD Structured Data** (Ready to implement):
- LocalBusiness schema
- Person schema (Sophie Lamour)
- BlogPosting schema
- BreadcrumbList schema

### 4. Performance
- Hot reload during development
- Image lazy loading
- Smooth scroll behavior
- Transition animations
- Optimized bundle size

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: React 18
- **Router**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Carousel**: Embla Carousel React
- **SEO**: React Helmet Async
- **HTTP Client**: Axios
- **Notifications**: Sonner (Shadcn UI)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor - async driver)
- **Authentication**: JWT tokens
- **Password Hashing**: bcrypt
- **Validation**: Pydantic

### Infrastructure
- **Environment**: Kubernetes container
- **Frontend Port**: 3000 (internal)
- **Backend Port**: 8001 (internal)
- **Database**: MongoDB (local via MONGO_URL)
- **Supervisor**: Auto-restart on file changes

---

## 🗂️ Database Collections

### 1. `users`
```json
{
  "_id": ObjectId,
  "email": "admin@sophielamour.com",
  "password_hash": "bcrypt hash",
  "name": "Sophie Lamour",
  "role": "admin",
  "created_at": "ISO date"
}
```

### 2. `blog_posts`
```json
{
  "_id": ObjectId,
  "id": "slug-based-id",
  "slug": "url-friendly-slug",
  "title_fr": "French title",
  "title_en": "English title",
  "content_fr": "French content (HTML)",
  "content_en": "English content (HTML)",
  "excerpt_fr": "French excerpt",
  "excerpt_en": "English excerpt",
  "featured_image": "image URL",
  "category": "Category name",
  "status": "draft | published",
  "author_id": "user ObjectId",
  "created_at": "ISO date",
  "updated_at": "ISO date"
}
```

### 3. `testimonials`
```json
{
  "_id": ObjectId,
  "id": "random-id",
  "name": "Client name",
  "text_fr": "French testimonial",
  "text_en": "English testimonial",
  "rating": 5,
  "photo": "optional photo URL",
  "created_at": "ISO date"
}
```

### 4. `contact_requests`
```json
{
  "_id": ObjectId,
  "id": "random-id",
  "name": "Sender name",
  "email": "sender@email.com",
  "phone": "optional phone",
  "subject": "Message subject",
  "message": "Message content",
  "status": "new",
  "created_at": "ISO date"
}
```

### 5. `social_share_queue`
```json
{
  "_id": ObjectId,
  "post_id": "blog post id",
  "post_title": "Post title",
  "post_url": "/blog/slug",
  "status": "pending",
  "created_at": "ISO date"
}
```

---

## 🔒 Security

### Authentication
- JWT-based authentication
- HTTPOnly cookies for token storage
- Secure password hashing with bcrypt
- Protected admin routes

### Environment Variables
- Never hardcoded in codebase
- Stored in `.env` files
- Backend: `JWT_SECRET`, `MONGO_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Frontend: `REACT_APP_BACKEND_URL`

### API Security
- CORS configured for frontend domain
- Protected endpoints require authentication
- Role-based access control (admin only)

---

## 📝 Content Management Workflow

### Adding a Blog Post
1. Login to admin panel
2. Navigate to "Articles de blog" tab
3. Click "Nouvel article"
4. Fill in:
   - Title (FR & EN)
   - Excerpt (FR & EN)
   - Content (FR & EN) - HTML supported
   - Featured image URL
   - Select category
   - Choose status (draft/published)
   - Optional: Check "Share to social media"
5. Click "Créer l'article"
6. Post appears on blog page if published

### Adding a Testimonial
1. Login to admin panel
2. Navigate to "Témoignages" tab
3. Click "Nouveau témoignage"
4. Fill in:
   - Client name
   - Testimonial text (FR & EN)
   - Star rating (1-5)
   - Optional: Photo URL
5. Click "Créer le témoignage"
6. Testimonial appears on testimonials page & homepage carousel

### Viewing Contact Messages
1. Login to admin panel
2. Navigate to "Messages" tab
3. View all submissions
4. Messages sorted by date (newest first)
5. Contains: Name, Email, Phone, Subject, Message, Timestamp

---

## 🚀 Deployment

### Production URLs
- **Frontend**: https://sophie-coaching.preview.emergentagent.com
- **Backend API**: https://sophie-coaching.preview.emergentagent.com/api

### Environment Setup
```bash
# Backend
MONGO_URL=mongodb://localhost:27017
DB_NAME=sophie_coaching_db
JWT_SECRET=<secure-random-string>
ADMIN_EMAIL=admin@sophielamour.com
ADMIN_PASSWORD=SophieAdmin2025!
FRONTEND_URL=https://sophie-coaching.preview.emergentagent.com

# Frontend
REACT_APP_BACKEND_URL=https://sophie-coaching.preview.emergentagent.com
```

### Hot Reload
- Frontend and backend auto-restart on code changes
- Manual restart needed for:
  - `.env` file changes
  - New dependencies installation

```bash
# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

---

## 🧪 Testing

### Credentials File
Location: `/app/memory/test_credentials.md`

Contains:
- Admin email & password
- API endpoints
- Test user accounts (if any)

### Testing Checklist
- ✅ All pages load correctly
- ✅ Navigation functional
- ✅ Language toggle works
- ✅ Forms submit successfully
- ✅ Admin login works
- ✅ Blog post creation/editing
- ✅ Testimonial management
- ✅ Contact form submission
- ✅ WhatsApp button redirects
- ✅ Responsive on mobile/tablet/desktop
- ✅ SEO meta tags present

---

## 📞 Support & Maintenance

### Common Tasks

#### Update Phone Number
Search and replace in:
- `/app/frontend/src/components/Footer.js`
- `/app/frontend/src/pages/Contact.js`
- `/app/frontend/src/pages/About.js`
- `/app/frontend/src/pages/Home.js`
- WhatsApp links

#### Change Admin Password
1. Update in `/app/backend/.env`
2. Restart backend: `sudo supervisorctl restart backend`
3. Password auto-syncs on next startup
4. Update `/app/memory/test_credentials.md`

#### Add New Service
1. Add to services array in `/app/frontend/src/pages/Home.js`
2. Create new page in `/app/frontend/src/pages/Service[Name].js`
3. Add route in `/app/frontend/src/App.js`
4. Update navigation if needed

#### Customize Colors
All colors defined in `/app/frontend/src/index.css`:
```css
:root {
  --navy-dark: #03045E;
  --blue-dark: #023E8A;
  /* ... etc */
}
```

---

## 🎨 Design System

### Typography
- **Headings**: Playfair Display (serif)
  - Weights: 400, 500, 600, 700
  - Usage: H1, H2, H3, card titles
  
- **Body**: Nunito (sans-serif)
  - Weights: 300, 400, 500, 600, 700
  - Usage: Paragraphs, buttons, UI text

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

### Border Radius
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **full**: 9999px (pills/circles)

### Shadows
- **sm**: `0 1px 2px rgba(0,0,0,0.05)`
- **md**: `0 4px 6px rgba(0,0,0,0.1)`
- **lg**: `0 10px 15px rgba(0,0,0,0.1)`
- **xl**: `0 20px 25px rgba(0,0,0,0.1)`

---

## 📋 Future Enhancements

### Ready to Implement
1. **Social Media Auto-Posting**
   - Facebook API integration
   - Instagram API integration
   - LinkedIn API integration
   - OAuth authentication flow
   - Automatic post on blog publish

2. **Advanced SEO**
   - XML sitemap generation
   - robots.txt customization
   - JSON-LD structured data
   - Google Analytics 4 integration

3. **Enhanced Blog**
   - Tags/categories filtering
   - Search functionality
   - Related posts
   - Comments system

4. **Email Integration**
   - Automated booking confirmations
   - Contact form auto-replies
   - Newsletter signup
   - Email notifications for admin

5. **Multi-media**
   - Video testimonials
   - Audio recordings
   - Image galleries
   - PDF downloads

---

## 📄 File Structure

```
/app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── .env                   # Backend environment variables
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js            # Site header & navigation
│   │   │   ├── Footer.js            # Site footer
│   │   │   ├── WhatsAppButton.js    # Floating WhatsApp button
│   │   │   ├── ProtectedRoute.js    # Auth guard for admin
│   │   │   └── ui/                  # Shadcn UI components
│   │   │
│   │   ├── contexts/
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   └── LanguageContext.js   # i18n state
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.js              # Homepage
│   │   │   ├── About.js             # Qui suis-je
│   │   │   ├── Services.js          # Services hub
│   │   │   ├── ServicePersonnel.js  # Personal coaching
│   │   │   ├── ServiceProfessionnel.js
│   │   │   ├── ServiceParentalite.js
│   │   │   ├── ServiceHomeOrganising.js
│   │   │   ├── Blog.js              # Blog listing
│   │   │   ├── BlogPost.js          # Individual post
│   │   │   ├── Testimonials.js      # Testimonials page
│   │   │   ├── Appointment.js       # Calendly booking
│   │   │   ├── Contact.js           # Contact form
│   │   │   ├── AdminLogin.js        # Admin authentication
│   │   │   ├── AdminDashboard.js    # Admin panel
│   │   │   ├── BlogEditor.js        # Blog post editor
│   │   │   └── TestimonialEditor.js # Testimonial editor
│   │   │
│   │   ├── lib/
│   │   │   └── cn.js                # Utility functions
│   │   │
│   │   ├── App.js                   # Main app component & routing
│   │   ├── App.css                  # App-specific styles
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles & Tailwind
│   │
│   ├── .env                   # Frontend environment variables
│   ├── package.json           # Node dependencies
│   └── tailwind.config.js     # Tailwind configuration
│
└── memory/
    └── test_credentials.md    # Test accounts & credentials
```

---

## 🆘 Troubleshooting

### Issue: Frontend not loading
**Solution**: Check supervisor status
```bash
sudo supervisorctl status frontend
tail -n 50 /var/log/supervisor/frontend.err.log
```

### Issue: API calls failing
**Solution**: Check backend logs
```bash
sudo supervisorctl status backend
tail -n 50 /var/log/supervisor/backend.err.log
```

### Issue: Admin login not working
**Solution**: Verify credentials in backend .env
```bash
cat /app/backend/.env | grep ADMIN
```

### Issue: Changes not reflecting
**Solution**: Restart services
```bash
sudo supervisorctl restart backend frontend
```

### Issue: Database connection error
**Solution**: Check MongoDB status and MONGO_URL
```bash
echo $MONGO_URL
# Should point to mongodb://localhost:27017
```

---

## 📊 Analytics & Metrics

### Key Performance Indicators (KPIs)
- Page load time
- Bounce rate
- Contact form submissions
- Blog post views
- Appointment bookings
- Testimonial engagement

### Google Analytics Setup (Future)
1. Create GA4 property
2. Get Measurement ID
3. Add to frontend .env
4. Install gtag script in index.html
5. Track custom events (form submissions, button clicks)

---

## ✅ Launch Checklist

- [x] All pages functional
- [x] Mobile responsive
- [x] SEO meta tags
- [x] Contact info updated
- [x] WhatsApp integration
- [x] Admin panel working
- [x] Blog system operational
- [x] Testimonials manageable
- [x] Language toggle functional
- [x] All forms submitting
- [ ] Social media links updated (when available)
- [ ] Calendly embedded (requires Calendly account)
- [ ] Google Analytics added (if desired)
- [ ] SSL certificate (handled by hosting)
- [ ] Custom domain (if applicable)

---

**Last Updated**: April 4, 2026
**Version**: 1.0
**Maintained by**: Emergent AI Development Team
