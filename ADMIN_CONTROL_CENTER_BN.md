# EKANNTO Admin Control Center (বাংলা)

## আলাদা Admin পেজ
- `admin.html` — Admin login
- `admintutul.html` — Dashboard
- `admin-users.html` — Users/Sellers
- `admin-orders.html` — Orders/Refund notes
- `admin-products.html` — Product records
- `admin-plans.html` — Premium plans
- `admin-promos.html` — Promo codes
- `admin-payments.html` — Payment method settings
- `admin-ai.html` — Cloudflare Worker endpoint/model
- `admin-website.html` — Website settings
- `admin-audit.html` — Audit log and JSON export

## Prototype login
এই development ZIP-এ দেওয়া Admin login form-এ project owner-এর নির্ধারিত demo credential দিয়ে browser-only prototype login কাজ করতে পারে। এটি নিরাপদ authentication নয়; hash/source এবং session storage client-side হওয়ায় production-এ ব্যবহার করা যাবে না। Live করার আগে Cloudflare Worker/server-এ authentication endpoint দিন এবং `window.EKANNTO_ADMIN_AUTH = { endpoint: 'https://your-auth-worker.example/login' }` configure করুন। Worker-এ password hash, rate limiting, session/cookie এবং role permission server-side যাচাই করতে হবে।

## Local-first ও migration
Settings localStorage-এ, business records সংশ্লিষ্ট modules-এর local records হিসেবে সংরক্ষিত হয়। JSON export করে backup রাখা যায়। সব record-এ UUID/timestamp/tenant_id placeholder যোগ করার ধরন ব্যবহার করুন। Local browser data এক ডিভাইসের বাইরে sync হয় না। Live multi-user operation-এর জন্য D1/অন্যান্য database এবং server-side authorization প্রয়োজন।

## AI keys
API token বা account secret public HTML/JavaScript/localStorage-এ রাখা নিরাপদ নয়। Cloudflare Worker secrets ব্যবহার করুন; browser শুধু Worker endpoint-এ request করবে।
