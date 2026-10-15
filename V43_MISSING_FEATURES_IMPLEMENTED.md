# EKANNTO V43 — Missing 30-Feature Audit + Cleanup

Base: `EKANNTO_Business_OS_v42_Global_Brand_Shop_Search.zip`

## Removed from the website UI

- The marked `Seller Wallet · Available balance ...` strip is removed from the Seller Dashboard.
- The marked dashboard footer/logo block is removed from the shared website footer.
- The Wallet & Payouts page itself is retained; this cleanup only removes the marked dashboard strip.

## Existing features retained — not duplicated

The current project already contains equivalents for:

- Offer price / discount badge
- Order status / delivery tracking page
- Invoice & shipping label tools
- Product share links
- Courier management foundation
- Fraud check tool
- AI photo/background tools
- Profit & expense tracking
- Analytics / reporting
- Return / refund tracking
- Inventory management
- Seller AI / business AI
- Whole seller dashboard

## Newly added missing feature groups

1. `screenshot-order.html`
   - Screenshot upload
   - Bengali + English + Arabic-numeral OCR attempt
   - Customer name, phone, product, price and address extraction
   - Reviewable order draft before saving

2. `courier-hub.html`
   - Steadfast, Pathao, RedX, Paperfly and CarryBee in one interface
   - One-tap dispatch queue
   - API/OAuth connection reference UI
   - Local dispatch history

3. `website-builder.html`
   - Instant seller storefront configuration
   - Shareable EKANNTO storefront link
   - Custom-domain field for future DNS/backend connection
   - Platform-link mode does not require the seller to purchase hosting for the generated storefront

4. `marketing-studio.html`
   - AI-style sales post generation
   - Short / Full / Reels / Story formats
   - Emoji + hashtag generation
   - Conversion optimization checklist
   - No unsupported 3× sales guarantee is presented

5. `fraud-network.html`
   - Customer phone risk check
   - Seller report submission
   - Return/cancel/fake outcome scoring
   - Advance-payment recommendation for high-risk results
   - Local shared-report model ready for later secure server synchronization

6. `auto-replies.html`
   - Customer question classification for price, stock and delivery
   - Instant reply drafting
   - Ready for Messenger/WhatsApp provider webhook connection

## Important architecture note

The project is still a browser/local prototype in several areas. The new screens do not fake real courier money movement, shared cloud fraud data, or Messenger/WhatsApp delivery. Those integrations become live only after the corresponding secure backend/provider credentials are connected.
