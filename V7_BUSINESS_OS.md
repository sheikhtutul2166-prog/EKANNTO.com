# EKANNTO Business OS V7 — Local First

Includes all V1–V6 files plus 12 modular Business OS pages and modules.

## Limitations
- New modules store data in `ekannto_v7_business` in browser localStorage, separated by seller ID. This is NOT secure tenant isolation.
- Existing customer/seller accounts and orders are stored in `ekannto_v1`. No secure backend auth.
- Courier, payment gateways, staff invitation, refund, promo activation and AI are NOT connected.
- Inventory adjustments and POS entries are logged separately and do not modify canonical product stock.
- Profit & Loss displays a partial balance, not actual profit.
- COD is a demo payment choice; online payments are disabled.
- Invoice/label are printable previews, not tax/courier documents.
- Before launch migrate to secure backend, server-side authorization, validated ledger, idempotent payment webhooks, order-level seller fulfillment, stock transactions, consent and audit logs.

## Deployment
Upload the entire ZIP to Cloudflare Pages using Direct Upload; no Git required. Open index.html.
