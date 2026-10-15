# EKANNTO V4 — Local Smart Tools

Four new pages: ai-shopping.html, ai-image-search.html, ai-recommendations.html, ai-support.html.

- Smart shopping: Bangla/English keyword matching and numeric budget filters over locally stored products. No external AI provider.
- Image search: color-pattern similarity using browser canvas against existing product images (up to first 100 image-bearing products); not semantic object recognition. Images remain on-device.
- Personalized recommendations: local view counts, cart categories and product popularity. Clear-history button included.
- Customer support: local FAQ-style intent matching, with links to Orders, Help and Tickets. No account/order mutations or automated sensitive actions.

No API keys, server-side inference, real image embeddings, live tracking or secure production auth. This release is a functional offline prototype, not connected AI.

Deploy: extract this ZIP and upload all site files to Cloudflare Pages (direct upload). Do not put an enclosing folder above index.html.
