EKANNTO Seller Onboarding V53 OCR Fix

- OCR now loads Tesseract.js and runs separate English and Bengali recognition passes on both NID sides.
- Image preprocessing upscales and improves contrast before recognition.
- Parser recognizes Bengali/English labels and Bengali/Arabic digits where available.
- Auto-fill only populates detected values; fields remain editable. NID fields not present/legible on the card (for example blood group or some address/name fields) cannot be guaranteed by OCR and must be checked by the applicant.
- Added only per-photo retake controls for NID Front, NID Back, and selfie; no separate Open Camera / Capture Photo / Reset buttons are shown.
- OCR models are fetched from a CDN; initial use needs internet. Photos are processed in the browser by the OCR code, but the overall preview still stores application data in Local Storage and is not production identity verification.
