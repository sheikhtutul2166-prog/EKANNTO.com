# V49 — Monthly Seller Settlement

- Added a separate monthly seller sales/settlement section to Seller Account/Dashboard and Admin Seller Finance.
- Only delivered seller items are eligible. Refund/return/cancelled or open return/refund items are excluded.
- Each seller is calculated independently by `sellerId`; amounts never mix between sellers.
- Monthly cycle is displayed separately for each seller. The current cycle is eligible for automatic settlement at Bangladesh time on the 30th at 00:00.
- When the 30th is reached, the eligible seller-net amount is automatically added to that seller's `walletBalance`.
- Admin can also click `Add to Wallet Now` for a pending seller amount before automatic settlement. The item ledger prevents the same sale from being added twice.
- Settlement records are stored in `EKANNTO_MONTHLY_SETTLEMENT_V49`.
- This ZIP remains a local/browser prototype; true background execution and multi-device synchronization require the production Worker/database/cron backend.
