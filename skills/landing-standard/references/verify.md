# Verification

Order: local → live browser → production headers → PSI. Catch errors before pushing, not in CI. Steps 1-2 run before deploy, steps 3-4 after. The work is not done until all four pass.

## 1. Local

Lint, typecheck, build: `verification-loop`. The build must be clean; read Next warnings (deprecated APIs, routes that went dynamic but should be static).

## 2. Live browser (Playwright, never skip)

tsc and build miss UX bugs: dead menu items, lost anchors, modals that will not close. Process: `browser-qa`. Landing checklist:
- Click every menu item; each scrolls to its section, including DeferHydrate sections (anchor `id` on the outer wrapper).
- Anchors on both the default and a non-default locale (`/en#x` drops the hash under `as-needed`).
- Open and close every modal. Submit forms with test data only through a test channel; otherwise check client-side validation without submitting.
- Switch locales: content changes, URL is correct.
- Screenshots at the `browser-qa` breakpoints: no overflow, no overlap.
- Tab through the page: focus ring visible, skip link works.
- Emulate `prefers-reduced-motion: reduce`: animations stop.

Commit the pass as `tests/e2e/smoke.spec.ts` with `playwright.config.ts`. `@playwright/test` in devDependencies with no tests is debt: add the smoke test or remove the package.

## 3. Production

```bash
curl -sI https://SITE/ | grep -iE 'content-security|cache-control|x-frame'
curl -sI https://SITE/hero.avif | grep -i cache-control          # immutable
curl -sI -H "RSC: 1" https://SITE/ | grep -i cache-control      # no-store
```

Agent layer: the check block in [agent-layer.md](agent-layer.md). OG card: https://www.opengraph.xyz or the Facebook/Telegram debuggers. Schema: https://search.google.com/test/rich-results.

## 4. PSI after

Same request as the baseline ([performance.md](performance.md) §0), mobile and desktop. Pass: all four categories ≥ 90 on both (target 95+), and the `react-performance` lab and field targets are met. On a regression compare individual audits, not the overall score. The first run after deploy may hit a cold edge cache: warm the page with one request and measure again.
