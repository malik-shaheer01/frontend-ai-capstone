# FE-06B — Testing Pass

Vitest + React Testing Library for components, one Playwright end-to-end test for the primary flow,
wired into GitHub Actions CI.

## Run it

```bash
npm install
npm run test        # Vitest — component/unit tests
npm run e2e          # Playwright — end-to-end (builds + serves the app first)
```

## What's here

- `src/components/ChatMessage.tsx` — renders every message part type (text, image, tool-call,
  tool-result) and three lifecycle states (pending, streaming, error)
- `src/components/ToolResultCard.tsx` — structured tool output, success and error shapes
- `src/components/SettingsForm.tsx` — the validated form pattern from FE-02, ported to React
  (labelled inputs, `aria-invalid`/`aria-describedby`, `preventDefault` + full validation before save)
- `src/components/ChatThread.tsx` — wires the above into the primary flow: type a message, send it,
  watch the assistant reply arrive
- `src/lib/chat.ts` — stands in for a real AI route; every test mocks this function directly
  (`vi.mock("../lib/chat")`) instead of hitting a network layer, so nothing here ever calls a real API
- `e2e/chat.spec.ts` — the one Playwright test, driving the real (unmocked) app end to end

## Test count and what they cover

22 Vitest tests across 5 files — all query by role, label, or visible text, never by CSS class or a
test id, so a class rename can't break them:

- `ChatMessage.test.tsx` — one test per part type (text, image, tool-call, tool-result
  success/error) and one per status (pending, streaming, error) — 8 tests
- `ToolResultCard.test.tsx` — success and error rendering — 2 tests
- `SettingsForm.test.tsx` — empty submit, invalid email, `aria-invalid` wiring, successful save — 4 tests
- `ChatThread.test.tsx` — full send flow with a mocked success reply, and a mocked rejection showing
  the error state — 2 tests
- `validation.test.ts` — the pure validation functions directly — 6 tests

## A real failing test, caught and fixed by running the suite

While writing `SettingsForm.test.tsx`, the first version asserted `screen.getByRole("alert")` after
submitting a fully empty form — but an empty form fails *both* the name and email checks, so two
alerts render and `getByRole` throws on finding more than one. Running `npm run test` caught this
immediately; the fix was asserting on the two error texts directly (`getByText(...)`) instead of
assuming a single alert. This is the exact loop the assignment is about: the suite is what let the
mistake get caught and fixed in the same sitting, before it ever reached a commit.

## CI

`.github/workflows/fe06b-testing-pass.yml` runs on every push/PR touching this app: type-check →
Vitest → Playwright (with a real Chromium install), scoped to this folder via a `paths` filter so it
doesn't run against unrelated assignments in the same repo.
