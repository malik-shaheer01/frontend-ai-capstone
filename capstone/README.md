# Commit Message Composer

Paste a `git diff`, get back a properly-formatted [Conventional Commit](https://www.conventionalcommits.org/)
message — type, scope, subject, and an optional body explaining *why*.

**Problem it solves:** writing a good commit message is a real, recurring cost — you have to re-read
your own diff, decide on a type/scope, and phrase the subject line correctly, every single commit.
**Who it's for:** any developer working in a repo that enforces Conventional Commits (like this one —
see the root [CLAUDE.md](../CLAUDE.md)). **Why this idea:** it's small enough to build and harden well
in the time available, and it's something this repo's own workflow already needed.

## Setup & run

```bash
npm install
cp .env.local.example .env.local   # then fill in GROQ_API_KEY — free key at https://console.groq.com
npm run dev
```

Open http://localhost:3000.

## Architecture

- `app/page.tsx` — the single page, renders `<DiffForm />`
- `app/components/DiffForm.tsx` — client component: textarea + submit, owns idle/loading/success/error
  state, calls `POST /api/compose`
- `app/api/compose/route.ts` — validates the request body (non-empty, length-capped), calls
  `composeCommitMessage`, maps the result to an HTTP response
- `lib/groq.ts` — talks to Groq's OpenAI-compatible chat completions endpoint; `parseCommitMessage`
  is factored out as a pure function so the parsing/validation logic is unit-testable without a
  network call

## AI integration

**Provider:** [Groq](https://groq.com) (OpenAI-compatible API, `llama-3.3-70b-versatile`), not Anthropic —
Groq's free tier needs no card, which matters since this repo already hit Anthropic's API billing wall
once before (see `PROGRESS.md`'s FE-01 entry).

**Prompt:** a system prompt instructs the model to return *only* a JSON object
(`{type, scope, subject, body}`) via Groq's `response_format: {type: "json_object"}` mode — this is
the "meaningful" part of the integration: the model isn't chatting, it's producing structured data that
gets rendered directly, and every possible shape of a bad response (non-JSON, missing fields, wrong
types) is handled explicitly in `parseCommitMessage` rather than trusted.

## Known limitations & future improvements

- No diff size limit beyond a flat character cap (12,000) — a very large diff gets rejected outright
  rather than summarized/chunked
- No retry-with-backoff on a Groq rate limit — the user sees the error and has to click again manually
- No syntax highlighting on the pasted diff textarea
- The model occasionally returns a subject line longer than the 72-char Conventional Commits
  convention; nothing currently truncates or re-prompts for this

## Testing

```bash
npm run test   # Vitest + React Testing Library — component and unit tests
npm run e2e    # Playwright — end-to-end + automated accessibility (axe) checks
```

- `lib/groq.test.ts` — unit tests for `parseCommitMessage` (valid input, missing fields, malformed
  JSON, wrong type) — no network involved
- `app/components/DiffForm.test.tsx` — component tests with `fetch` mocked: empty-submit validation,
  successful render, server-reported error, network failure, loading-state button disable
- `e2e/compose.spec.ts` — full user flow against the real running app, with the `/api/compose` network
  call intercepted via Playwright's `page.route` (never depends on a real Groq key)
- `e2e/a11y.spec.ts` — automated WCAG 2.1 A/AA scan via axe-core against the live page

**Coverage** (`npm run test:coverage`): 61% statements overall, unevenly distributed — `DiffForm.tsx` is
96.55% covered; `lib/groq.ts` was only 34.21% before `lib/groq.integration.test.ts` was added, because
every other test mocks the network layer somewhere and never exercises the real HTTP call.

`lib/groq.integration.test.ts` makes one real, unmocked call to Groq's live API (skipped automatically
when `GROQ_API_KEY` isn't set, so it never blocks CI on a live credential). **This test caught a real
bug the moment it first ran**: the model this app shipped with, `llama-3.3-70b-versatile`, no longer
exists on Groq's current lineup — every mocked test passed while the actual feature was completely
broken. Fixed by switching to `openai/gpt-oss-120b` (confirmed against Groq's live `/models` endpoint)
and re-verified at both the library level and the full `/api/compose` route level with a real request.

## Performance & accessibility

See [AUDIT.md](./AUDIT.md) for real Lighthouse and axe output.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the filled-out checklist, error/rollback plan.
