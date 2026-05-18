# Database Architect Agent Design System
This document formally designs and details the schema design, indexing strategy, data structures, and lifecycle migrations managed by the **DB Architect Agent** for your MongoDB layer.

---

## 🏗️ 1. Database Collections & Architecture Schema

We use a document-oriented structure that ensures complete atomicity, indexing performance, and zero-cost scaling on MongoDB Atlas.

### 👤 Collection: `users`
Represents administrators and dashboard operators.

```typescript
interface UserSchema {
  _id: ObjectId;
  email: string;             // Indexed, Unique. Sanitized lowercase.
  password_hash: string;     // Argon2/Bcrypt hash.
  name: string;              // Human name display.
  role: "admin" | "moderator";
  created_at: string;        // ISO 8601 Timestamp.
}
```
*   **Indices**:
    *   `email_unique_idx`: `{ email: 1 }` (Unique)

---

### 📝 Collection: `blog_posts`
Holds rich multilingual content (French & English) for posts, excerpts, categories, and scheduled events.

```typescript
interface BlogPostSchema {
  _id: ObjectId;
  id: string;                // URL safe slug-based ID
  slug: string;              // Indexed, Unique. URL clean.
  title_fr: string;          // French post title
  title_en: string;          // English post title
  content_fr: string;        // HTML rich Quill text
  content_en: string;        // HTML rich Quill text
  excerpt_fr: string;        // Clean summary for cards
  excerpt_en: string;        // Clean summary for cards
  featured_image: string;    // S3/CDN Image URL
  category: string;          // E.g., 'Coaching', 'Bien-être'
  status: "draft" | "published"; // Publication state
  created_at: string;        // ISO 8601 Timestamp
  updated_at: string;        // ISO 8601 Timestamp
  author_id: string;         // User._id reference
}
```
*   **Indices**:
    *   `slug_unique_idx`: `{ slug: 1 }` (Unique)
    *   `created_at_desc_idx`: `{ created_at: -1 }` (For fast timeline retrieval)
    *   `status_created_idx`: `{ status: 1, created_at: -1 }` (Compound index for frontend public feed)

---

### 💬 Collection: `testimonials`
Contains client quotes, metadata, ratings, and picture URLs.

```typescript
interface TestimonialSchema {
  _id: ObjectId;
  id: string;                // URL safe short-token ID
  name: string;              // Client name
  text_fr: string;           // Review body French
  text_en: string;           // Review body English
  rating: number;            // Range [1-5]
  photo: string;             // Client avatar URL
  created_at: string;        // ISO 8601 Timestamp
}
```
*   **Indices**:
    *   `created_at_desc_idx`: `{ created_at: -1 }` (For listing order)

---

### 📬 Collection: `contact_requests`
Maintains user-submitted inquiries, tags, emails, and response status trackers.

```typescript
interface ContactRequestSchema {
  _id: ObjectId;
  id: string;                // Clean token identifier
  firstName: string;         // Client first name
  lastName: string;          // Client last name
  email: string;             // Contact email
  phone: string | null;      // Optional phone number
  interestedServices: string[]; // List of service ids
  message: string;           // Escaped/sanitized message
  consent: boolean;          // Explicit GDPR accept
  status: "new" | "in_progress" | "resolved"; // Operational tracker
  created_at: string;        // ISO 8601 Timestamp
}
```
*   **Indices**:
    *   `created_at_desc_idx`: `{ created_at: -1 }` (For admin dashboard queue)
    *   `status_created_idx`: `{ status: 1, created_at: -1 }` (Compound for status triage)

---

### 📂 Collection: `uploads`
Tracks assets uploaded by dashboard admins, keeping raw payloads and thumbnails.

```typescript
interface UploadSchema {
  _id: ObjectId;
  file_id: string;           // Indexed, Unique UUID
  original_name: string;     // Sanitized original filename
  content_type: string;      // E.g. 'image/webp' or 'video/mp4'
  size: number;              // In bytes
  is_image: boolean;
  is_video: boolean;
  data: string;              // Base64 encoded file payload
  thumbnail_data: string | null; // Base64 thumbnail payload
  thumbnail: string | null;  // Thumbnail access API endpoint
  created_at: string;        // ISO 8601 Timestamp
  uploaded_by: string;       // User._id reference
}
```
*   **Indices**:
    *   `file_id_unique_idx`: `{ file_id: 1 }` (Unique)

---

## ⚡ 2. Schema Seeding & Automated Migration Engine

When your FastAPI backend boots up on AWS Lambda or local dev setups, the **DB Architect Agent** triggers an auto-migration script within [server.py](file:///c:/Users/sharm/OneDrive/Documents/sophielamour/backend/server.py). 

### Auto-Migration Steps:
1. **Index Verification**: Runs `create_index` safely (does nothing if index exists).
2. **Filesystem Upload Sync**: Automatically migrates any local legacy uploads in the `/uploads/` directory into secure MongoDB documents (with automated base64 packaging and on-the-fly thumbnail generation).
3. **Super-Admin Seeding**: Validates whether the default administrative account is configured. If not, it generates the user securely using password hashing. If existing but configured with a different security baseline, it hot-updates the account hash dynamically.
