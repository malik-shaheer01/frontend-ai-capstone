# Deployment checklist

## Pre-deploy

- [x] `npm run build` succeeds locally with no type errors
- [x] `npm run test` (Vitest) is green
- [x] `npm run e2e` (Playwright) is green, including the axe accessibility scan
- [x] `npm run lint` is clean
- [x] No secrets committed — `GROQ_API_KEY` only exists in `.env.local` (gitignored) and, in
      production, as a Netlify environment variable
- [x] `GROQ_API_KEY` set in the Netlify site's environment variables

## Deploy

- [x] Site connected directly to this GitHub repo via Netlify's dashboard (Add new site → Import an
      existing project → GitHub), base directory `capstone`, build command `npm run build`, publish
      directory `.next` — auto-redeploys on every push to `main`, no CLI/manual step needed per deploy
- [x] `capstone/netlify.toml` explicitly declares `@netlify/plugin-nextjs` — **required**; without it,
      Netlify serves the raw build output as a static site and returns a 404 on every route, since
      Next.js's App Router output has no static `index.html` to fall back to. This was the actual first
      deploy attempt's real failure, caught immediately and fixed (see the log below).
- [x] **Live URL: https://flyrank-caps.netlify.app** — confirmed working: returns 200, serves the
      correct app, and `/api/compose` was tested directly against the real Groq API in production and
      returned a correct, well-formed commit message

## Deploy log (real, not hypothetical)

1. First deploy via Netlify's dashboard, no `netlify.toml` present — build succeeded, but the live URL
   returned Netlify's default "Page not found." Root cause: Netlify's Next.js runtime wasn't activated,
   so it served `.next`'s raw output as a static site instead of routing through Next's server functions.
2. Fix: added `netlify.toml` declaring `command = "npm run build"`, `publish = ".next"`, and
   `[[plugins]] package = "@netlify/plugin-nextjs"`; added the plugin as a devDependency. Re-verified
   `npm ci` in an isolated directory, typecheck, and build all still pass before pushing.
3. Pushed to `main` — Netlify auto-redeployed from the connected repo. Verified: site returns 200, and
   a real POST to `/api/compose` against production Groq returned a correct response.
4. Lighthouse re-run against the live URL (not localhost): **89 performance / 100 accessibility / 100
   best practices / 100 SEO** — clears the ≥85 bar, confirming the earlier local 84 was sandbox
   throttling overhead, not a real app issue. Full numbers in [AUDIT.md](./AUDIT.md).

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
something: **redeploy the previous commit from `main`** via Netlify's dashboard ("Deploys" tab → pick a
prior successful deploy → "Publish deploy") or `git revert` + push to trigger a fresh auto-deploy. There
is nothing to roll back except the deployed code itself.

## Monitoring

Netlify's built-in deploy logs and Function logs (for `/api/compose` invocation errors, since Next's API
routes run as Netlify Functions under this plugin) are the monitoring surface for this project's scale —
no separate APM is warranted for a single-route app.
