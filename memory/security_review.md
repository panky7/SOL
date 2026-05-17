# Security Architecture Review & Audit Report

**Prepared by:** Senior Security Architect  
**Status:** Audit Complete  
**Application:** Sophie Lamour Full-Stack Application  
**Focus:** Security-by-Design, OWASP Top 10, Cloud Deployment Readiness  

---

## Executive Summary
A comprehensive security review has been performed across the Python (FastAPI) backend and React frontend repositories. The application contains several high-risk security vulnerabilities and misconfigurations that must be addressed before public cloud deployment. 

The most critical concerns include **HTML Injection via Email Templates** (leading to Email Client XSS), **Insecure Cookie Flags** in the authentication flow, and **Insecure CORS Wildcard configurations**.

Below is a detailed classification of the identified issues, their risk impact, and exact remediation instructions.

---

## Vulnerability Registry

| ID | Vulnerability Name | Severity | Status | OWASP Category | Affected File(s) |
|---|---|---|---|---|---|
| **SEC-01** | HTML Injection / Email XSS in Contact Form | **High** | Open | A03:2021-Injection | `backend/routes/contact.py` |
| **SEC-02** | Insecure Cookie Flags (Missing Secure/SameSite Enforcement) | **High** | Open | A01:2021-Broken Access Control | `backend/routes/auth.py` |
| **SEC-03** | Insecure CORS Wildcard with Credentials Enabled | **Medium** | Open | A05:2021-Security Misconfiguration | `backend/server.py` |
| **SEC-04** | Missing File Name Sanitization in Upload Headers | **Medium** | Open | A03:2021-Injection | `backend/routes/uploads.py` |
| **SEC-05** | Dead / Inoperable Refresh Token Mechanism | **Low** | Open | A01:2021-Broken Access Control | `backend/routes/auth.py` |
| **SEC-06** | Lack of Rate Limiting on Sensitive Public Endpoints | **Medium** | Open | A04:2021-Insecure Design | `backend/routes/contact.py`, `/auth/login` |

---

## Detailed Findings & Remediation

### SEC-01: HTML Injection / Email XSS in Contact Form
- **Threat:** An attacker can input arbitrary HTML tags (e.g., `<script>`, `<iframe>`, or phishing links) into the contact form fields (`firstName`, `lastName`, `message`). The backend constructs an HTML-formatted notification email using these raw parameters and sends it to the administrator. When the administrator opens the email, the malicious code renders in their email client context.
- **Risk Impact:** High (Phishing, session/credential theft via email client vulnerability exploitation).
- **Code Reference:** `backend/routes/contact.py` (Lines 75–108)
- **Remediation Plan:**
  Import `html` and escape all input fields before passing them to the email template:
  ```python
  import html

  first_name = html.escape(contact['firstName'])
  last_name = html.escape(contact['lastName'])
  message = html.escape(contact['message'])
  # Use escaped variables inside html_body
  ```

---

### SEC-02: Insecure Cookie Flags (Missing Secure/SameSite Enforcement)
- **Threat:** Access and refresh tokens are stored in the browser using cookies, but the cookies are written with `secure=False` and loose `SameSite` settings.
- **Risk Impact:** High (Session Hijacking). Without `secure=True`, browsers will send these session identifiers over plain, unencrypted HTTP connections, exposing users to Man-in-the-Middle (MitM) token theft.
- **Code Reference:** `backend/routes/auth.py` (Lines 76–77)
- **Remediation Plan:**
  Extract environment variables to dynamically flag production environments:
  ```python
  is_prod = os.environ.get("ENV") == "production"
  response.set_cookie(
      key="access_token", 
      value=access_token, 
      httponly=True, 
      secure=is_prod, 
      samesite="lax" if not is_prod else "strict", 
      max_age=900, 
      path="/"
  )
  ```

---

### SEC-03: Insecure CORS Wildcard with Credentials Enabled
- **Threat:** The CORS middleware is configured to allow `*` (any origin) with `allow_credentials=True`. 
- **Risk Impact:** Medium (Cross-Origin Resource Sharing vulnerability). Although Starlette standard middleware throws an assertion error on initialization if wildcard and credentials are combined, if bypassed or deployed under loose handlers, it can expose the backend to Cross-Site Request Forgery (CSRF).
- **Code Reference:** `backend/server.py` (Lines 36–42)
- **Remediation Plan:**
  Restrict CORS origins to explicit values defined in configuration:
  ```python
  allowed_origins = [os.environ.get("FRONTEND_URL", "http://localhost:3000")]
  app.add_middleware(
      CORSMiddleware,
      allow_origins=allowed_origins,
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

### SEC-04: Missing File Name Sanitization in Upload Headers
- **Threat:** Uploaded files retain their user-supplied names. When serving these uploads via `/api/uploads/{file_id}`, the server passes the unsanitized name directly into the `Content-Disposition` header.
- **Risk Impact:** Medium (Response Header Injection). If a user uploads a file named `payload"; filename="malicious.ext`, they can manipulate header properties.
- **Code Reference:** `backend/routes/uploads.py` (Line 97)
- **Remediation Plan:**
  Sanitize files on upload. Strip quotes and invalid characters from `original_name` or dynamically generate safe names using UUIDs when serving files:
  ```python
  import re
  # Strip special characters and double quotes
  safe_name = re.sub(r'[^a-zA-Z0-9._-]', '_', file.filename)
  ```

---

### SEC-05: Dead / Inoperable Refresh Token Mechanism
- **Threat:** A refresh token cookie is created upon login but is never checked, validated, or mapped to a `/refresh` endpoint.
- **Risk Impact:** Low (Bloat / Misconfiguration). Users will be forcibly logged out after 15 minutes when their short-lived access token expires, ignoring the refresh token.
- **Remediation Plan:**
  Implement a proper `/api/auth/refresh` endpoint that decodes the refresh token, verifies its expiration, and issues a fresh access token.

---

### SEC-06: Lack of Rate Limiting
- **Threat:** High-frequency, publicly accessible routes (like submitting a message or trying passwords) are unprotected.
- **Risk Impact:** Medium (Spam / Account Takeover / Service Abuse). Attackers can brute-force the admin credentials or spam SMTP notification credits, leading to severe resource exhaustion.
- **Remediation Plan:**
  Add a rate-limiting middleware (such as `slowapi` in FastAPI) to secure `/api/contact` and `/api/auth/login`.

---

## Action Plan

The **Senior Security Architect** recommends the following structured sprint to secure this codebase:
1. **Sprint Phase 1 (Hotfixes):** Fix the HTML injection (`SEC-01`), CORS parameters (`SEC-03`), and cookie security (`SEC-02`).
2. **Sprint Phase 2 (Hardening):** Sanitize file uploads (`SEC-04`) and set up route-specific rate limiting (`SEC-06`).
3. **Sprint Phase 3 (Architecture):** Build a functional `/refresh` token endpoint (`SEC-05`) to enhance session usability.
