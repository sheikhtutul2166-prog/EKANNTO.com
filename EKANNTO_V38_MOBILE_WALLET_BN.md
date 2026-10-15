# EKANNTO v38 — Mobile Seller Wallet

- Product Earnings & Withdraw is responsive on phone and desktop.
- Long money values wrap inside cards instead of overflowing.
- Product/order/withdraw tables become stacked cards on narrow screens.
- Seller Dashboard gets a compact inline SVG wallet showing the available-balance estimate.
- Seller Wallet & Payouts redirects to the same Seller Earnings page to avoid duplicate workflows.

## Important
This project version still uses browser Local Storage for the finance prototype. Balance is an estimate based on local paid-item flags, adjustments, and withdrawal statuses. It is not a server-authoritative balance and does not move real money. Production requires server-side ledger, authenticated API, payment-provider reconciliation, and payout integration.
