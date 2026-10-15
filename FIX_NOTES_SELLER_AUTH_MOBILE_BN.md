# EKANNTO Fix Notes

- Fixed unreachable seller signup branch: seller signup now creates a local seller and linked user record, validates unique email/phone, and enforces a maximum of five seller accounts in this local prototype.
- Seller login can authenticate direct seller records created by that flow.
- Improved mobile subscription plan wrapping and contrast; replaced native plan-selection alert with an in-page status notice.
- Added `admin-seller-account-controls.html` for local preview edits to seller/user IDs, name, shop, email, phone, status and password reset.

## Important
This is a Local Storage prototype patch only. It does not alter the deployed site or D1. Local browser data can be edited by the user and does not synchronize across devices. Before production, implement server-side account creation, hashed password reset, one-account-per-email/phone enforcement, the five-seller limit, audit logs, admin RBAC and subscription enforcement in D1/Worker.
