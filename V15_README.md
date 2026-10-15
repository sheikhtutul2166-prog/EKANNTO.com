# EKANNTO V15 — Local prototype

- Seller menu: each item links to its own existing page.
- Product hold: 90 seconds for newly added seller products; this is a local timestamp and not server-enforced.
- Delete: 5-minute undo window. Permanent deletion is only simulated within browser storage on the next app visit.
- Customer AI Chat: 225 messages/day, 15 images/day. Seller: 325 messages/day, 30 images/day.
- Premium tiers are DISPLAY ONLY and cannot be purchased or activated.
- Gemini API is NOT connected: never put an API key in a static ZIP, browser localStorage, or public JavaScript. Connect through Cloudflare Worker secret and server-side quotas before launch.
- AI chats are LOCAL canned responses, not generative AI. Chats are pruned after 24 hours on a future page visit; not secure timed deletion.
- No real admin RBAC exists. Product admin management requires a secure backend.
- Tests: syntax and ZIP integrity; full browser E2E not completed.
