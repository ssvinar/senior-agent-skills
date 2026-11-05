---
name: browser-qa
description: "Browser checks of a running UI - smoke, interactions, visual regression and responsive layout at the canonical breakpoints, cross-browser, automated accessibility pass, ship verdict. Use when a UI change reaches a preview or staging URL. Launch readiness: production-audit."
---

# browser-qa

Drive the running app like a user with the browser automation at hand: your agent's browser tool, a Playwright MCP server, or Playwright or Puppeteer scripts.

## Safety

- Read-only by default. Mutating journeys (checkout, payment, delete, bulk update) only on staging or preview, with explicit opt-in. Never on production.
- Seeded test accounts only, never real production logins.
- Redact credentials, tokens and personal data before saving screenshots.

## Breakpoints

**320, 375, 768, 1024, 1440, 1920** px wide. The only set; use all six for visual and responsive checks.

## Checks

### 1. Smoke

- Load each target page. Record console errors (skip analytics and third-party noise) and every 4xx/5xx request.
- Screenshot the first viewport at 375 and 1440.
- Lighthouse or equivalent on key pages. Core Web Vitals targets: see `react-performance`.
- Live pages after a deploy: `node scripts/live-check.mjs <dir-with-playwright> <out-dir> <url>...` runs the smoke pass at 375 and 1440 in the installed Chrome (`channel: "chrome"`, no browser download) with analytics blocked, so checks add no visits to the site's stats. It also reports CLS, the LCP element (an image must be eager with `fetchpriority="high"`) and third-party hosts contacted before any interaction. Exit code 1 on any failure.

### 2. Interaction

- Every navigation link resolves.
- Forms: valid input reaches the success state; invalid input shows a clear error.
- Auth: login, protected page, logout, with test credentials.
- Critical journeys (search, onboarding, checkout) within the safety rules.
- Touch interactions at mobile widths.

### 3. Visual and responsive

- Screenshot key pages and meaningful states (hero, scroll-driven sections, empty, error, loading) at every breakpoint.
- Compare with committed baselines. No baseline: INCONCLUSIVE, never PASS.
- Flag shifts over 5 px, missing elements, horizontal overflow, clipped text.
- Rows of cards: within a row the card frames end at one height. Check every page that has such rows: one item without an optional field breaks only its row.
- Open each menu, dropdown and dialog on desktop with a visible scrollbar and compare fixed elements before and after. Headless Chrome hides scrollbars; in Playwright pass `ignoreDefaultArgs: ["--hide-scrollbars"]`.
- Layout shift on load: a cold load (fonts not cached) at several phone widths, not one emulated width.
- Light and dark themes: check both when both exist.
- Screenshots add to unit and component tests; they do not replace coverage.

### 4. Cross-browser

- At least Chrome, Firefox and Safari (Playwright: chromium, firefox, webkit).
- Scrolling, motion, and fallbacks for unsupported features.

### 5. Accessibility

- axe-core on each page; flag WCAG 2.2 AA violations.
- Keyboard through each journey: visible focus, logical order. Landmarks present.
- With `prefers-reduced-motion`, motion reduces or stops. Contrast checked on the rendered page.
- axe covers only part of WCAG: never report "accessible" from it alone. Criteria and manual checks: `accessibility`.

## Report

```text
QA <url> <timestamp>
Smoke:          console <critical>/<warnings>; failed requests; CWV vs targets
Interaction:    PASS|FAIL per item, e.g. FAIL contact form: no error for invalid email
Visual:         PASS|FAIL|INCONCLUSIVE per page x breakpoint
Cross-browser:  per browser
Accessibility:  violations with element and rule
Verdict:        SHIP | SHIP WITH FIXES | DO NOT SHIP | INCONCLUSIVE (no baseline)
```
