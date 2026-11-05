---
name: react-performance
description: "Runtime performance for React and Next.js; owns Core Web Vitals targets, bundle budgets and loading strategy. Use for measured speed problems - slow loads or interactions, Core Web Vitals or Lighthouse regressions, bundle size, images, fonts, caching and delivery, animation performance - and when building a site, to ship only the fonts, library code and widgets it uses."
---

# React Performance

Memoization policy, state, effects, hooks, parallel requests, barrels: `lean-code`. Server Action auth, CSP nonces: `security`. Motion design: `make-interfaces-feel-better`.

## Targets

- Core Web Vitals: LCP < 2.5 s, INP < 200 ms, CLS < 0.1. INP replaced FID, which is retired.
- Lab: FCP < 1.5 s, TBT < 200 ms.
- Gzipped budgets:

| Page type | JS | CSS |
|---|---|---|
| Landing | < 150 KB | < 30 KB |
| App | < 300 KB | < 50 KB |
| Microsite | < 80 KB | < 15 KB |

## Principle: ship only what the site uses

From every font, library, widget and dictionary the browser gets only the part the site uses. Applies when building and when auditing:

- Fonts: subset to the characters the site shows, keep only the weights in use.
- Libraries: import the functions you call; `import()` or `import * as` of a package brings all of it.
- Shared layout: its imports ship on every page; small effects with CSS and built-in elements, not a library.
- Widgets (maps, video, chat): a static facade until the visitor taps it.
- Translations and data: each page gets only the namespaces and fields its Client Components read.

Procedure, scripts (route chunks, site characters, font subsetting) and measured gains: [references/ship-only-what-is-used.md](references/ship-only-what-is-used.md).

## Where to look first

| Symptom | Start with |
|---|---|
| Slow LCP | Images, then waterfalls, bundle size, resource hints |
| Slow INP, high TBT | Re-renders, rendering, JS hot paths, third-party scripts |
| CLS | Image dimensions, reserved space for streamed or lazy content, carousel layout set by JS, lines that rewrap when the web font loads, values swapped after hydration (stored preferences: `references/render.md`) |

Sections below are in priority order.

## 1. Waterfalls

- Run cheap synchronous checks (props, env, flags) before the first `await`.
- Await inside the branch that uses the value, not before the branch.
- With partial dependencies, start every promise up front and await each where its result is needed.
- Server Components: move independent awaits into sibling child components so they resolve concurrently.
- Put `<Suspense>` right around slow data so the rest streams first; reserve the space it will fill.
- Links and client navigations go straight to the final URL. A `redirect()` during rendering costs a second server render on every client navigation, with a blank or stale screen until it lands, and `<Suspense>` does not hide it. Build the canonical URL where the link is made; redirect before render (`next.config` redirects, proxy) only for direct hits.

## 2. Bundle size

- List third-party packages that ship barrel files in `optimizePackageImports`.
- Keep `import()` paths static: one literal per branch, no template strings.
- Load heavy or rarely used code (charts, animation libraries, editors, admin screens) with `next/dynamic` or `await import()` at the point of use; `ssr: false` only for client-only code, never for the first screen.
- `import()` of a package name loads the whole package: import a local module that re-exports only the functions you call.
- Third-party widgets (maps, video players, chat) behind a facade: a static image and a button; the widget loads on tap.
- Load analytics, chat, and logging after hydration: `next/script` with `afterInteractive` or `lazyOnload`, or start counters on the first human action (trade-off in the reference). Plain `<script>`: `defer` keeps order and runs after parsing; `async` for independent scripts.
- Inline critical above-the-fold CSS only where it pays off; defer non-critical CSS and JS. Next.js `inlineCss` also copies the CSS into the RSC payload: on content-heavy pages it doubled the HTML and slowed LCP, so keep it only after a before/after measurement.
- Start loading the next chunk on hover or focus (`import()` or `<link rel="preload">`).
- Check first-load JS per route with `@next/bundle-analyzer`, or on Turbopack builds with `scripts/route-chunks.cjs`.

## 3. Images, LCP, fonts

First-screen image bytes dominate mobile LCP.

