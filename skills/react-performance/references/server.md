# Server-side, client data fetching, delivery

## Server-side

- Wrap per-request loaders in `React.cache()` so repeated calls within one render hit the source once.
- Cache data that does not vary per request (config, lookup tables) in an LRU cache, or on Next.js 16 with the `'use cache'` directive: enable `cacheComponents: true` together with `partialPrefetching: true`, set lifetime with `cacheLife`, invalidate with `cacheTag`. `'use cache'` replaces `unstable_cache`.
- In an existing app, `cacheComponents` is a migration, not a flag: segment `dynamic`, `revalidate` and `fetchCache` exports then fail, `dynamicParams` and `runtime` are unsupported, runtime data outside `<Suspense>` is flagged, and component state survives navigation. Follow the official migration guide (opt routes out with `instant = false`, convert one at a time) and verify with `next build`.
- Send Client Components only the fields they render: select columns, paginate, strip the rest.
- Do not serialize the same data into several Client Components; render one client wrapper and pass server content as `children`.
- Read static files (fonts, templates) once at module scope, not per request.
- Never keep mutable module-level state in RSC or SSR; it is shared by concurrent requests. Use request-scoped APIs.
- Run logging, analytics, and cache warming after the response with `after()` from `next/server`.

## Client data fetching

- Fetch shared data through SWR or TanStack Query so components using the same key share one request and cache entry.
- `localStorage` is synchronous: keep payloads small, store a schema `version` and migrate or discard old data, read once instead of on every render.

## Delivery

- Behind an edge that compresses (nginx, Cloudflare): `compress: false` in `next.config`, or Node gzips and the edge decompresses and recompresses. Node serving directly: keep `compress: true`.
- RSC behind a CDN: `RSC: 1` requests return `text/x-component`; Cloudflare ignores `Vary: rsc`, can cache it for the page URL and serve raw RSC to everyone, crawlers included. Add a `headers()` rule with `has: [{ type: "header", key: "RSC", value: "1" }]` setting `Cache-Control: private, no-store`, `CDN-Cache-Control: no-store`, `Cloudflare-CDN-Cache-Control: no-store`.
- bfcache: restores count as loads in CrUX and lower p75 LCP and CLS. Do not send the HTML document with `Cache-Control: no-store` (check the proxy and Next) and add no `unload`/`beforeunload` listeners (old analytics snippets add them). Immutable asset caching is not bfcache. Test in DevTools → Application → Back/forward cache.
