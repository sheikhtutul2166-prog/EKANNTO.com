# EKANNTO Business OS v33 — AI Chat Tools

- AI directory now shows tool names only, with search and a separate page per tool.
- Each tool page uses a shared chat interface with per-tool local chat history.
- Image attachments support multiple image files up to 5 MB each and send data URLs to the configured `/ai` Worker endpoint.
- Actual image understanding/generation requires a secure server Worker/model that accepts the `images` array; this ZIP cannot create provider credentials or verify a production endpoint.
- Local fallback is available when no endpoint is configured, but it does not truly understand uploaded image content.
- Chat history is stored on the current browser/device. Cross-device sync requires server/database support.
