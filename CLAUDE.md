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
