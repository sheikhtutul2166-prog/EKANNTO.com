# EKANNTO Business OS v31 — Seller Command Center

This build restructures the seller dashboard around the supplied hand-drawn concept: seller identity, shop status, online/offline sales, customers, orders, products, date range, sales trend, and a three-line workspace menu. The menu links to separate pages for the listed seller tools.

## Important scope notes
- Existing seller/product/order flows were retained rather than deleted.
- This ZIP adds a more complete dashboard shell and standalone tool pages. Some tool pages store their notes locally in the current browser; they are not a multi-user cloud database.
- Customers and invoices use order information already present in the browser app.
- Payment, courier, AI provider, and cross-device synchronization require configured backend/API credentials and have not been claimed as live.
- Test by opening seller-dashboard.html after signing in as a seller.
