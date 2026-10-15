# EKANNTO Escrow Workflow — v35 (বাংলা)

## এই সংস্করণে কী আছে
- `escrow.html`: buyer-side protection workflow ও pending order record
- `seller-payouts.html`: seller net balance summary এবং payout request form
- `admin-escrow.html`: payment status review, release/refund decision, dispute queue, payout review ও local audit log
- `assets/js/ekannto-escrow.js`: local prototype workflow

## গুরুত্বপূর্ণ সীমাবদ্ধতা
এটি **production escrow বা বাস্তব payment custody নয়**। ডেটা শুধু বর্তমান browser-এর Local Storage-এ রাখা হয়। “Mark payment verified”, “Release”, “Refund”, “Mark processed” বোতামগুলো local demo status বদলায়; এগুলো payment gateway-এ টাকা নেয়, hold করে, ফেরত দেয় বা seller-কে payout করে না। UI-তে এমন সতর্কতা রাখা হয়েছে যাতে demo action-কে real money movement মনে না হয়।

## Production implementation checklist
1. বাংলাদেশের জন্য অনুমোদিত payment service provider/merchant agreement এবং escrow/marketplace settlement অনুমোদন নিশ্চিত করুন। টাকা নিজের সাধারণ bank account-এ শুধু “escrow” নামে ধরে রাখবেন না; provider-supported split settlement/marketplace payout বা আইনসম্মত safeguarded arrangement ব্যবহার করুন।
2. Server-side database schema: `orders`, `payment_attempts`, `escrow_ledger_entries`, `seller_balances`, `payout_requests`, `refunds`, `disputes`, `dispute_evidence`, `webhook_events`, `audit_logs`। Monetary values integer minor units (paisa) হিসেবে সংরক্ষণ করুন।
3. Ledger immutable ও double-entry করুন। Browser/Local Storage থেকে কখনো payment success, commission, balance, refund বা release বিশ্বাস করবেন না।
4. Provider webhook signature verify করুন, idempotency key, duplicate-event protection, transaction reconciliation, rate limits, admin RBAC, audit trail ও secrets management যোগ করুন।
5. Payment confirmed webhook-এর পরেই order `HELD` হবে। Courier delivery proof/Buyer confirmation থেকে inspection deadline হিসাব হবে। Open dispute থাকলে automatic release থামবে।
6. Inspection window শেষে server Cron/Queue-তে eligible order পুনরায় যাচাই করে commission এবং seller net ledger entry তৈরি করবে; payout provider API সফল না হওয়া পর্যন্ত “paid” দেখাবে না।
7. Refund ও payout idempotent server-side operation হতে হবে। Dispute-এর evidence, reason, decision, timestamps এবং responsible admin সংরক্ষণ করুন।
8. Seller KYC, AML/fraud controls, consumer refund policy, privacy/retention, tax, payment-provider terms এবং বাংলাদেশে প্রযোজ্য আইন নিয়ে স্থানীয় আইনজীবী ও provider-এর অনুমোদন নিন।
9. Test/sandbox: successful payment, failed/cancelled payment, duplicate webhook, partial refund, full refund, delivery delay, dispute before auto-release, expired inspection window, payout failure/retry, concurrent admin action, database backup/restore।

## Suggested state machine
`PAYMENT_PENDING -> HELD -> DELIVERED/INSPECTION -> RELEASE_READY -> RELEASED`

Alternate branches: `HELD/INSPECTION -> DISPUTED -> RELEASED or REFUNDED`; failed payment stays unpaid and must never create a held balance. Cancellation/refund must be provider-confirmed and ledgered.

## Fee formula
`platform_fee = round(amount_minor * commission_rate)` and `seller_net = amount_minor - platform_fee - any disclosed permitted adjustments`. Keep amounts in integer paisa and define rounding rules centrally. The current UI commission rate is only a demo calculation.
