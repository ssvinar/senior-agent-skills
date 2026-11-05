// Read-only smoke check of live pages at 375 and 1440 px in the installed Chrome.
// node live-check.mjs <dir-with-playwright> <out-dir> <url> [url ...]
// <dir-with-playwright>: any folder whose node_modules has playwright or @playwright/test.
// Analytics and ad hosts are blocked so the check does not add visits to the site's stats.
// Per page and viewport: JS errors, own 4xx/5xx, CLS, the LCP element (an image must be
// eager with fetchpriority=high), third-party hosts contacted before any interaction, screenshot.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [dir, outDir, ...urls] = process.argv.slice(2);
if (!dir || !outDir || !urls.length) {
  console.error("usage: node live-check.mjs <dir-with-playwright> <out-dir> <url> [url ...]");
  process.exit(1);
}
const require = createRequire(path.join(path.resolve(dir), "package.json"));
let pw;
try {
  pw = require("playwright");
} catch {
  pw = require("@playwright/test");
}
const BLOCK = /(^|\.)(googletagmanager\.com|google-analytics\.com|analytics\.google\.com|doubleclick\.net|mc\.yandex\.[a-z]+|clarity\.ms|facebook\.(com|net)|connect\.facebook\.net|hotjar\.com|sentry\.io)$/;
const VIEWPORTS = {
  "375": { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  "1440": { viewport: { width: 1440, height: 900 } },
};
// Core Web Vitals "good" bound for layout shift; the targets are owned by react-performance.
const CLS_GOOD = 0.1;
mkdirSync(outDir, { recursive: true });

let ok = 0;
let bad = 0;
const check = (pass, msg) => {
  pass ? ok++ : bad++;
  console.log(`${pass ? "OK  " : "FAIL"} ${msg}`);
};

const browser = await pw.chromium.launch({ channel: "chrome", headless: true });
for (const url of urls) {
  const origin = new URL(url).origin;
  for (const [name, options] of Object.entries(VIEWPORTS)) {
    const ctx = await browser.newContext(options);
    await ctx.route("**/*", (route) => (BLOCK.test(new URL(route.request().url()).hostname) ? route.abort() : route.continue()));
    const page = await ctx.newPage();
    const errors = [];
    const failed = [];
    const thirdParty = new Set();
    page.on("pageerror", (e) => errors.push(e.message.slice(0, 120)));
    page.on("response", (r) => {
      if (r.url().startsWith(origin) && r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(origin.length, origin.length + 80)}`);
    });
    page.on("request", (r) => {
      const host = new URL(r.url()).hostname;
      if (!r.url().startsWith(origin) && !r.url().startsWith("data:") && !BLOCK.test(host)) thirdParty.add(host);
    });
    await page.addInitScript(() => {
      window.__cls = 0;
      window.__lcp = null;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        window.__lcp = last?.element ?? null;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto(url, { waitUntil: "networkidle" });
    console.log(`\n== ${url} @ ${name}`);
    const lcp = await page.evaluate(() => {
      const el = window.__lcp;
      if (!el) return null;
      return { tag: el.tagName, priority: el.getAttribute("fetchpriority"), loading: el.getAttribute("loading"), alt: (el.getAttribute("alt") || el.textContent || "").slice(0, 50) };
    });
    if (lcp?.tag === "IMG") check(lcp.priority === "high" && lcp.loading !== "lazy", `LCP image "${lcp.alt}": fetchpriority=${lcp.priority}, loading=${lcp.loading}`);
    else console.log(`     LCP element: ${lcp ? `${lcp.tag} "${lcp.alt}"` : "not reported"}`);
    const cls = await page.evaluate(() => window.__cls);
    check(cls < CLS_GOOD, `CLS ${cls.toFixed(3)}`);
    check(errors.length === 0, `JS errors: ${errors.join("; ") || 0}`);
    check(failed.length === 0, `own 4xx/5xx: ${failed.join("; ") || 0}`);
    console.log(`     third-party hosts before interaction: ${[...thirdParty].join(", ") || "none"}`);
    const file = `${new URL(url).pathname.replace(/[^a-z0-9]+/gi, "_") || "root"}-${name}.png`;
    await page.screenshot({ path: path.join(outDir, file) });
    await ctx.close();
  }
}
await browser.close();
console.log(`\npassed ${ok} of ${ok + bad}; screenshots in ${outDir}`);
process.exit(bad ? 1 : 0);
