# CLAUDE.md

Stack and conventions for the **frontend-ai-capstone** repo (FlyRank AI Internship, Front-end AI Engineering track). This is the default setup for the rest of the track's assignments and the capstone; adjust per-assignment if a brief calls for something different.

## Stack

- **Build tool:** Vite
- **Styling:** Tailwind CSS
- **Language:** HTML/CSS/JS (TypeScript optional, per assignment)
- **Package manager:** npm
- **Formatting:** Prettier
- **Deployment (capstone):** Vercel or GitHub Pages — capstone must ship as a public link

## Conventions

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`, `style:`, `refactor:`, `test:`
- **Assignment layout:** one folder per assignment under `assignments/<week>-<slug>/`, created as each assignment starts
- **Progress tracking:** [PROGRESS.md](./PROGRESS.md) — every assignment marked Done / Submitted / Pending, with the 5 counting toward the certificate flagged explicitly
- **Capstone:** lives at repo root (or `capstone/` once the build starts) and must stay a deployable, responsive, Tailwind-built site
- **No secrets committed** — use `.env`, which is gitignored

## Environment

- Node.js LTS + Git required locally (confirmed installed 2026-08-08: Node v24.12.0, Git 2.54.0)

## Rules learned from FE-02 (vague vs. precise prompting drill)

Full comparison: [assignments/week1-ai-workflow-drill/WORKFLOW.md](./assignments/week1-ai-workflow-drill/WORKFLOW.md)

- **Every form input gets a `<label for="...">` tied to its `id` — never a bare text node next to the input.** A vague prompt reliably drops this; a review should fail any form PR where a label isn't programmatically associated with its field.
- **Form submit handlers must call `e.preventDefault()` as the first line, and must not treat the form as saved until a `validateForm()`-equivalent check has run and returned no errors.** Silent no-validation submits are the single most common defect an unscoped prompt produces.
- **Any new interactive component ships with a runnable test file covering its validation/logic layer (`node --test`, or the project's test runner) before the DOM wiring is written — not after.** If there's no test file, the component isn't done, regardless of how it looks in the browser.
- **Verify UI changes in an actual running browser (via a local server), not just by reading the code or opening the file directly.** A `file://` open can render a static snapshot with non-functional scripts and hide real bugs (e.g. a module-system mismatch between an ES `import` and a CommonJS `module.exports`) that only show up when something is actually clicked.
