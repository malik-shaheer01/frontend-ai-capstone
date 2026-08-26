# NOTES.md — Hand-built vs. shadcn/ui

Three components were built from scratch (`src/components/custom/`) against the W3C ARIA Authoring
Practices patterns, then shadcn/ui's `dialog` and `tabs` were installed (`src/components/ui/`, built
on `radix-ui`) and read to compare against.

## What mine got right

Keyboard-tested directly in the browser (not just read on paper):

- **Modal**: opens with focus moved to the first focusable element inside the dialog, `Tab`/`Shift+Tab`
  are trapped and wrap at both ends, `Escape` closes it, and focus returns to the button that opened it.
- **Tabs**: roving `tabindex` (only the selected tab is `tabindex="0"`), `ArrowLeft`/`ArrowRight` move
  and select, `Home`/`End` jump to the first/last tab, panels are linked via `aria-controls`/
  `aria-labelledby` and hidden with the `hidden` attribute so they drop out of the tab order.
- **Disclosure**: a real `<button>` with `aria-expanded`/`aria-controls`, so `Enter`/`Space` work for
  free from native button semantics — no custom key handling needed.

## Concrete gaps vs. shadcn/ui's version

1. **No background isolation from assistive tech.** shadcn's `DialogContent` renders through
   `DialogPrimitive.Portal` (Radix), which — alongside Radix's internal focus-scope handling — keeps a
   screen reader's virtual cursor from wandering into the page behind the dialog while it's open. My
   `Modal` only traps *keyboard* focus; a screen reader user browsing by touch/virtual cursor (not Tab)
   can still reach the page content underneath, because I never mark the rest of the page `aria-hidden`
   or `inert` while the dialog is open. Same gap for background scroll: Radix's dialog locks body scroll;
   mine doesn't.

2. **No vertical orientation or activation-mode option in Tabs.** shadcn/Radix's `Tabs` reads
   `orientation` and swaps `ArrowLeft/Right` for `ArrowUp/Down` accordingly (per the APG pattern, which
   requires this), and exposes an `activationMode` (`automatic` vs. `manual`) so arrow keys can move
   focus without immediately switching panels. Mine hard-codes horizontal, automatic-activation-only
   behavior — correct for the common case, but it silently breaks the APG contract the moment a vertical
   tab list is needed.

3. **No composition escape hatch.** Every Radix/shadcn primitive (`DialogTrigger`, `TabsTrigger`, etc.)
   supports `asChild`, so the trigger can be *any* element (a `Button`, a custom `Link`) instead of a
   fixed wrapper. My components hard-code their own `<button>` markup, so wiring in a differently-styled
   trigger means editing the component internals rather than composing around them.

4. **Focus-trap edge cases.** My trap re-queries focusable descendants on every `Tab` keypress, which
   handles content that changes while the dialog is open, but I never handle the case where the dialog
   opens with *zero* focusable elements other than itself (Radix's `FocusScope` falls back to focusing
   the dialog container itself in that case; mine would just fail to move focus anywhere and rely on
   the browser default).

None of this makes the hand-built versions wrong for the ARIA APG pattern itself — the evaluation
criteria (keyboard operation, focus trap + return) all pass — but it's the difference between "meets
the pattern" and "production-hardened against every assistive-tech and edge-case scenario," which is
what a maintained library buys you.
