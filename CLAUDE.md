# CLAUDE.md

Stack and conventions for the **frontend-ai-capstone** repo (FlyRank AI Internship, Front-end AI Engineering track). This is the default setup for the rest of the track's assignments and the capstone; adjust per-assignment if a brief calls for something different.

## Stack

- **Small assignment drills (e.g. FE-02):** plain HTML/CSS/JS or Vite + Tailwind, npm, no framework overhead needed — unless the brief itself specifies a stack (e.g. FE-04 requires React + TypeScript for its component playground).
- **Capstone:** **Shopify** (decided 2026-08-08). Not Next.js/Vercel — Shopify has its own tooling and deployment model:
  - **Theme base:** Dawn (Shopify's official reference theme), customized
  - **Templating:** Liquid + JSON templates (Online Store 2.0 sections)
  - **Styling:** Tailwind CSS compiled via Tailwind CLI into a theme asset (Shopify themes have no native npm bundler)
  - **Tooling:** Shopify CLI (`shopify theme dev` for live local preview against a dev store, `shopify theme push` to publish)
  - **Hosting/account:** a free Shopify Partners development store — no paid plan needed for a portfolio build
  - **Location in repo:** `capstone/` (Shopify's required folder structure — `assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/` — doesn't belong at repo root next to README/LICENSE/etc.)
- **Formatting:** Prettier
- **Package manager:** npm

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`, `style:`, `refactor:`, `test:`
- **Assignment layout:** one folder per assignment under `assignments/<week>-<slug>/`, created as each assignment starts
- **Progress tracking:** [PROGRESS.md](./PROGRESS.md) — every assignment marked Done / Submitted / Pending, with the 5 counting toward the certificate flagged explicitly
- **No secrets committed** — use `.env`, which is gitignored; Shopify CLI's own auth token is never committed (it lives outside the repo, managed by `shopify login`)

## Environment

- Node.js LTS + Git required locally (confirmed installed 2026-08-08: Node v24.12.0, Git 2.54.0)

## Rules learned from FE-02 (vague vs. precise prompting drill)

Full comparison: [assignments/week1-ai-workflow-drill/WORKFLOW.md](./assignments/week1-ai-workflow-drill/WORKFLOW.md)

- **Every form input gets a `<label for="...">` tied to its `id` — never a bare text node next to the input.** A vague prompt reliably drops this; a review should fail any form PR where a label isn't programmatically associated with its field.
- **Form submit handlers must call `e.preventDefault()` as the first line, and must not treat the form as saved until a `validateForm()`-equivalent check has run and returned no errors.** Silent no-validation submits are the single most common defect an unscoped prompt produces.
- **Any new interactive component ships with a runnable test file covering its validation/logic layer (`node --test`, or the project's test runner) before the DOM wiring is written — not after.** If there's no test file, the component isn't done, regardless of how it looks in the browser.
- **Verify UI changes in an actual running browser (via a local server), not just by reading the code or opening the file directly.** A `file://` open can render a static snapshot with non-functional scripts and hide real bugs (e.g. a module-system mismatch between an ES `import` and a CommonJS `module.exports`) that only show up when something is actually clicked.
