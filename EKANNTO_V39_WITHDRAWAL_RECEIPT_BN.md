# EKANNTO v39 — Seller Withdrawal Receipt

- Reusable one-page A4 withdrawal receipt template matching the supplied Ekannto coffee/light-coffee design.
- Seller, shop, logo, Seller ID, Withdrawal ID, Receipt ID, payment method, masked account, transaction ID, date/time and wallet balances are filled from local finance records.
- Withdrawal fee rate is snapshotted at request time (`feeRate`) so later Admin setting changes do not rewrite an old receipt.
- Minimum withdrawal remains ৳1,000.
- Product Sale Commission is calculated in product earnings and is not deducted again at withdrawal.
- Admin approval completes the prototype withdrawal and creates immutable receipt/reference fields: Receipt ID, Transaction ID, completed time, fee rate, fee amount, balance before and balance after.
- Seller Wallet & Payouts → Withdrawal History now shows View Receipt and Download PDF for completed withdrawals.
- PDF is generated from the reusable HTML template with `html2pdf.js`; browser Print remains a fallback.
- This v38/v39 browser prototype still uses Local Storage. Production must move payout/receipt creation to an authenticated server-side ledger and store immutable receipt data there.
