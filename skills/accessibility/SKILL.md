---
name: accessibility
description: "Accessibility to WCAG 2.2 AA on web, iOS (SwiftUI) and Android (Compose) - semantics, ARIA, keyboard and focus, contrast, target size, forms, reduced motion. Use for a11y audits and fixes."
---

# Accessibility (WCAG 2.2 AA)

Visual design of focus and other states: `make-interfaces-feel-better`. Component tests with axe: `react-testing`.

## Semantics first

- Pick the element by function: `<button>` acts, `<a>` navigates, native form controls before custom widgets. Add `role` only when no native element fits.
- Build page structure from landmarks, not stacks of `div`s: `header`, `nav` (named with `aria-label`), `main`, `section` named by its heading through `aria-labelledby`, `footer`.
- A clickable `div` or `span` without a role, focusability, and key handling is a bug.

## Perceivable

- Contrast at least 4.5:1 for normal text, 3:1 for large text and UI components.
- Give non-text content (images, icons) a text alternative; never start alt text with "image of" or "picture of".
- Never signal state or errors by color alone.
- Content reflows at 400% zoom and with enlarged text without losing function.

## Operable

- Targets at least 24x24 CSS px on web, 44x44 pt on native.
- Every interactive element works by keyboard and shows a clearly visible, high-contrast focus indicator.
- Web: the first focusable element is a skip link to `main`, visually hidden until focused; essential with a fixed header.
- Stop non-essential animation when the reduced-motion setting is on (platform mapping below); with `motion` on web, `<MotionConfig reducedMotion="user">` in a root client provider.
- Modals keep focus inside while open, close with Escape or a close button, and hand focus back on close; menus and dropdowns return focus to their trigger.
- Every drag interaction has a single-pointer alternative.

## Understandable

- Keep navigation consistent.
- Errors say in text what is wrong and how to fix it.
- Web forms: `<label htmlFor>` on every input, `autoComplete` where a value applies; on error `aria-invalid` and `aria-describedby` pointing to the error text.
- Never ask again for data the user already entered in the same flow.

## Robust

- Every control exposes a correct name, role, and value; icon-only buttons get a text label.
- Announce dynamic status changes through live regions (`aria-live="polite"`).

## Platform mapping

| Need | Web | iOS (SwiftUI) | Android (Compose) |
|---|---|---|---|
| Label | `<label>`, `aria-label` | `.accessibilityLabel()` | `contentDescription` |
| Hint | `aria-describedby` | `.accessibilityHint()` | none; state via `stateDescription` |
| Role | native element, `role` | `.accessibilityAddTraits(.isButton)` | `semantics { role = Role.Button }` |
| Live update | `aria-live="polite"` | `AccessibilityNotification.Announcement(...).post()` | `semantics { liveRegion = LiveRegionMode.Polite }` |
| Reduced motion | `prefers-reduced-motion` | `@Environment(\.accessibilityReduceMotion)` | `Settings.Global.ANIMATOR_DURATION_SCALE` is 0 |
