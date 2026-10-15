# EKANNTO v36 — Escrow navigation & product auto-approval

## Escrow access
- Admin: Admin Control Center menu and Quick Actions now include “Escrow, Payouts & Disputes”.
- Seller: Seller Dashboard includes an Escrow & Seller Wallet panel and the seller menu includes Seller Wallet & Payouts.
- The escrow pages are still prototype workflows stored in browser Local Storage; no real money is held, refunded, or paid out.

## Product approval policy
- New seller products enter `pending` review with a submission timestamp.
- If still pending after 5 minutes, the browser prototype changes the product to approved/public.
- Admin may manually approve immediately or reject with an optional reason.
- Rejected products are never auto-approved by the timer.
- The browser timer processes overdue records on page load and periodically while open. It is not a reliable server scheduler. Production must implement the same rule in a secured backend/cron job using database timestamps and an atomic conditional update.

## Production warning
The current ZIP is not a live payment/escrow implementation. Cross-device moderation, payment hold/release, refunds, payouts, and reliable auto-approval require authenticated server-side APIs, a database, verified payment-provider webhooks, scheduled jobs, audit logging, and legal/provider compliance review.
