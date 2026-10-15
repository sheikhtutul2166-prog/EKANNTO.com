# EKANNTO — Local-first prototype (Iteration 1)

Mobile-first HTML/CSS/JS, modular files, Cloudflare Pages static deploy compatible. Upload the contents of this ZIP via Cloudflare Pages Direct Upload (not Git). The ZIP has the HTML pages at its root.

## Working locally
- Marketplace, search, product detail, variants, quantity, cart, local checkout, order history.
- Customer registration/login/profile editing, seller registration/login/dashboard, product entry, order status, offline sales.
- Sample catalog is **demo content**, not real listings. Analytics use locally stored demo transactions, not live server data.
- Passwords in browser localStorage are **insecure**. This is a prototype only: never use real passwords, personal data, or production payments.
- Forgot password verifies email + phone **in the same browser**, not real identity recovery.
- Google/Apple are placeholders, not OAuth.
- Browser storage is per browser/device, is not synchronized, and may be cleared.
- Image data in localStorage is capped to small files to avoid quota exhaustion. Production 20MB+ images require R2 or other storage.
- Orders are local-only; no real payments, courier integrations, OTP, email delivery, or AI backend.
- No secure server-side authorization; role checks here are only interface behavior.

## Before launch
Implement Cloudflare Workers server endpoints, D1 or chosen DB, R2, secure password hashing, server sessions, email/phone verification, real password reset, OAuth, RBAC, tenant isolation, validated order/pricing/discount logic, payment verification, stock reservation, idempotency, audit, monitoring, tests and migration from demo data. Sequential IDs must be allocated atomically on server to avoid collisions.

## Folder structure
- Each page is its own HTML file.
- assets/css/style.css — design system.
- assets/js/icons.js — inline SVG icon set.
- assets/js/app.js — page controller and local data logic. This first iteration shares one JS module; split further by feature when the backend is introduced.


## EKANNTO AI standalone suite (added)
- Open `ekannto-ai.html` for the local-first business suite, 20 core tool modules, JSON backup, language/theme controls, and optional Cloudflare Worker integration hooks.
- `admin.html` and `admintutul.html` provide prototype admin login/dashboard controls for local limits, tool access selection, and AI endpoint configuration.
- Read `docs/EKANNTO_AI_README_BN.md` for Bangla setup and launch-security instructions.
- Important: admin login, user limits, Premium plans, and client-side API-key fields are demo-only in a static ZIP. Before public launch, enforce authentication, tenant access, quotas, entitlements, and API secrets on a server/Cloudflare Worker.
