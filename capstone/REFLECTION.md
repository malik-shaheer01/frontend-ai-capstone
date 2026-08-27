# Reflection

**What was hardest, and why?**

The hardest part wasn't the AI integration itself — it was the layer just below it: making sure a bad
or malformed model response could never reach the user as a crash or garbage output. `parseCommitMessage`
went through several iterations because "the model didn't return what I expected" turned out to have
more shapes than I first accounted for (non-JSON text, JSON missing required fields, JSON with the
right fields but wrong types). Writing it as a pure function I could unit-test without a network call
made this tractable — I could enumerate every bad-input case as a test rather than guessing.

Second hardest: environment mismatches that had nothing to do with the actual feature. The Vitest test
runner hung indefinitely under its default `forks` pool in this environment and needed `pool: "threads"`
to work at all; Playwright's `role="alert"` queries silently don't match on visible text because ARIA's
`alert` role prohibits "name from content" by spec — both cost real debugging time before I found the
actual cause, and neither had anything to do with my application code being wrong.

**What would I do differently next time?**

I'd pick the AI provider and confirm free-tier access *before* scoping the rest of the project, not
after. This capstone's first real attempt (a different app, using Anthropic's API) hit a billing wall
immediately, and only got unblocked by switching providers to Groq. That's a decision that should come
first, not get discovered mid-build.

**One thing that surprised me:**

That every test I'd written could pass — 10 Vitest tests, 3 Playwright tests, a clean build, a clean
Lighthouse audit — while the core feature was completely broken. Every single one of those tests mocked
the network call somewhere. The moment I finally added one real, unmocked test against the live Groq
API (gated to skip automatically when no key is present, so it never touches CI), it failed instantly:
the model I'd built against, `llama-3.3-70b-versatile`, no longer existed on Groq's current lineup.
Mocked tests prove your code does what you told it the API would do; they can't prove the API still
agrees with you. That's not a reason to mock less — the alternative is a slow, flaky suite that can't
run in CI at all — but it's a reason to keep at least one real integration check that runs whenever a
credential is actually available, which this project didn't have until I went looking for the gap
myself. Fixed in a few minutes once found (switched to `openai/gpt-oss-120b`, confirmed against Groq's
live model list), but it would have shipped silently broken without that one real call.

Second surprise, smaller: an accessibility test can fail for a reason that has nothing to do with your
HTML being wrong. Playwright's strict-mode matching flagged Next.js's own built-in route-announcer
`<div role="alert">` as a second match for a generic `getByRole("alert")` query — the fix wasn't in the
app, it was in how precisely the test targeted the element it actually meant.
