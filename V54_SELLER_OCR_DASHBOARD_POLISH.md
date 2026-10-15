# EKANNTO V54 — Seller OCR & Dashboard Polish

- Removed the Payment account number field from Create your seller account.
- Increased requested camera resolution and JPEG capture quality for NID front/back and live selfie.
- Improved client-side OCR preprocessing, multiple OCR passes, English/Bengali OCR parsing, DOB normalization, and field extraction fallbacks.
- Kept retake controls scoped to the individual NID side and selfie.
- Added Seller Information access inside Seller Account Settings alongside editable shop logo/name/email/phone fields.
- Repositioned Seller Subscription Plans below the seller/shop identity card when the dashboard DOM provides a suitable card; SVG plan icons replace decorative text symbols.
- Expanded Seller Information to show English name, father/mother name, blood group, and all NID details.

## Important limits
OCR is probabilistic. It cannot reliably invent information that is not printed or legible on the card (blood group is not present on every NID). Review and correct extracted values before submission. Camera quality depends on device camera and browser permission. This remains a local-browser preview, not secure production identity verification.
