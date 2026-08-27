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

That an accessibility test could fail for a reason that had nothing to do with my HTML or ARIA
attributes being wrong — Playwright's own strict-mode element matching flagged Next.js's built-in
route-announcer `<div role="alert">` as a second match for a generic `getByRole("alert")` query. The
fix wasn't in the app; it was in how precisely the test targeted the element it actually meant.
