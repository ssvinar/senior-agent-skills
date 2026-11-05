---
name: seo
description: "Search visibility - crawlability, indexing, titles and meta, structured data, hreflang, sitemap, robots, keywords, internal links. Use for SEO audits, fixes and plans."
---

# seo

## Workflow

1. Set the scope: whole site, one page, schema, performance, or content plan.
2. Read the real source files and deployed assets before advising.
3. Rank findings by severity and expected ranking impact.
4. State each fix as an exact change: file or URL, and what to change.

## Rules

- Technical blockers first, content second.
- One page, one primary search intent; one primary keyword or theme per URL.
- No manipulative tactics and no folklore: tie every recommendation to a specific page, asset, or piece of evidence.
- Assume mobile-first indexing.

## Technical checks

- `robots.txt` admits important pages, blocks low-value ones, and does not conflict with meta robots.
- No important page is `noindex` by accident.
- Important pages are a few clicks from the home page.
- Redirect chains: at most two hops.
- Canonicals are self-consistent, never loop, never point to broken targets.
- One preferred URL format; duplicate URLs are controlled by canonicals.
- Multilingual pages: reciprocal hreflang for every locale plus `x-default`; page tags and sitemap, if both used, match.
- The sitemap lists exactly the intended public pages. `lastmod` is the date of the last real content change, never the build time: Google stops trusting lastmod that changes every deploy. Google ignores `priority` and `changefreq`.
- IndexNow (Bing, Yandex, Naver, Seznam; not Google): where Bing or Yandex traffic matters, host the key file at the root and ping `https://api.indexnow.org/indexnow?url=...&key=...` from CI on content changes.
- Core Web Vitals affect ranking; targets and fixes belong to `react-performance`.

Structured data (JSON-LD), only for content actually on the page:

| Page | Type |
|---|---|
| Home | `Organization` or a business type |
| Article | `Article` / `BlogPosting` |
| Product | `Product` + `Offer` |
| Inner page | `BreadcrumbList` |
| Real Q&A content | `FAQPage` |

## On-page

Google truncates by pixel width (Arial), so measure pixels; character counts are Latin approximations, and non-Latin scripts run wider. Trim filler only; keep meaning and brand terms.
- Title: ≤ 600 px (about 50-60 characters), main topic near the start, written for people; pattern `Topic - Modifier | Brand`, hyphen not em dash.
- Meta description: ≤ 920 px (about 120-160 characters), honest, topic included naturally; action, topic, value, one supporting detail.
- Open Graph image: JPG, 1200x630; many link previews do not render AVIF or WebP.
- One `H1`; `H2`/`H3` follow the content hierarchy, not visual styling.

## Keywords and links

- Mapping: define intent, collect realistic variants, rank by intent fit, value, and competition, give each URL one primary keyword, check for cannibalization.
- Internal links: from strong pages to pages that should rank, with descriptive anchors; link each new page to related existing pages.
- Thin or near-duplicate pages: merge or differentiate.

## Severity

| Level | Findings |
|---|---|
| Critical | crawl or index blockers on key pages; robots vs meta-robots conflicts; canonical loops or broken targets; redirect chains over two hops; broken internal links on key paths |
| High | missing or duplicate titles or meta descriptions; broken heading hierarchy; missing or invalid JSON-LD on key page types; Core Web Vitals regressions on key pages |
| Medium | thin content; missing alt text; weak anchors; orphan pages; keyword cannibalization |

## Finding format

```text
[SEVERITY] Title
Location: path/to/file.tsx:42 or URL
Issue: what is wrong and why it matters
Fix: the exact change
```

Long-form SEO content: `article-writing`.
