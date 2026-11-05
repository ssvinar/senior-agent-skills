# Ship only what the site uses

The browser gets from every font, library, widget and dictionary only the part the site uses. Find what ships, compare it with what is used, cut the rest, measure before and after.

## Find what ships

[scripts/route-chunks.cjs](../scripts/route-chunks.cjs): initial JS of every App Router route, split by package and source folder (gzip share), plus lazy chunks. Build with `productionBrowserSourceMaps: true` for the analysis only.

Look for:

- a package far bigger than its job (an SDK for one function, a whole icon set for twenty icons);
- a package on every route that only one route uses;
- a widget library in the initial chunks of a page where nobody has opened the widget yet.

## Fonts

1. Collect the characters: [scripts/site-chars.mjs](../scripts/site-chars.mjs) reads every page from the sitemap plus translation, content and source folders.
2. Subset: [scripts/subset-font.py](../scripts/subset-font.py) keeps a base set (Latin, Latin-1, punctuation, currency signs) plus every site character the font has; add the scripts of languages already planned with `--base`. Layout features: only those browsers apply on their own (`ccmp`, `locl`, `liga`, `kern`, `mark`, `mkmk`) unless the site uses more; `tabular-nums` does nothing if the font has no `tnum`.
3. Keep only the weights the CSS uses. Drop a decorative second family when the main one can carry headings.
4. Verify: render the same text with the original and the subset on separate pages (two blocks on one page differ by sub-pixel positions) and compare screenshots pixel by pixel. The script reports site characters the subset lost; the list must be empty.
5. License: subsetting an OFL font with a Reserved Font Name makes a Modified Version, which must not use that name. Rename it (`--rename OLD=NEW`), keep copyright and license records, ship `OFL.txt` next to the files.

Measured: three weights 208 → 79 KB. Then `preload: false` for the three weights (20 pages, 3 PSI mobile runs each): pages with median LCP ≤ 2.5 s 13 → 16 of 20, worst CLS 0.003 → 0.044 from the font swap.

## Libraries

`import("pkg")` and `import * as X from "pkg"` bring the whole package. Re-export the functions you call from a small module and import that module, statically or with `import()`:

```ts
// lib/sentry-browser.ts
export { captureException, init, setUser } from "@sentry/browser";
```

- Pick the smallest official entry point: the browser SDK instead of a framework wrapper whose extras are unused.
- Icons: an explicit map of the icon names the data uses, with a fallback icon, instead of `import * as Icons`.

Measured on Turbopack: error-tracking SDK 562 → 80 KiB, phone-number parsing 176 → 115 KiB.

## Shared layout first

Whatever the root and shared layouts import ships on every page, including pages where the component is hidden. Check their client import graph before page-level code.

- Small UI effects (fade, slide, scale, open and close) use what the browser has: CSS transitions, `@starting-style` for the first appearance, `<dialog>`, `popover`, `<details>`. A library only when the effect needs it.
- Guard it with a test: walk the client import graph of the shared layouts and fail when a listed heavy package appears.

Measured: an animation library used only by a floating contact button in the root layout cost ~40 KB gzip on every page; with CSS transitions instead, pages with a stable LCP over the target went 8 → 1 (3 PSI mobile runs each).

## Widgets: a facade until the visitor uses it

Render a static stand-in that looks like the widget; load the widget on tap.

- Map: a static map image through `next/image` (cached by the optimizer) with an "Open map" button; the live map replaces it on tap.
- Video: the cover through `next/image` with a play button; the iframe with `autoplay=1` replaces only the tapped card. YouTube covers: `i.ytimg.com/vi/<id>/hqdefault.jpg`; for Shorts `oar2.jpg` is the vertical cover.
- Carousels mount every slide, so an iframe in each slide loads them all.

Measured: thirteen YouTube embeds about 10 MB and 4 s TBT on mobile, mobile score 51 → 91 after the facade; a WebGL map library about 500 KB.

## Image formats and sizes

- `images.formats` unset means WebP only: AVIF masters were re-encoded to WebP. With `["image/avif", "image/webp"]` the first-screen photos of ten pages at mobile width went 643 → 337 KB.
- Images with `width`/`height` and no `sizes` ship a 1x/2x `srcset`: a phone took a 1920 px copy for every card of a news list; with `sizes` the list page went LCP 6.5 → 2.9 s.

## Translations and data

`NextIntlClientProvider` sends every message to the client by default, into the HTML of every page. Send each page only the namespaces its Client Components read:

- Root layout: the namespaces of the layout's own Client Components (header, footer, widgets).
- Each page: its own provider with its own list. Keep all lists in one map `route → namespaces`; dotted paths pick a sub-namespace.
- A nested provider with `messages` replaces the parent's messages, it does not add to them (use-intl `IntlProvider`). The page list holds every namespace read under the page, shared ones such as `common` included.

```tsx
// i18n/route-messages.tsx
export function withRouteMessages<P extends { params: Promise<{ locale: string }> }>(
  Page: (props: P) => Promise<React.ReactNode>,
  route: keyof typeof ROUTE_MESSAGES,
) {
  return async function RouteMessagesPage(props: P) {
    const { locale } = await props.params;
    setRequestLocale(locale);
    const messages = pickMessages(await getMessages(), ROUTE_MESSAGES[route]);
    return (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Page {...props} />
      </NextIntlClientProvider>
    );
  };
}
// page.tsx: export default withRouteMessages(ComplexPage, "complex");
```

Guard it:

- A unit test walks the imports of every `page.tsx` and layout: from the first `"use client"` file down, it collects the `useTranslations("…")` arguments and checks each against the list. Write namespaces as string literals so the test sees them. Remove one namespace from a list and watch the test fail before trusting it.
- After deploy, open every route type in a browser and scroll to the end: no `MISSING_MESSAGE` in the console, no `namespace.key` shown as text.

Measured (20 pages, 3 PSI mobile runs each): HTML 61 → 49 KB, FCP median 1.35 → 1.20 s, LCP median 2.29 → 2.18 s, slowest 10% of runs 3.08 → 2.93 s. Pages with median LCP ≤ 2.5 s: 13 → 13 of 20. In PSI's simulated mobile load, JS downloaded before the LCP still delays it; lighter HTML does not change that.

Props: only the fields the client renders ([server.md](server.md)).

## Analytics

Start counters on the first human action (scroll, wheel, pointer, touch, key) with a fallback timer. Trade-off: visits without any action go uncounted; the site owner decides.
