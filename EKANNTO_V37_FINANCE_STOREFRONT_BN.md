# EKANNTO v37 — Seller Finance & Storefront

## অন্তর্ভুক্তি
- Seller Dashboard থেকে Product Earnings & Withdraw পেজ।
- Seller ID ভিত্তিক Admin Seller Finance তালিকা ও অনুসন্ধান।
- Product-wise quantity, gross sales, commission, seller net, paid/unpaid ও refunded status।
- Admin-এর configurable product commission এবং withdraw website fee।
- Manual add/deduct adjustment with reason.
- Minimum withdraw ৳1,000; fee বাদ দিয়ে net payout হিসাব।
- Admin withdraw approve/reject list.
- Search results-এ shop name matching এবং public seller store page.
- Public store-এ logo, shop name, Follow, follower count, combined product reviews and product cards.

## Default fee assumptions
- Product commission: 10% (Admin can change).
- Withdraw website fee: 2% (Admin can change).
- Minimum withdraw: ৳1,000.
Confirm these rates before production launch.

## Important
This ZIP remains a browser-local prototype. Accounting changes are saved in localStorage, not a secure shared ledger. Product payment status is marked manually in Admin Finance; no payment gateway or payout API is connected. Do not use it to move real money. Production needs server-side authentication, database transactions, immutable ledger entries, payment webhooks, refund reconciliation, role checks and audit logging. Local storage does not synchronize between seller/admin devices and can be edited by the browser user.
