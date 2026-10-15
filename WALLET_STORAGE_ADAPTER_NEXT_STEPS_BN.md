# EKAANNTO Wallet Storage Adapter — ভবিষ্যৎ Database সংযোগ

## বর্তমান অবস্থা
বর্তমান সংস্করণ localStorage ব্যবহার করে: `ekannto_v1` (seller/order data) এবং `ekannto_finance_v37` (adjustments/withdrawals/paid items)। Dashboard-এর balance calculation এখন Seller Wallet & Payouts-এর একই হিসাবের নিয়ম অনুসরণ করে।

## ভবিষ্যতে Database যোগ করার জায়গা
`assets/js/wallet-storage-adapter.js` হলো integration seam। বর্তমানে `mode: "localStorage"`; ভবিষ্যতে Cloudflare Worker/D1 বা অন্য API যোগ করলে শুধু adapter-এর `getSellerWallet`, `getAllSellerWallets`, `createWithdrawal` এবং `applyAdjustment` implementation বদলাতে হবে। UI-তে সরাসরি localStorage access না বাড়িয়ে ওই API ব্যবহার করতে হবে।

## গুরুত্বপূর্ণ নিরাপত্তা
Browser localStorage শুধু একই browser/device-এর ডেটা। একাধিক device/admin-এর জন্য authoritative balance, withdrawal reserve, adjustment ও idempotency অবশ্যই server-side transaction-এ করতে হবে। API-তে seller ID ownership যাচাই করতে হবে; client থেকে পাঠানো balance-কে বিশ্বাস করা যাবে না।

## ডেটা নিয়ম
- Dashboard এবং Wallet একই balance function/adapter ব্যবহার করবে।
- Pending/approved/processing withdrawal একবারই reserve হবে।
- Admin adjustment ledger entry হবে; শুধু UI-তে সংখ্যা বদলানো নয়।
- Withdraw request-এর unique ID দিয়ে duplicate submission ঠেকাতে হবে।
