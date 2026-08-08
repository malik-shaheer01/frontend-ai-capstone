# WORKFLOW.md — Vague vs. Precise Prompting Drill

**Feature:** an account settings form (name, email, notifications checkbox) with validation. Built twice, on independent branches, from independent prompting sessions (`round-1-vague`, `round-2-precise`).

## Correctness

Round 1's submit handler (`round-1-vague/index.html`) never calls `e.preventDefault()`, so clicking Save reloads the page and discards whatever was typed — a real, ship-blocking bug from a one-line prompt. It also performs zero validation: an empty form or a garbage string like `not-an-email` gets `alert('Saved!')` regardless. Round 2 (`round-2-precise/app.js`) calls `preventDefault()` first, then runs `validateForm()` before allowing a save, matching the prompt's example-behavior spec exactly (verified in-browser: empty submit → 2 field errors; invalid email → 1 error; valid input → success message, no reload).

## Accessibility

Round 1's labels are plain text nodes ("Name: `<input>`") with no `for`/`id` pairing — a screen reader has no way to associate the label with the field. Round 2 uses `<label for="name">` / `<label for="email">`, sets `aria-invalid` and `aria-describedby` on invalid fields, and adds an `aria-live="polite"` summary ("2 fields need attention") so failed validation is actually announced. None of this appeared in the vague prompt's output because nothing asked for it.

## Edge cases & verification

Round 1 has no tests and no edge-case handling — there's no equivalent of an email-format check at all. Round 2 ships `validation.js` as pure functions plus `validation.test.js` (9 cases: empty/whitespace name, empty email, missing `@`, missing domain, spaces, valid case), run via `node --test` — all 9 passed before the DOM layer was even written.

## Review effort — and a real mistake I caught

Round 1 took about two minutes end-to-end: one sentence, one paste, done — and shipped with a page-reload bug and zero validation that would only surface once someone actually used it. Round 2's precise prompt took longer to write, and the verification step added real time up front (writing tests before the UI), but it caught its own bug before anything shipped: `validation.js` was first written with CommonJS `module.exports` while `app.js` used ES `import` syntax. `node --test` didn't catch this — the test file used the same (consistent, working) module system as `validation.js`, so the unit tests passed while the browser wiring was still broken. It only surfaced on an actual click-through: the page loaded, styled correctly, but clicking Save did nothing at all. Fixing it meant adding `"type": "module"` to `package.json` and switching everything to `export`/`import`, then rerunning both the unit tests and a live browser check.

That's the actual lesson, not a tidy one: round 2 *felt* slower while writing the prompt and the tests. Round 1's two minutes felt fast. But round 1's speed was an illusion — its bugs (reload-on-submit, no validation, no labels) just hadn't been found yet, and finding them later (in review, or worse, in production) would have cost more than round 2's upfront cost. Round 2's own bug, by contrast, was caught in the same session, before the branch was ever pushed.
