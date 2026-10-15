EKANNTO V55 — Seller Wallet Balance Reconciliation

- Seller Wallet now uses the explicit wallet balance plus only legacy manual adjustments that were not already applied to the wallet.
- Admin Add/Deduct continues to update the seller's wallet balance and records the adjustment as already applied, preventing a duplicate credit.
- Missing/null wallet balances are handled as missing values instead of being silently treated as zero.
- ZIP and JavaScript syntax are checked; live Cloudflare deployment and cross-device syncing are not verified.

Important: this build's finance data still uses browser Local Storage. Admin and seller pages opened in different browsers/devices cannot share wallet updates reliably until the wallet ledger is moved to authenticated Cloudflare Worker APIs and D1. Do not use Local Storage as the authoritative balance for real-money accounting.
