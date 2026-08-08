Round 2 prompt (verbatim — written in a fresh session, no memory of round 1):

---

Build an account settings form in `assignments/week1-ai-workflow-drill/round-2-precise/`. Follow the stack and conventions in `CLAUDE.md` at the repo root (Tailwind for styling, no inline `<style>` blocks).

Files:
- `index.html` — markup + Tailwind CDN script (no build step needed for this drill)
- `validation.js` — pure validation functions, no DOM code, so they're unit-testable
- `app.js` — DOM wiring: reads form values, calls the validation functions, renders errors, handles submit
- `validation.test.js` — tests using Node's built-in `node:test` + `node:assert/strict` (no external deps)

Fields: name (text, required), email (text, required, must look like a real email address), notifications (checkbox, optional).

Constraints:
- Every input has a `<label for="...">` pointing at its `id` — no placeholder-only labeling.
- On submit, prevent the default page reload, then validate. If invalid, do not proceed.
- Each invalid field shows an inline error message directly under it, with `aria-invalid="true"` on the field and `aria-describedby` pointing at the error message's id.
- Put a visually-hidden `aria-live="polite"` region that announces a summary when validation fails (e.g. "2 fields need attention") — screen reader users need this since the inline errors alone won't reliably be announced.
- On successful submit, show a success message and do not reload the page.
- Move focus to the first invalid field after a failed submit attempt.

Example behavior:
- Empty name + empty email + click Save → error "Name is required" under name field, error "Email is required" under email field, focus moves to the name field, nothing is submitted.
- Name filled, email = "not-an-email" + click Save → error "Enter a valid email address" under email field only, focus moves to email field.
- Name filled, email = "person@example.com" + click Save → success message shown, no page reload, no errors.

Verification step: write `validation.js` first, then write `validation.test.js` covering: empty name, empty email, invalid email formats (missing `@`, missing domain, spaces), and a valid case. Run `node --test` and confirm every test passes before treating the form as done. If a test fails, fix `validation.js`, not the test.

---
