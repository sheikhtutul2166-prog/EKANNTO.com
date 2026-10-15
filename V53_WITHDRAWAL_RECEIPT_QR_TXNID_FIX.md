# EKANNTO V53 — Withdrawal Receipt QR + Transaction ID Fix

- Fixed shop logo rendering in withdrawal receipt/PDF: full logo uses contain mode, no crop/zoom.
- Replaced the fake QR pattern with a real QR code using QRCode.js.
- QR is constrained inside its receipt box on desktop, mobile, and print/PDF layouts.
- PDF download waits for QR rendering before generating the PDF.
- Admin Seller Finance pending withdrawal queue now includes a Transaction ID field.
- If Admin leaves Transaction ID blank, the system auto-generates sequential IDs starting at `EK-TXID-01`.
- Admin may enter a provider/reference transaction ID instead; duplicate IDs are rejected.
- Existing withdrawal amount, wallet, fee, receipt and payout logic remains unchanged.