- Use `next/image` for content images; a raw `<img>` serves the original file. Grep for `<img` on every pass and justify each hit. Resizing matters more than format.
- Set `sizes` to the width actually painted at each breakpoint, not the container width. An image with `width` and no `sizes` gets a 1x/2x `srcset`, and a dense phone screen takes the 2x file (a 1920 px copy for a 370 px card).
- Only the LCP image gets high priority: `loading="eager"` plus `fetchPriority="high"`. Everything else stays lazy. Next.js 16 deprecated `priority` for `preload`; both turn off lazy loading and add a `<link rel="preload">`, but neither sets `fetchpriority` on the `<img>`. Use `preload` alone, for one LCP candidate discovered late in the body.
- Find the LCP element at phone width in every locale (`browser-qa` live-check reports it), not by eye: a longer translation can make text the LCP element in one locale and a photo in another. An image that is the LCP element in any locale gets `eager` plus `high`. Measured: a contacts photo left lazy because it sat below the text on phones was the LCP element in English only, LCP 3.0 → 1.58 s.
- The LCP image must be in the server HTML, not rendered by client JS (`ssr: false`, a client-only gallery, an effect). Ship the first screen of a gallery from the server; lazy-load only the fullscreen viewer.
- Import the component that holds the LCP image directly, not through `next/dynamic` with a `loading` fallback: `next/dynamic` is `React.lazy` plus Suspense, so the server sends the fallback in place and streams the component in a hidden block shown at the end of the HTML. The image downloads early but paints late.
- Lists and grids: an `isLcp` prop on the card, true for the first item only.
- Give every image `width`/`height` or a sized container.
- Add `loading="lazy"` to every carousel slide image; carousels mount all slides and loop clones at once.
- Carousels: set slide widths with CSS classes (Swiper `slidesPerView: "auto"`), not JS breakpoints, so the server HTML already has the final layout; gaps as slide padding with a negative margin on the container. Swiper's stylesheet is unlayered and beats Tailwind v4 utilities: use the `!` modifier.
- A placeholder for lazy content has the height of what replaces it.
- Render the hero as an image element, not a CSS `background-image`, which is discovered late at low priority.
- Turbopack skips optimization for static AVIF/WebP imports: import a PNG/JPG master, or use a string path with explicit size.
- Optimizer config: `sharp` in dependencies when self-hosted; `formats: ["image/avif", "image/webp"]`, `minimumCacheTTL: 2678400`, `qualities: [60, 75, 80]` (Next.js 16: `images.qualities` is a required allowlist). Without `formats` Next.js serves WebP only, even when the masters are AVIF. After changing `formats` the optimizer cache is cold: warm it before measuring.
- Never add a manual `<link rel="preload">` for a `next/image` source file: it bypasses the optimizer and downloads twice.
- `/public` files are served with `max-age=0`; add a long `immutable` `Cache-Control` for static extensions in `next.config` `headers()` and ship changed files under a new name or query string.
- Prefer AVIF/WebP with fallbacks; never serve sources far larger than their rendered size.
- Where the design allows, make heading text the LCP element instead of a large image.
- Fonts: at most two families unless clearly justified; `font-display: swap`; subset to the characters the site shows (procedure and license note in the reference); preload only the critical weight and style. `next/font` preloads every file of a family or none: with several weights, measure `preload: false`. In Next.js use `next/font` (self-hosted, preloaded, fallback metrics against CLS); a bare `@font-face` shifts the LCP heading.
- Fallback metrics match the web font on average, not line by line: a first-screen line that just fits in the fallback wraps when the web font arrives and pushes the screen down. Do not let such a line depend on its exact width (on phones put a value that may not fit, such as a price, on its own line), and measure CLS on a cold load at several phone widths: PSI emulates one (412 px). Measured: a hero price line fit at 390 px in the fallback and wrapped in the web font, CLS 0.28, while PSI showed 0.

## 4. Animation performance

- Animate only `transform`, `opacity`, `clip-path`, and, sparingly, `filter`.
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`, `border`, or `font-size`.
- Add `will-change` only to fix first-frame stutter, only on the element that stutters, and remove it afterwards; never `will-change: all`.
- Use CSS transitions for simple motion; drive JS motion with `requestAnimationFrame` or a maintained animation library.
- Replace scroll handlers with `IntersectionObserver`. An unavoidable global listener (scroll, resize) is one shared hook, not one per component; mark scroll and touch listeners `{ passive: true }`.
- Transform a wrapper element, not the `<svg>` itself.

## 5. Server, client, re-render, rendering, JS

- Server-side caching, payload size to Client Components, module state, post-response work, client fetching, `localStorage`, compression behind an edge, CDN caching of RSC, bfcache: [references/server.md](references/server.md).
- Store subscriptions, unstable props and deps, transitions, long lists, hydration, hidden UI, resource hints, JS hot paths: [references/render.md](references/render.md).

## React Compiler

React Compiler 1.0 is stable (October 2025) and memoizes components and hooks automatically. Next.js 16: install `babel-plugin-react-compiler` and set the top-level `reactCompiler: true` (no longer under `experimental`). When to memoize by hand: `lean-code`.

## Checklist

- [ ] Targets above are met
- [ ] Fonts, library code and widgets ship only what the site uses
- [ ] The LCP image is in the server HTML with `fetchPriority="high"`
- [ ] Every image has dimensions or reserved space; only the LCP image is high priority
- [ ] No unintended render-blocking CSS or JS
- [ ] No layout shift from content that arrives late, a web font swap, or a value set after hydration
- [ ] Third-party scripts are deferred and loaded only where used
- [ ] Animations touch compositor-friendly properties only
