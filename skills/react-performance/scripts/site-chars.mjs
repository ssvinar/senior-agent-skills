// Every character a site shows: all pages from its sitemap plus text files from the repo.
// node site-chars.mjs <sitemap-url> <out.json> [dir ...]
// dir: translation, content and source folders to scan (json, ts, tsx, js, md, mdx, html).
// Read-only: 2 parallel requests with a 200 ms pause. The output feeds subset-font.py.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const [sitemap, out, ...dirs] = process.argv.slice(2);
if (!sitemap || !out) {
  console.error("usage: node site-chars.mjs <sitemap-url> <out.json> [dir ...]");
  process.exit(1);
}
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0 Safari/537.36";
const chars = new Map(); // code point -> first place it was seen
const add = (text, src) => {
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (!chars.has(cp)) chars.set(cp, src);
  }
};
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»", mdash: "—", ndash: "–", hellip: "…", copy: "©", reg: "®", deg: "°", times: "×", euro: "€", pound: "£" };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
    .replace(/\\u([0-9a-f]{4})/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));

async function sitemapUrls() {
  const urls = new Set();
  const queue = [sitemap];
  while (queue.length) {
    const xml = await (await fetch(queue.shift(), { headers: { "user-agent": UA } })).text();
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
    if (/<sitemapindex/i.test(xml)) queue.push(...locs);
    else locs.forEach((l) => urls.add(l));
  }
  return [...urls];
}

const urls = await sitemapUrls();
const failed = [];
let next = 0;
let done = 0;
async function worker() {
  while (next < urls.length) {
    const u = urls[next++];
    try {
      const res = await fetch(u, { headers: { "user-agent": UA } });
      if (!res.ok) failed.push(`${res.status} ${u}`);
      add(decode(await res.text()), u);
    } catch (e) {
      failed.push(`ERR ${u} ${e.message}`);
    }
    if (++done % 50 === 0) console.log(`pages ${done}/${urls.length}`);
    await new Promise((r) => setTimeout(r, 200));
  }
}
await Promise.all([worker(), worker()]);

const EXT = /\.(json|tsx?|jsx?|mdx?|html)$/;
const SKIP = /(^|[\\/])(node_modules|\.next|\.git|coverage|dist|build)([\\/]|$)/;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (SKIP.test(p)) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (EXT.test(name) && st.size < 5_000_000) add(decode(readFileSync(p, "utf8")), p);
  }
}
for (const d of dirs) {
  try {
    walk(d);
  } catch (e) {
    console.warn(`skipped ${d}: ${e.code ?? e.message}`);
  }
}

writeFileSync(out, JSON.stringify({ pages: urls.length, failed, chars: [...chars] }));
console.log(`pages ${urls.length}, failed ${failed.length}, distinct characters ${chars.size}`);
failed.slice(0, 10).forEach((f) => console.log("  ", f));
