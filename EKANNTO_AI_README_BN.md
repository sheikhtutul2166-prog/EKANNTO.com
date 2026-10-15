# EKANNTO AI — Standalone Business Suite (Prototype)

**Tagline:** Zero To One, One To Infinity

## চালু করার নিয়ম
1. ZIP extract করুন। `index.html` হলো মূল website, আর `ekannto-ai.html` হলো আলাদা EKANNTO AI Suite।
2. সব ফাইল একই folder structure-এ রাখুন। local testing-এর জন্য VS Code Live Server বা অন্য local static server ব্যবহার করুন। `file://` দিয়ে খুললে কিছু browser feature (IndexedDB, service worker, fetch) সীমিত হতে পারে।
3. AI Suite খুলুন: `ekannto-ai.html`। Admin login: `admin.html`; Admin dashboard: `admintutul.html`।
4. Admin demo login-এর জন্য প্রকল্পের মালিকের দেওয়া login details ব্যবহার করুন। Credentials `assets/js/admin-console.js`-এ browser-side prototype check হিসেবে আছে—source code দেখা যায়। এটি live production authentication নয়।

## Local-first এবং offline
- Business tools-এর local calculation, template, invoice draft, supplier scorecard, risk checklist, history ও JSON backup ব্রাউজারে চলে।
- IndexedDB-তে history রাখা হয়; IndexedDB না থাকলে localStorage fallback আছে।
- Export JSON দিয়ে backup নিন; Import JSON দিয়ে restore করতে পারবেন।
- Browser data ওই device/browser-এর মধ্যে থাকে; এটি cloud sync নয়। Browser data clear হলে backup ছাড়া হারাতে পারে।
- কিছু generative AI, photo generation, background removal ও cloud TTS কাজ করতে Worker endpoint ও model access লাগবে। endpoint না থাকলে local fallback/template দেখাবে।

## AI Gateway / API setup (prototype)
1. Admin dashboard-এ `AI / Cloudflare Configuration` খুলুন।
2. Cloudflare Worker endpoint দিন; prototype-এ suite `POST {endpoint}/ai` পাঠায়, আর Test AI `GET {endpoint}/health` চেষ্টা করে।
3. বর্তমান request body: `{ task, model, input, language }`। সফল Worker response-এ `output`, `response`, বা `text` field থাকলে তা দেখানো হবে।
4. Prototype-এর optional key localStorage-এ থাকে এবং browser/source access-এ দেখা যেতে পারে। **Production Cloudflare API Token, Account ID বা Gateway secret এখানে রাখবেন না।** Live করার আগে Worker environment secrets/bindings ব্যবহার করুন, browser থেকে Worker-এ authenticated request দিন, server-side authorization, rate limit, tenant isolation এবং model allowlist enforce করুন।
5. UI-তে model names placeholders/target preferences হিসেবে আছে। Account, Gateway ও provider-এর actual availability/model identifiers verify করে Worker-এ map করতে হবে। সব নাম সব Cloudflare Gateway account-এ কাজ করবে এমন নিশ্চয়তা নেই।

## User/Seller plans
- Admin UI-তে general user cap (default 125), seller cap (default 225), general user tool selection (২–৩টি), seller Premium toggle কনফিগার করা যায়।
- AI Suite-এর role selector শুধু local UI preview করে। Static HTML/localStorage-এ user cap, Premium payment, entitlement বা access control নিরাপদে enforce করা যায় না। Live-এ D1/Workers API-তে user identity, subscription status ও usage counter রাখতে হবে এবং প্রতিটি request server-এ যাচাই করতে হবে।

## Theme ও ভাষা
- Main website-এর ☰ Menu থেকে Light/Dark ও language preference পরিবর্তন করা যায়। Preference legacy settings keys-এর সঙ্গে sync করার চেষ্টা করে।
- AI Suite-এ বাংলা, Banglish, English এবং নিজস্ব theme control আছে। Existing website-এ Bangla dictionary common labels/navigation cover করে; সব page-এর প্রতিটি sentence-এর পূর্ণ অনুবাদ এখনো সম্পূর্ণ নয় এবং পরবর্তীতে dictionary/translation coverage বাড়াতে হবে।

## Security — live করার আগে অবশ্যই
- Static demo Admin login সরিয়ে server-side authentication/session বসান; password hash server-এ রাখুন, secure cookie, CSRF protections এবং role-based authorization ব্যবহার করুন।
- Admin routes, user limits, tool permissions, subscription status এবং data access server-এ enforce করুন। শুধু page লুকানো security নয়।
- API Token browser JavaScript, HTML, localStorage বা ZIP-এ রাখবেন না। Cloudflare Worker secrets ব্যবহার করুন।
- D1-এ migration-এর আগে schema validation, UUID, timestamp, tenant_id, audit logs, backup, rate limits এবং automated tests যোগ করুন।

## Files added
- `ekannto-ai.html`
- `admin.html`
- `admintutul.html`
- `assets/js/ekannto-ai-suite.js`
- `assets/js/ekannto-ui.js`
- `assets/js/admin-console.js`
- `assets/css/ekannto-admin.css`


## আলাদা আলাদা টুল পেজ (v17)

প্রতিটি EKANNTO AI business tool-এর জন্য `tools/` ফোল্ডারে আলাদা HTML পেজ তৈরি করা হয়েছে। যেমন `tools/sales.html`, `tools/profit.html`, `tools/invoice.html` এবং `tools/history.html`। প্রতিটি পেজে নিজস্ব ইনপুট/ফলাফল, menu drawer, theme toggle এবং language selector আছে। EKANNTO AI-এর মূল পেজের প্রতিটি টুল কার্ড থেকেও “Open separate page” লিংক ব্যবহার করা যায়।

Admin Control Center (`admintutul.html`)-এর `☰ Menu` চাপলে পাশ থেকে drawer খুলবে; সেখানে dashboard, Premium plans এবং সব আলাদা tool page-এর লিংক আছে।

**নিরাপত্তা নোট:** বর্তমান static login/configuration prototype-এর জন্য। Public launch-এর আগে server-side authentication, Worker secrets এবং server-side plan/limit enforcement যোগ করতে হবে।
