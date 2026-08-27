# Deployment checklist

## Pre-deploy

- [x] `npm run build` succeeds locally with no type errors
- [x] `npm run test` (Vitest) is green
- [x] `npm run e2e` (Playwright) is green, including the axe accessibility scan
- [x] `npm run lint` is clean
- [x] No secrets committed — `GROQ_API_KEY` only exists in `.env.local` (gitignored) and, in
      production, as a Vercel environment variable
- [ ] `GROQ_API_KEY` set in the Vercel project's environment variables (Production + Preview)

## Deploy

- [ ] `vercel` CLI logged in (`npx vercel login`) and linked to this project (`npx vercel link`)
- [ ] `npx vercel --prod` run from `capstone/`, or connected via Vercel's GitHub integration for
      auto-deploy on push to `main`
- [ ] Live URL recorded here once deployed: `TBD`

## How it fails safely

- **Empty/invalid input** — rejected client-side before any request is sent (`DiffForm`'s validation),
  and again server-side in the route handler (400) as a second line of defense
- **Groq rate-limited (429)** — surfaced to the user as a specific, actionable message ("Rate limited by
  Groq. Wait a moment and try again."), not a generic failure
- **Groq unreachable / network error** — caught in `composeCommitMessage`'s `try/catch`, returned as a
  structured `{ok: false}` result rather than throwing an unhandled exception that would 500 the route
- **Malformed model output** (not JSON, missing fields, wrong types) — `parseCommitMessage` validates
  every field explicitly and returns a typed error rather than rendering garbage or crashing the client
- **Missing API key in the deployed environment** — `composeCommitMessage` checks for it explicitly and
  returns a clear server-side error instead of letting `fetch` fail with a confusing message

## Rollback plan

No database, no migrations, no persisted state — this app is stateless per-request. If a deploy breaks
something: **redeploy the previous commit from `main`** via Vercel's dashboard ("Instant Rollback" to
the prior deployment) or `git revert` + push. There is nothing to roll back except the deployed code
itself.

## Monitoring

Vercel's built-in deployment logs and the Functions tab (for `/api/compose` invocation errors) are the
monitoring surface for this project's scale — no separate APM is warranted for a single-route app.
