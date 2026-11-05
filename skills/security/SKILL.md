---
name: security
description: "Secure-coding rules for TS/JS, React and Next.js - XSS and raw HTML, link URLs, CSP and headers, secrets and env vars, server-action auth and validation, sessions, CSRF, rate limits, untrusted JSON, third-party code. Use while writing such code. Diff review: built-in /security-review."
---

# Security

Diff review: `/security-review`. Schema style: `typescript-style` skill.

## Raw HTML

- JSX escapes text and attributes; `dangerouslySetInnerHTML`, `innerHTML` and string-built HTML do not. Stop and justify every use.
- Prefer plain text, then a markdown renderer that sanitizes. Raw HTML only through DOMPurify with a tag allowlist.
- Sanitize at the call site. Upstream sanitizing counts only if every consumer is checked. Note where trusted HTML comes from.
- SSR: never splice user input into the HTML shell around the React output.

## URLs and links

- Parse user URLs with `new URL()` and allow only `http:`, `https:`, `mailto:` in `href`, `src`, `xlink:href`. React 19 neutralizes `javascript:` but not `data:` or other schemes.
- Every `target="_blank"` gets `rel="noopener noreferrer"`.

## CSP and headers

- Set a production CSP server-side, fitted to the project's origins: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`, and `img-src`/`connect-src` limited to what the app uses.
- Pick `script-src` by rendering (Next.js):
  - Dynamic pages with strict requirements: per-request nonce created in `proxy.ts`, plus `'strict-dynamic'`. Every page then renders dynamically: no static generation, ISR, CDN cache or PPR.
  - Static pages: CSP in `next.config` `headers()` with `script-src 'self' 'unsafe-inline'`; record the trade-off.
  - Hash-based CSP (`experimental.sri`) keeps static generation but is experimental.
- No `'unsafe-eval'` in production.
- `style-src 'unsafe-inline'` only when required (CSS-in-JS, inlined CSS); record why.
- Headers: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` disabling unused features (camera, microphone, geolocation).

## Secrets and env vars

- No secrets in code. Read them from env and throw if a required one is missing.
- `NEXT_PUBLIC_*` (Next.js) and `VITE_*` (Vite) ship to the browser; never put a secret there. Remix / React Router: read `process.env` only in `loader`/`action`.
- On every env change ask: is this value safe in the public bundle?
- No public source maps in production; upload them to the error tracker instead.

## Server actions and auth

- Every `"use server"` function is a public POST endpoint. Inside it: check the session, check the user may change this exact record, validate all input with a schema (`safeParse`, return `z.flattenError(error)`), rate-limit sensitive or costly ones.
- Page and layout guards do not protect actions. Hiding UI in JSX is not access control; the server decides.
- Sessions live in httpOnly Secure cookies, never in `localStorage`.

## Forms

- Cookie-authenticated state changes need CSRF defense: `SameSite=Lax`/`Strict` cookies or tokens. Next.js Server Actions already check `Origin` against `Host`; other endpoints (Route Handlers) need double-submit cookies or an origin check.
- Rate-limit submit endpoints.
- Validate on client and server.
- Try honeypots or light anti-abuse before CAPTCHA.

## Untrusted objects

- Never spread or deep-merge raw request JSON into state or records. Parse it with a schema first so unknown keys and `__proto__` are dropped.

## Third-party code

- CDN scripts carry SRI; self-host critical ones where practical.
- Run `npm audit` before adding a dependency; review third-party scripts and libraries quarterly.
- Check whether a library renders its input as raw HTML (rich-text editors); distrust props that take HTML strings.
- Pin versions; read changelogs before major upgrades.
