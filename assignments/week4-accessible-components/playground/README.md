# FE-04 — Accessible Component Fundamentals

Three interactive components built from scratch against the [W3C ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/), plus shadcn/ui's equivalents installed for comparison.

## Run it

```bash
npm install
npm run dev
```

## What's here

- `src/components/custom/` — hand-built Modal, Tabs, and Disclosure (no component libraries)
- `src/components/ui/` — shadcn/ui's `dialog` and `tabs`, built on Radix UI, added for comparison
- [`NOTES.md`](./NOTES.md) — concrete gaps between the two, found by reading shadcn's generated source

All three hand-built components were keyboard-tested in a running browser: `Tab`/`Shift+Tab` trap and
wrap inside the modal with focus returned to the trigger on close, `ArrowLeft`/`ArrowRight`/`Home`/`End`
drive the tabs with roving `tabindex`, and the disclosure toggles via native button semantics.
