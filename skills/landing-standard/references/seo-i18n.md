# SEO, metadata, consent, i18n

Rules (titles and meta, canonicals, hreflang, sitemap, OG image format, structured data, IndexNow): `seo`. Below: landing and Next.js mechanics.

## Metadata (`generateMetadata` in `app/[locale]/layout.tsx`)

- Title and description for every locale, within `seo` limits.
- `metadataBase`; `alternates.canonical` per locale; `alternates.languages` with `x-default`.
- `icons`: favicon plus `apple` (otherwise iOS uses a blurry screenshot for Add to Home Screen). PWA icons 192/512 via `manifest.ts`.
- Open Graph per locale: `type: "website"`, url, siteName, title, description, locale, image. Twitter: `summary_large_image`.
- `robots`: index, follow; googleBot `max-image-preview: large`, `max-snippet: -1`.

## JSON-LD

Write schema for AI answers (AI Overviews, Gemini, GPT, Perplexity read the facts), not for rich snippets.
- One `@graph` on the locale page: `LocalBusiness` or the subtype that fits, `WebSite`, `Offer`/`AggregateOffer`, `PostalAddress`/`GeoCoordinates`; cross-link with `@id`; `inLanguage` per locale.
- `FAQPage`: Google dropped its rich results (May 2026) but still parses it; add it for AI understanding.
- Render inline `<script type="application/ld+json">` from a server component.
- Validate at https://search.google.com/test/rich-results.

## Consent Mode v2 + banner (mandatory)

GA4 without consent sets `_ga` and sends the IP: a breach of local privacy law (e.g. GDPR).
1. In the early inline stub, before `gtag('config')`: `gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })`.
2. Own lightweight banner on every locale (no 100 KB CMP); store the choice in localStorage.
3. On accept: `gtag('consent', 'update', { analytics_storage: 'granted', ... })`. gtag.js may load before consent; in denied mode it sends cookieless pings for modeling.
4. If Google Ads runs: since June 2026 `ad_storage` alone gates GA4 → Ads data.

## `app/sitemap.ts`

One entry per locale with a shared `alternates.languages` block including `x-default`; `lastModified` per `seo`.

## next-intl (`localePrefix: "as-needed"`)

- Anchors: never prefix the default locale in hash links. `/en#section` redirects to `/` and drops the hash ("menu does not work"). Use `""` as the base for the default locale.
- Layout: call `setRequestLocale(locale)` (otherwise the route turns dynamic and SSG breaks); `generateStaticParams` over locales; unknown locale → `notFound()`.

## CSP and headers (landing specifics)

General policy: `security`.
- Set the CSP in the app (it lists site-specific GA domains). Leave X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, COOP to the reverse proxy if it already sends them; never duplicate them (DENY vs SAMEORIGIN conflict).
- Landing CSP: the static-page option from `security`, plus GA domains in `script-src`, `style-src 'unsafe-inline'` (inlineCss), `img-src 'self' data: https:`, and every GA endpoint in `connect-src` (analytics.google.com, *.g.doubleclick.net, region1.*), or analytics fails silently.
- After deploy: `curl -sI https://SITE | grep -iE 'content-security|frame|referrer'` and https://securityheaders.com.
