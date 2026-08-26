# FE-06 — Buttons with a Brain: Motion & State Micro-interactions

**Live demo:** https://claude.ai/code/artifact/95cce68b-3f7d-4632-99df-cf0df6c2eb6e

A "Send message" button (plus a second "Add to cart" button sharing the same motion system) that
communicates its full lifecycle — idle, hover/focus, active/press, loading, success, error, and a
disabled state — entirely through motion and color, with every transition eased on purpose.

## Run it locally

Plain HTML/CSS/JS, no build step:

```bash
open index.html
```

## What's here

- `index.html` — the demo page, including two "Trigger success" / "Trigger failure" controls so the
  failure path doesn't depend on the 20% random roll, and a live `state: <value>` badge next to each
  button showing its real `data-state` in real time
- Duration/easing rationale is written directly on the page (bottom section) — see it there or read
  the CSS custom properties (`--dur-*`, `--ease-*`) at the top of `index.html`

## How it meets the brief

- **≥5 distinct states:** idle, hover/focus, active/press, loading, success, error, plus a bonus
  simulated-disabled toggle
- **Every change is a transition:** no `display: none` swaps — every state lives in an
  absolutely-positioned layer crossfaded via `opacity`/`transform`
- **Compositor-friendly only:** the button's width is fixed and never animates; only `transform` and
  `opacity` change, so nothing here forces layout
- **Interruptible:** clicking mid-loading is ignored (guarded in `runCycle`); clicking during a
  success/error hold cancels the pending timer and restarts cleanly — verified by spam-clicking four
  times in a row and confirming exactly one clean loading cycle results
- **Keyboard accessible:** real `<button>` elements, visible `:focus-visible` ring — confirmed by
  tabbing to the button with real keyboard events (not just `.focus()`, which doesn't reliably trigger
  `:focus-visible` in Chromium) and reading the computed outline
- **`prefers-reduced-motion`:** transforms and animations are stripped under the media query; the
  spinner keeps spinning (it's the actual feedback that work is happening) and crossfades still happen,
  just near-instant, so state changes stay visible without motion
