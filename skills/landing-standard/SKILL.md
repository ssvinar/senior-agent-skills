---
name: landing-standard
description: "Gold standard for a Next.js landing or business-card site - target PSI 95+, agent-readiness (llms.txt, Markdown for Agents, MCP, WebMCP, Content-Signal), Consent Mode v2; orchestrates react-performance, seo and accessibility. Use for gold-standard work or an end-to-end audit of such a site, agent-readiness, or Consent Mode v2."
---

# Landing standard

Scope: landing and business-card sites on Next.js 15+ (App Router). Other stacks: same principles, other mechanisms.

| Area | Owner |
|---|---|
| Core Web Vitals, images, fonts, bundle, compression, caching, bfcache | `react-performance` |
| Titles and meta, structured data, hreflang, sitemap, OG images, IndexNow | `seo` |
| WCAG 2.2 AA, skip link, form ARIA, reduced motion | `accessibility` |
| CSP and security headers | `security` |
| Browser checks, breakpoints | `browser-qa` |
| Build, typecheck, lint | `verification-loop` |
| Agent-readiness, Consent Mode v2, landing specifics | this skill |

## Workflow

Run the phases in order. Each phase: audit → fix → record in the report. Mark what already meets the standard "OK".

| Phase | Reference |
|---|---|
| 0. Recon and baseline | below |
| 1. Performance | [performance.md](references/performance.md) |
| 2. SEO, JSON-LD, consent, CSP | [seo-i18n.md](references/seo-i18n.md) |
| 3. Agent-readiness | [agent-layer.md](references/agent-layer.md) |
| 4. Hygiene and accessibility | [hygiene-a11y.md](references/hygiene-a11y.md) |
| 5. Verification (mandatory) | [verify.md](references/verify.md) |

Phase 0:
1. Read the next, react, tailwind and i18n versions from `package.json`; check that version's conventions before coding. Next 16: `middleware.ts` is `proxy.ts` (the `next-intl/middleware` import is unchanged); svgr rules go in `turbopack.rules`, not `webpack()`.
2. Find what sits in front of Node (nginx, Cloudflare); compression, caching and headers depend on it.
3. Take the PSI baseline, mobile and desktop: [performance.md](references/performance.md) §0.
4. Show the user a plan table: item → status (present / missing / partial) → priority.

## Red lines

- Never trade function for score: verify anchors, forms and menus live; the build does not catch their breakage.
- Never send real leads while testing forms.
- No heavy CMPs or polyfills: write a lightweight consent banner; WebMCP stays a no-op without browser support.
- Deploy after verify steps 1-2; steps 3-4 run after deploy.

## Report

- Table: metric, before, after (PSI per category, LCP, TBT, CLS).
- What was implemented, per phase.
- What was skipped on purpose, and why.
- Manual actions for the user (Search Console, Cloudflare, DNS) as a separate list.
