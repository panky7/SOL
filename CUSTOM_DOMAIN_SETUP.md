# Custom Domain Setup Guide — sophielamourcoaching.fr

**Role:** DevSecOps Lead  
**Scope:** Attach `sophielamourcoaching.fr` (managed at IONOS) to the existing AWS serverless stack (CloudFront + API Gateway + Lambda + S3).  
**Prerequisite:** Terraform infrastructure from `terraform/main.tf` is already deployed.

---

## Architecture Reminder

```
User → HTTPS → CloudFront (sophielamourcoaching.fr)
              ├── /      → S3 (React frontend)
              └── /api/* → API Gateway → Lambda (FastAPI)
```

Because API Gateway sits **behind** CloudFront as an origin, you only need to attach the custom domain to **CloudFront**. API Gateway keeps its default `execute-api` endpoint internally.

---

## Step 1 — Request an ACM Certificate (us-east-1 only)

CloudFront **requires** certificates from the `us-east-1` (N. Virginia) region, even though your stack lives in `eu-west-3`.

1. Open the [AWS Certificate Manager console](https://console.aws.amazon.com/acm/home).
2. **Switch region to US East (N. Virginia)** in the top-right dropdown.
3. Click **Request certificate** → **Request a public certificate**.
4. Under **Domain names**, add exactly:
   - `sophielamourcoaching.fr`
   - `www.sophielamourcoaching.fr`
5. Choose **DNS validation**.
6. Click **Request**.

After a few seconds, the certificate list shows **Pending validation**. Click the certificate ID, then scroll to **Domains** and copy the two **CNAME records** (Name and Value) for each domain. You will need them in Step 2.

> **Security note:** Do not use email validation. DNS validation is fully automatable and leaves no dependency on mailbox access.

---

## Step 2 — Validate Ownership via IONOS DNS

1. Log in to [IONOS](https://login.ionos.fr/) and go to **Domains** → `sophielamourcoaching.fr` → **DNS**.
2. Add **CNAME records** using the Name/Value pairs from Step 1.

| Type | Host (Name) | Value (Points to) |
|------|-------------|-------------------|
| CNAME | `_xxxxxxxx.sophielamourcoaching.fr` | `_yyyyyyyy.acm-validations.aws.` |
| CNAME | `_xxxxxxxx.www.sophielamourcoaching.fr` | `_yyyyyyyy.acm-validations.aws.` |

> **IONOS tip:** The IONOS panel sometimes auto-appends the apex domain. If the Host field already implies the domain, enter only the `_xxxxxxxx` prefix (without `.sophielamourcoaching.fr`).

3. Save and wait **2–5 minutes**.
4. Return to the ACM console and click the **Refresh** icon next to the certificate. Both domains should flip to **Issued**.

---

## Step 3 — Attach Certificate & Aliases to CloudFront

1. Open [CloudFront console](https://console.aws.amazon.com/cloudfront/home).
2. Select your distribution (currently serving the default `*.cloudfront.net` domain).
3. Click **Edit** in the **Settings** tab.
4. Under **Alternate domain names (CNAMEs)**, add:
   - `sophielamourcoaching.fr`
   - `www.sophielamourcoaching.fr`
5. Under **Custom SSL certificate**, select the ACM certificate created in Step 1 from the dropdown.
6. Leave **Supported HTTP versions** as is (HTTP/2 recommended).
7. Click **Save changes**.

CloudFront will redeploy. This takes **5–15 minutes**. You can monitor progress in the console (Status column).

---

## Step 4 — Route IONOS Traffic to CloudFront

Once CloudFront shows **Deployed**, point your IONOS DNS records to it.

### Recommended approach (www canonical + apex redirect)

| Type | Host | Points to / Target |
|------|------|--------------------|
| CNAME | `www` | `<your-distribution-id>.cloudfront.net` |
| URL Redirect / Forward | `@` (apex) | `https://www.sophielamourcoaching.fr` |

**Why:** The DNS specification forbids CNAME at the apex (`@`). Using a URL redirect/forward from the apex to `www` is the safest, most portable pattern.

> **IONOS specific:** Look for a "Redirect" or "Forwarding" section in the IONOS DNS panel. Enable HTTPS forwarding to `https://www.sophielamourcoaching.fr` with **Permanent redirect (301)**.

### Alternative (if IONOS supports ALIAS / ANAME)

If your IONOS plan offers ALIAS/ANAME records:

| Type | Host | Points to |
|------|------|-----------|
| ALIAS / ANAME | `@` | `<your-distribution-id>.cloudfront.net` |
| CNAME | `www` | `<your-distribution-id>.cloudfront.net` |

If ALIAS is not available, **do not attempt an A record** — CloudFront IPs change dynamically.

---

## Step 5 — Harden Lambda Environment & CORS

After the custom domain is live, update the backend so it trusts only your canonical origins.

### A. Lambda Environment Variables

1. Go to [Lambda console](https://console.aws.amazon.com/lambda/home) → `sophielamourcoaching-backend` → **Configuration** → **Environment variables**.
2. Edit `FRONTEND_URL` to:
   ```
   https://www.sophielamourcoaching.fr,https://sophielamourcoaching.fr
   ```
3. Click **Save**.

### B. API Gateway CORS (Terraform update recommended)

Your current `terraform/main.tf` allows `allow_origins = ["*"]`. Harden it:

```hcl
cors_configuration {
  allow_origins = [
    "https://www.sophielamourcoaching.fr",
    "https://sophielamourcoaching.fr"
  ]
  allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  allow_headers = ["content-type", "authorization"]
  max_age       = 300
}
```

Then run:
```bash
terraform apply
```

---

## Step 6 — Frontend Build Verification

Ensure your React app calls the API **relatively** so it automatically uses the same domain:

```javascript
// Good — uses the current host
const API_BASE = '/api';

// Bad — hardcodes the old CloudFront or localhost URL
const API_BASE = 'https://d27uzt73hvni4g.cloudfront.net/api';
```

If you have any absolute URL hardcoded anywhere in `frontend/src/`, replace it with `/api` or an environment variable that defaults to `/api`.

---

## Step 7 — Post-Launch Verification Checklist

Run these checks once DNS has propagated (give it a few minutes):

| Check | Command / Action | Expected Result |
|-------|------------------|-----------------|
| HTTPS works | `curl -I https://www.sophielamourcoaching.fr` | `HTTP/2 200` |
| Apex redirects | `curl -I https://sophielamourcoaching.fr` | `301` → `https://www.sophielamourcoaching.fr` |
| API reachable | `curl https://www.sophielamourcoaching.fr/api/auth/me` | `401 Unauthorized` (proves routing works) |
| Certificate valid | Browser padlock → Certificate | Issued by Amazon, covers both domains |
| Security headers | `curl -I https://www.sophielamourcoaching.fr` | `strict-transport-security` present |
| CORS hardened | `curl -H "Origin: https://evil.com" ...` | No `Access-Control-Allow-Origin` header |

---

## Rollback Plan

If anything breaks:

1. **Revert DNS:** In IONOS, delete the new CNAME/redirect and restore whatever was there before.
2. **Revert CloudFront:** Edit the distribution, remove the alternate domain names, and switch **Custom SSL certificate** back to **Default CloudFront certificate**.
3. **Revert Lambda env:** Restore the old `FRONTEND_URL` value.
4. **Terraform rollback:** If you changed `terraform/main.tf`, run `git checkout terraform/main.tf && terraform apply`.

---

## Terraform Automation (Optional)

If you prefer infrastructure-as-code over console clicks, the following Terraform resources can be added to `terraform/main.tf`:

- `aws_acm_certificate` in `us-east-1` (requires a second provider alias)
- `aws_cloudfront_distribution` updates:
  - `aliases = ["sophielamourcoaching.fr", "www.sophielamourcoaching.fr"]`
  - `viewer_certificate` block referencing the ACM ARN
- Hardened `cors_configuration` on `aws_apigatewayv2_api`

**Note:** DNS validation records inside IONOS cannot be automated via AWS Terraform because IONOS is not a Route 53 zone. You must still complete Step 2 manually.

If you want me to write and commit the exact Terraform patch, just ask.

---

## Summary of Changes

| Layer | What Changes |
|-------|--------------|
| **DNS (IONOS)** | Add ACM validation CNAMEs → Add final CNAME (`www`) + apex redirect |
| **AWS ACM** | New certificate in `us-east-1` for apex + www |
| **CloudFront** | Add aliases + custom SSL cert |
| **Lambda** | Update `FRONTEND_URL` env var |
| **API Gateway** | Restrict CORS `allow_origins` to your domains |
| **Frontend** | Ensure API calls use relative `/api` paths |

---

*End of guide.*
