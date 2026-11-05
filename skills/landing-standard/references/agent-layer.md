# Agent-readiness layer

Goal: the site appears in AI answers (ChatGPT, Perplexity, Google AI) and accepts leads from agents. Implement all parts; each is cheap.

## 1. Single source: `site-content.ts`

`lib/site-content.ts` exports `SITE_MARKDOWN`: an English, machine-readable summary (offer, prices, address, site sections, languages, contacts). `llms.txt` and markdown negotiation both read it, so they never drift. Update it by hand when facts change.

## 2. `/llms.txt`

Route handler `app/llms.txt/route.ts` returns `SITE_MARKDOWN` as `text/plain; charset=utf-8` with `Cache-Control: public, max-age=3600, s-maxage=86400`.
Format (llmstxt.org): `#` name, `>` summary, then paragraphs and lists with no headings; every `##` section is only a list of markdown links. Contacts as links too (`tel:`, `mailto:`), not bare text.

## 3. Markdown for Agents

An agent sends `Accept: text/markdown`; answer with markdown instead of HTML.
- In `proxy.ts` (`middleware.ts` on Next 15 and earlier), before i18n routing: if `accept` includes `text/markdown`, `NextResponse.rewrite` to `/agent-markdown<path>`. Browsers pay one string check.
- `app/agent-markdown/[[...path]]/route.ts`: `Content-Type: text/markdown`, `x-markdown-tokens` (≈ length / 4), `X-Robots-Tag: noindex`, `Vary: Accept`.
- Multi-page site: markdown only for pages with a text source (home = `SITE_MARKDOWN`, CMS articles = their rich text converted); limit the `proxy.ts` matcher to those paths. Other pages keep HTML: the summary in place of a page is the wrong content.
- No `_` prefix on the folder (`_folder` routing: `lean-code`).

## 4. `robots.txt` with Content-Signal

`MetadataRoute.Robots` cannot emit Content-Signal: serve raw text from `app/robots.txt/route.ts` (no `robots.ts`).
- `Content-Signal: search=yes, ai-input=yes, ai-train=no` in every User-Agent group. Robots rules control access; Content-Signal states use preferences.
- Explicit `Allow` groups for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot. A bot with its own group reads only that group: repeat every rule in it.
- `Allow: /api/mcp` and `Disallow: /api/` (form endpoints answer GET with 405; save crawl budget).
- `Sitemap: https://DOMAIN/sitemap.xml`. No `Host` or `Crawl-delay`.

## 5. MCP server (`/api/mcp`)

Stateless JSON-RPC 2.0 over Streamable HTTP, no SDK (plain JSON-RPC is lighter for a couple of tools), one JSON response per POST. Serve both protocol eras:
- Current (2026-07-28): the version comes in `params._meta["io.modelcontextprotocol/protocolVersion"]` of every request and in the `MCP-Protocol-Version` header. Headers `Mcp-Method` (and `Mcp-Name` on `tools/call`, maybe `=?base64?…?=`) must match the body, else `400` with error `-32020`. Unknown version: `400`, `-32022`, `data.supported` lists every version. `server/discover` is mandatory. Results carry `resultType: "complete"`.
- Older clients (2025-03-26 to 2025-11-25): `initialize` handshake, echo their version, never mint `Mcp-Session-Id`.
- Notifications: `202`, no body. Unknown method: `404`, `-32601`. GET and DELETE: `405`. A foreign `Origin` header: `403` (DNS rebinding).
- No `export const dynamic`: POST handlers are always dynamic, and the option is removed under `cacheComponents`.
- Tools = the site's lead forms. One shared server module does validation, rate limit and delivery for the form action, MCP and WebMCP. Keep it out of the `"use server"` file: every export there is a public endpoint. Put the tool's name, description and input schema in a module with no server imports, since the WebMCP client component imports it.
- Discovery card as a route handler, not a file in `public` (dotted folder names work as segments): `app/.well-known/mcp/server-card.json/route.ts` (draft SEP-1649, continued as SEP-2127) with `serverInfo`, `endpoint`, protocol versions and capabilities; tools come from `tools/list`. No `/.well-known/mcp.json`: SEP-1960 was closed as a duplicate of SEP-1649.

## 6. WebMCP (`document.modelContext`)

A client component mounted in the root layout registers the conversion forms as browser-native agent tools (W3C Community Group draft). The 2026-10-20 draft moved the API to `document.modelContext`: `registerTool(tool, { signal })` returns a promise, and aborting the signal unregisters the tool. Early Chrome builds expose `navigator.modelContext` with an `unregister()` handle: support both, abort on unmount, swallow the promise rejection (`NotAllowedError` when the `tools` permission is missing). `execute` may return any JSON-serializable value; `{ content: [{ type: "text", text }], isError }` reads the same in both shapes. Tools call the same server action or `/api` endpoint as the forms. No API → silent no-op; never ship the polyfill (310 KB for every visitor).

## 7. Cloudflare Agent Readiness extras

Scan the site at https://radar.cloudflare.com/scan (Agent Readiness score) and add what is missing:
- `Link: <https://DOMAIN/index.md>; rel="alternate"; type="text/markdown"` on HTML responses with a markdown version (counts for Discoverability). Set it in `next.config` `headers()`; it is sent next to Next's own font-preload `Link`, which stays intact.
- `.md` URLs: rewrite `/index.md` and `<path>.md` to the agent-markdown route (`next.config` `rewrites()`); some agents try these instead of the Accept header.
- `/.well-known/agent-skills/index.json` (discovery schema 0.2.0): each entry `name`, `type: "skill-md"`, `description`, `url` of its `SKILL.md`, `digest: "sha256:<hex>"`. Build the index and the `SKILL.md` from one string so the digest always matches.
- Web Bot Auth: nothing to publish, but make sure nginx or edge bot protection does not block signed agents (Google-Agent and others).

## Check

```bash
curl -s https://SITE/llms.txt | head -5
curl -s -H "Accept: text/markdown" https://SITE/ | head -5        # markdown, not HTML
curl -s https://SITE/robots.txt | grep Content-Signal
curl -s -X POST https://SITE/api/mcp -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2026-07-28' -H 'Mcp-Method: server/discover' \
  -d '{"jsonrpc":"2.0","id":1,"method":"server/discover","params":{"_meta":{"io.modelcontextprotocol/protocolVersion":"2026-07-28"}}}'
curl -s -X POST https://SITE/api/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"initialize","params":{"protocolVersion":"2025-06-18"}}'
curl -s https://SITE/.well-known/mcp/server-card.json
```
