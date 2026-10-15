# EKANNTO V50 — Monthly Seller Settlement

- Seller Dashboard now has a professional **MONTHLY SELLER SETTLEMENT** card.
- Shows Eligible Sales, Commission, Seller Net and Pending to Wallet.
- Only DELIVERED items with cleared refund/return issues are eligible.
- Seller ledgers are isolated by seller ID.
- On Bangladesh time, the 30th at 00:00 closes the 1–29 cycle and auto-adds the seller net to that seller's wallet.
- Admin can also use **Add to Wallet Now** before the 30th.
- Settlement item keys prevent the same sale from being settled twice by manual + automatic settlement.
- Seller wallet balance reconciliation avoids double-counting already-applied admin adjustments.
- This ZIP remains browser/local-storage based; true background settlement while the site is closed requires the production backend/Cloudflare Cron to execute server-side.
