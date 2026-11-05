// What each Next.js App Router route ships to the browser: initial chunks per route and the
// packages or source folders inside them (gzip share), plus lazy chunks over 3 KB.
// node route-chunks.cjs <project-dir> <out.json> [route-filter]
// Needs a production build with `productionBrowserSourceMaps: true` (turn it on for the
// analysis only). Uses source-map-js from the project's node_modules.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const [projectDir, outFile, filter = ""] = process.argv.slice(2);
if (!projectDir || !outFile) {
  console.error("usage: node route-chunks.cjs <project-dir> <out.json> [route-filter]");
  process.exit(1);
}
const { SourceMapConsumer } = require(path.join(projectDir, "node_modules/source-map-js"));
const NEXT = path.join(projectDir, ".next");
const build = require(path.join(NEXT, "build-manifest.json"));
const APP = path.join(NEXT, "server/app");

function findRoutes(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) findRoutes(p, out);
    else if (name === "page_client-reference-manifest.js") out.push(path.relative(APP, dir).split(path.sep).join("/"));
  }
  return out;
}

function routeChunks(route) {
  const src = fs.readFileSync(path.join(APP, route, "page_client-reference-manifest.js"), "utf8");
  const g = {};
  new Function("globalThis", src)(g);
  const manifest = Object.values(g.__RSC_MANIFEST)[0];
  const files = new Set(build.rootMainFiles);
  for (const list of Object.values(manifest.entryJSFiles)) list.forEach((f) => files.add(f));
  return [...files];
}

// Package name for node_modules sources, first folders for project sources.
function group(source) {
  const s = source.replace(/\\/g, "/");
  if (s.includes("[turbopack]")) return "turbopack (runtime)";
  const nm = s.lastIndexOf("node_modules/");
  if (nm >= 0) {
    const rest = s.slice(nm + 13).split("/");
    const pkg = rest[0].startsWith("@") ? `${rest[0]}/${rest[1]}` : rest[0];
    if (pkg !== "next") return pkg;
    const sub = rest.slice(1).join("/");
    if (/compiled\/(react-dom|scheduler)/.test(sub)) return "react-dom";
    if (/compiled\/react\//.test(sub)) return "react";
    return "next (runtime)";
  }
  const i = s.indexOf("/src/");
  if (i >= 0) {
    const parts = s.slice(i + 1).split("/");
    return parts.slice(0, Math.min(parts.length - 1, 3)).join("/") || parts.join("/");
  }
  return s.replace(/^.*\[project\]\//, "").slice(0, 60) || "(no source)";
}

const cache = new Map();
function analyzeChunk(file) {
  if (cache.has(file)) return cache.get(file);
  const full = path.join(NEXT, file);
  const code = fs.readFileSync(full, "utf8");
  const gz = zlib.gzipSync(code, { level: 9 }).length;
  const groups = {};
  // Turbopack names the map differently from the chunk: take it from sourceMappingURL.
  const ref = code.match(/\/\/# sourceMappingURL=(\S+)\s*$/);
  const mapFile = ref ? path.join(path.dirname(full), ref[1]) : `${full}.map`;
  if (fs.existsSync(mapFile)) {
    const consumer = new SourceMapConsumer(JSON.parse(fs.readFileSync(mapFile, "utf8")));
    const lines = code.split("\n");
    const byLine = new Map();
    consumer.eachMapping((m) => {
      if (!byLine.has(m.generatedLine)) byLine.set(m.generatedLine, []);
      byLine.get(m.generatedLine).push(m);
    });
    let mapped = 0;
    for (const [ln, segs] of byLine) {
      segs.sort((a, b) => a.generatedColumn - b.generatedColumn);
      const len = (lines[ln - 1] || "").length;
      segs.forEach((sg, k) => {
        const bytes = Math.max(0, (k + 1 < segs.length ? segs[k + 1].generatedColumn : len) - sg.generatedColumn);
        const key = sg.source ? group(sg.source) : "(no source)";
        groups[key] = (groups[key] || 0) + bytes;
        mapped += bytes;
      });
    }
    groups["(unmapped)"] = Math.max(0, code.length - mapped);
  } else groups["(no source map)"] = code.length;
  const res = { file, raw: code.length, gz, groups };
  cache.set(file, res);
  return res;
}

const out = { routes: {}, lazy: [] };
const initial = new Set();
for (const route of findRoutes(APP).filter((r) => r.includes(filter)).sort()) {
  const files = routeChunks(route);
  files.forEach((f) => initial.add(f));
  let gz = 0;
  const groups = {};
  for (const f of files) {
    const c = analyzeChunk(f);
    gz += c.gz;
    for (const [g, b] of Object.entries(c.groups)) groups[g] = (groups[g] || 0) + (b / c.raw) * c.gz;
  }
  out.routes[route] = { chunks: files.length, gz, groups };
  const top = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 6);
  console.log(`${(gz / 1024).toFixed(0).padStart(5)} KB  ${route}\n        ${top.map(([g, b]) => `${g} ${(b / 1024).toFixed(1)}`).join(" | ")}`);
}
// Chunks outside every initial list load later through import().
for (const f of fs.readdirSync(path.join(NEXT, "static/chunks")).filter((n) => n.endsWith(".js"))) {
  const rel = `static/chunks/${f}`;
  if (initial.has(rel) || build.polyfillFiles.includes(rel)) continue;
  const c = analyzeChunk(rel);
  if (c.gz > 3000) out.lazy.push(c);
}
out.lazy.sort((a, b) => b.gz - a.gz);
fs.writeFileSync(outFile, JSON.stringify(out));
console.log(`lazy chunks over 3 KB: ${out.lazy.length}; details in ${outFile}`);
