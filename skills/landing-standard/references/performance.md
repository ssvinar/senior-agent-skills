# Performance

Target PSI 95+ on mobile and desktop; pass bar: [verify.md](verify.md) §4. Rules, Core Web Vitals targets, compression behind an edge, image optimizer config, RSC cache trap, bfcache: `react-performance`. Measure first, then fix by impact.

## 0. Baseline

Use a PSI API key if available (`&key=...`).

```bash
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://SITE&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo"
```

Repeat with `strategy=desktop`. Save score, FCP, LCP, TBT, CLS.

One run is not a diagnosis. Before fixing a page that one run found slow, measure it 3 more times at least 90 s apart and drop runs whose `lighthouseResult.environment.benchmarkIndex` is far below the others (a slow Google machine; we drop below 0.6 of the batch median). Within a minute PSI returned identical results for the same URL; 90 s apart they differed. Measured: of 7 pages flagged by one run, 1 had a real cause; a 1.9 s render delay came from a machine at index 509 against 1000-1300, a 7.3 s first paint did not repeat.

## 1. inlineCss (light pages only, keep it only if measured better)

Symptom: FCP/LCP near 2.5 s on a light page; PSI flags 2-3 render-blocking CSS files.
Set `experimental: { inlineCss: true }` in `next.config`: CSS goes into `<head>` as `<style>`, no render-blocking stylesheets. Needs `style-src 'unsafe-inline'` in the CSP.

The CSS is also duplicated in the RSC payload. On pages with a heavy payload (catalogs, long content) that doubles the HTML: measured on a multi-page site, 76 → 150 KB gzip per page, LCP median 2.36 → 3.08 s on mobile, reverted. Measure the same pages before and after (`react-performance`) and keep the flag only if LCP improves.

## 2. Third-party JS and heavy sections

- **GA4**: load gtag.js (183 KB) with `strategy="lazyOnload"`. In the root layout add a tiny inline stub with `strategy="beforeInteractive"` that defines `dataLayer` and `gtag` and sets consent defaults ([seo-i18n.md](seo-i18n.md)); it buffers early events and gtag.js replays them. Add `<link rel="preconnect" href="https://www.googletagmanager.com" />`.
- **RUM**: in a client component, `useReportWebVitals` pushes to `window.dataLayer` directly; `window.gtag` does not exist yet under `lazyOnload`.
- **DeferHydrate** for heavy below-the-fold sections (carousels, lightboxes, phone inputs, `motion`): a client wrapper that mounts children only when an IntersectionObserver (`rootMargin: "300px"`) fires, keeping their JS out of the hero's hydration window. Give the wrapper a `minHeight` (CLS) and put the section `id` on the wrapper, not inside, or menu anchors fail before mount.

## 3. Misc

- `output: "standalone"` for self-hosted deploys.
- Skip Speculation Rules and View Transitions on a one-pager (no navigations); revisit if the site becomes multi-page.

## 4. After

[verify.md](verify.md) §4.
