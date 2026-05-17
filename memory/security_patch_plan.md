# Security Patching Implementation Plan

**Prepared by:** Senior Software Architect  
**Coordinating with:** Senior Security Architect  
**Methodology:** Superpowers Task Plan  
**Target Agents:** Backend Developer, DevSecOps Engineer  

This plan outlines the specific, bite-sized tasks required to patch the critical security vulnerabilities identified in the audit report [security_review.md](file:///c:/Users/sharm/OneDrive/Documents/sophielamour/memory/security_review.md). All changes must be verified using clean local execution tests.

---

## Task Breakdown & Delegation

### Task 1: HTML Input Sanitization in Email Form (`SEC-01`)
*   **Assigned Agent:** Backend Developer  
*   **File Path:** `backend/routes/contact.py`  
*   **Objective:** Sanitize all fields submitted via the contact form to prevent HTML injection inside the notification email templates.
*   **Code Edits:**
    Import `html` at the top of the file. Inside `send_notification_email(contact: dict)`, escape the firstName, lastName, and message fields:
    ```python
    import html

    # Escape strings to prevent HTML Injection
    first_name = html.escape(contact.get('firstName', ''))
    last_name = html.escape(contact.get('lastName', ''))
    phone_line = html.escape(contact.get('phone', '')) or "Non renseigné"
    message_content = html.escape(contact.get('message', ''))
    ```
    Replace all string interpolation references inside `text_body` and `html_body` with these sanitized variables.
*   **Verification Steps:**
    1. Send a POST request to `/api/contact` with HTML payloads:
       ```json
       {
         "firstName": "<b>Test</b>",
         "lastName": "<script>alert(1)</script>",
         "email": "attacker@example.com",
         "message": "<iframe src='http://evil.com'></iframe>",
         "consent": true
       }
       ```
    2. Check the logged SMTP output or look at the saved document in MongoDB to verify that characters like `<` and `>` are replaced with `&lt;` and `&gt;`.

---

### Task 2: Secure Cookie Flag Implementation (`SEC-02`)
*   **Assigned Agent:** Backend Developer / DevSecOps Engineer  
*   **File Path:** `backend/routes/auth.py`  
*   **Objective:** Ensure cookie tokens set during login use strict flags (`secure=True`, `samesite="strict"`) when deployed in production, while maintaining safe development overrides.
*   **Code Edits:**
    Inspect the backend environment. Define a flag checking if the current environment is production:
    ```python
    # Under router definition
    ENV = os.environ.get("ENV", "development")
    is_prod = ENV == "production"
    ```
    Update the `login` function cookie settings:
    ```python
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        secure=is_prod, 
        samesite="lax" if not is_prod else "strict", 
        max_age=900, 
        path="/"
    )
    response.set_cookie(
        key="refresh_token", 
        value=refresh_token, 
        httponly=True, 
        secure=is_prod, 
        samesite="lax" if not is_prod else "strict", 
        max_age=604800, 
        path="/"
    )
    ```
*   **Verification Steps:**
    1. Run backend locally (`MOCK_DB=true`). Make a POST request to `/api/auth/login`.
    2. Inspect cookie headers. In local dev, verify that `HttpOnly` is present, `SameSite=Lax`, and `Secure` is absent.
    3. Temporarily set `ENV=production` in `backend/.env` and repeat. Verify that `Secure` and `SameSite=Strict` are present in the response headers.

---

### Task 3: Restrict CORS Wildcards (`SEC-03`)
*   **Assigned Agent:** DevSecOps Engineer  
*   **File Path:** `backend/server.py`  
*   **Objective:** Replace global CORS wildcard `*` with configured domain origins, avoiding browser/security conflicts when matching credentials.
*   **Code Edits:**
    Inside `server.py`, fetch `FRONTEND_URL` and fallback lists:
    ```python
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    # Split by comma in case multiple domains are defined
    allowed_origins = [origin.strip() for origin in frontend_url.split(",") if origin.strip()]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    ```
*   **Verification Steps:**
    1. Start the server and verify that standard requests from the frontend domain function seamlessly.
    2. Make a request using curl with `Origin: http://malicious.com` and verify that the backend does not return `Access-Control-Allow-Origin: http://malicious.com`.

---

### Task 4: Sanitize Filenames for Uploads (`SEC-04`)
*   **Assigned Agent:** Backend Developer  
*   **File Path:** `backend/routes/uploads.py`  
*   **Objective:** Sanitize file names to prevent Header Injection and Directory Traversal when serving files back.
*   **Code Edits:**
    Import `re` at the top of the file. Create a helper to secure filenames:
    ```python
    import re

    def sanitize_filename(filename: str) -> str:
        # Remove any directory traversal sequences
        name = Path(filename).name
        # Keep alphanumeric, dots, dashes, and underscores
        name = re.sub(r'[^a-zA-Z0-9._-]', '_', name)
        return name
    ```
    Sanitize the uploaded file's original name when inserting the document:
    ```python
    safe_filename = sanitize_filename(file.filename)
    # inside file_doc
    "original_name": safe_filename,
    ```
*   **Verification Steps:**
    1. Upload a file with the name `bad"file;path\../injection.png`.
    2. Inspect the saved record to confirm the name is sanitized (e.g., `bad_file_path___injection.png`).
