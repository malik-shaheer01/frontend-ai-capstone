# Performance & accessibility audit

Run three ways: against a local production build, then against the real live deployment at
**https://flyrank-caps.netlify.app**, once deployment was confirmed working.

## Live deployment (final, authoritative numbers)

| Category | Score |
|---|---|
| Performance | **89** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |

LCP 1.3s, TBT 430ms, 0 color-contrast violations. **Clears the brief's ≥85 performance pass bar**,
confirming the local sandbox's throttled 84 (below) really was environment overhead, not an app problem.

## Accessibility

**Automated (axe-core via Playwright, `e2e/a11y.spec.ts`):** 0 WCAG 2.1 A/AA violations.

**Finding → fix:** the initial local run scored 95/100, flagging insufficient color contrast on the
heading, body text, and link (foreground grays like `#525252` against a background of `#0a0a0a`). The
cause: `create-next-app`'s default `globals.css` swaps `--background` to near-black under
`prefers-color-scheme: dark`, but every text color in this app was a hardcoded Tailwind gray chosen for
a light background — nothing here ever adapted the other way. Rather than half-implement dark mode for
a small single-purpose tool, `globals.css` now commits explicitly to light-only (the dark-mode media
query was removed), which is a legitimate, deliberate choice — not an oversight — for a page this size.
Re-run after the fix, both locally and on the live deployment: 0 contrast violations, 100/100.

## Performance — local vs. live

| Run | Score | TBT | LCP |
|---|---|---|---|
| Local, default throttling (Lighthouse's simulated mobile CPU/network) | 84 | 470ms | 2.8s |
| Local, unthrottled (`--throttling-method=provided`), isolating actual app work | 100 | 0ms | 0.5s |
| **Live deployment** (`flyrank-caps.netlify.app`, default throttling) | **89** | 430ms | 1.3s |

The local throttled run (84) fell just under the brief's 85 target; the unthrottled run (100) showed
this was a nearly-static page doing real work in under half a second, so the gap was Lighthouse's 4x CPU
slowdown simulation compounding with the sandboxed dev machine's own load — not a bottleneck in the app.
The live deployment confirms this: Netlify's real infrastructure scores 89, clearing the pass bar, with
LCP more than halved (1.3s vs. 2.8s) purely from not running on a loaded local sandbox.

## Reproducing this audit

```bash
npx lighthouse https://flyrank-caps.netlify.app --view \
  --only-categories=performance,accessibility,best-practices,seo
```
