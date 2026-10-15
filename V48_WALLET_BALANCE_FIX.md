# V48 — Seller Wallet Balance Fix

- Admin manual Add/Deduct now updates the seller wallet balance directly.
- Seller Wallet, Seller Dashboard and Seller Account read the same wallet balance.
- Existing adjustment history is preserved; clearly invalid/extreme test amounts are excluded from the balance calculation.
- Existing orders, sellers and other site data are not deleted.
- Withdrawal reservations continue to reduce available balance.
