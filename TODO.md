# TODO — Rate limit + XSS hardening

- [ ] Update plan: confirm rate limit numbers/time window + DOMPurify for paper/history rendering.
- [ ] Install `express-rate-limit` and add to package.json.
- [ ] Update `server.js`: add per-IP rate limiting middleware for:
  - [ ] POST /api/chat
  - [ ] POST /api/generate-paper
- [ ] Ensure 429 returns consistent JSON {error: 'Rate limit — thora ruko'}.
- [ ] Update `public/js/script.js`:
  - [ ] Sanitize generated paper HTML before inserting into `a4Page` / `paperViewContent` (use DOMPurify).
  - [ ] Sanitize other marked.parse outputs that use innerHTML.
- [ ] Run quick smoke test (start server) and hit endpoints once to verify non-429 responses.

