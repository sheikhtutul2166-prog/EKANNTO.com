# EKANNTO Admin Review Update (v24)

## পরিবর্তন
- Admin Control Center-এর Menu থেকে EKANNTO AI Suite, Seller Dashboard এবং AI tool shortcut সরানো হয়েছে। Seller-রা তাদের Seller Dashboard থেকেই EKANNTO AI খুলবে।
- Admin Dashboard-এ Seller Applications Review-এর সরাসরি shortcut যোগ করা হয়েছে।
- `admin-users.html`-এ Seller Applications এবং General Users আলাদা tab-এ থাকে।
- Seller application-এ Shop Name, Full Name, Seller ID, User ID, Phone, Category, Location ও application status দেখা যায়। Admin locally Approve বা Reject করতে পারে; Reject-এর কারণ আবশ্যক।
- General Users তালিকায় শুধু Name, User ID ও Email থাকে; user-দের seller-style approve/reject controls নেই।
- Seller application submit করার সময় unique-looking local Seller ID তৈরি হয়, এবং আগের records-এর জন্য fallback ID দেখায়।
- Admin styles mobile-friendly করা হয়েছে।

## সীমাবদ্ধতা
এই build localStorage/local demo workflow ব্যবহার করে। অন্য browser/device-এ application পৌঁছানো, সত্যিকারের seller privileges enforce করা, বা user data sync করতে secure backend/API ও database লাগবে। Prototype login production authentication নয়। Live করার আগে server-side session/authentication, authorization checks, rate limiting, audit logging এবং secrets configuration করতে হবে।
