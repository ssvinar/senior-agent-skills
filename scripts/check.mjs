// Structural check of the kit. Run: node scripts/check.mjs
// Private terms come from the PRIVATE_TERMS env var (comma-separated) or the
// git-ignored file .private-terms (one per line); they are never printed.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const errors = [];
const fail = (file, msg) => errors.push(`${relative(ROOT, file).split("\\").join("/")}: ${msg}`);

const RETIRED = [];
const CANONICAL = [
  { what: "coverage threshold", owner: "skills/tdd-workflow/", re: /\b\d{2,3}\s?%[^.\n|]{0,40}coverage|coverage[^.\n|]{0,40}\b\d{2,3}\s?%/i },
  { what: "file size limit", owner: "skills/lean-code/", re: /\bfiles?\b[^.\n|]{0,40}\b\d{3,4}\s*lines/i },
  { what: "function size limit", owner: "skills/lean-code/", re: /\bfunctions?\b[^.\n|]{0,40}\b\d{2,3}\s*lines/i },
  { what: "duplication threshold", owner: "skills/lean-code/", re: /duplicat\w*[^.\n|]{0,40}\b\d+(\.\d+)?\s?%/i },
  { what: "breakpoint set", owner: "skills/browser-qa/", re: /\b(320|375|768|1024|1440|1920)(px)?\s*[,/]\s*(320|375|768|1024|1440|1920)\b/ },
  { what: "Core Web Vitals thresholds", owner: "skills/react-performance/", re: /\b(LCP|INP|CLS)\s*(<|≤|<=|under|below)\s*\d/i },
  { what: "Python limits", owner: "skills/python-style/", re: /\b(max-complexity|max-args|max-positional-args|max-statements|max-branches|max-returns)\s*=\s*\d|\b(C901|PLR09\d\d)\b[^.\n]{0,40}\b\d{1,2}\b/ },
];
const EXEMPT = ["OWNERS.md", "SOURCES.md", "README.md", "scripts/"];
const LANG_EXEMPT = {};

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name === ".git" || name === "node_modules") return [];
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const fields = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      fields[key] = kv[2].replace(/^["']|["']$/g, "");
    } else if (key && /^\s+\S/.test(line)) {
      fields[key] = `${fields[key]} ${line.trim()}`.trim();
    }
  }
  return { fields, bodyLines: text.slice(m[0].length).split(/\r?\n/).length };
}

function checkSkill(dir) {
  const file = join(dir, "SKILL.md");
  if (!existsSync(file)) return fail(dir, "missing SKILL.md");
  const fm = frontmatter(readFileSync(file, "utf8"));
  if (!fm) return fail(file, "missing frontmatter");
  const { name = "", description = "", when_to_use: when = "" } = fm.fields;
  if (name !== basename(dir)) fail(file, `name "${name}" must equal folder name`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) fail(file, "invalid name");
  if (!description) fail(file, "missing description");
  if (description.length > 1024) fail(file, `description is ${description.length} chars (max 1024)`);
  if (description.length + when.length > 1536) fail(file, "description + when_to_use over 1536 chars");
  if (fm.bodyLines >= 500) fail(file, `body is ${fm.bodyLines} lines (keep under 500)`);
}

function checkAgentOrCommand(file, needsName) {
  const fm = frontmatter(readFileSync(file, "utf8"));
  if (!fm) return fail(file, "missing frontmatter");
  if (needsName && fm.fields.name !== basename(file, ".md")) fail(file, "name must equal file name");
  if (!fm.fields.description) fail(file, "missing description");
}

function privateTerms() {
  const raw = process.env.PRIVATE_TERMS ?? (existsSync(join(ROOT, ".private-terms")) ? readFileSync(join(ROOT, ".private-terms"), "utf8") : "");
  return raw.split(/[,\r\n]+/).map((t) => t.trim().toLowerCase()).filter(Boolean);
}

const GENERIC_PRIVATE = [
  { what: "metadata origin", re: /^\s*origin:/i },
  { what: "email address", re: /[\w.+-]+@[\w-]+\.[a-z]{2,}/i },
  { what: "local user path", re: /[A-Za-z]:\\Users\\|\/home\/[a-z]|\/Users\/[A-Za-z]/ },
  { what: "token", re: /gh[pousr]_[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9-]{10,}|xox[bpa]-[A-Za-z0-9-]{10,}/ },
];

function checkText(file, terms) {
  const rel = relative(ROOT, file).split("\\").join("/");
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    const at = `line ${i + 1}`;
    if (/[\u0400-\u04FF]/.test(line)) fail(file, `${at}: non-English (Cyrillic) text`);
    terms.forEach((t, n) => line.toLowerCase().includes(t) && fail(file, `${at}: private term #${n + 1}`));
    if (rel.startsWith("scripts/") || rel === "README.md") return;
    GENERIC_PRIVATE.forEach((g) => g.re.test(line) && fail(file, `${at}: ${g.what}`));
    if (EXEMPT.some((e) => rel.startsWith(e))) return;
    RETIRED.forEach((r) => new RegExp(`\\b${r}\\b`).test(line) && fail(file, `${at}: refers to retired "${r}"`));
    CANONICAL.forEach((c) => {
      const exempt = rel.startsWith(c.owner) || (LANG_EXEMPT[c.what] ?? []).includes(rel);
      if (!exempt && c.re.test(line)) fail(file, `${at}: restates ${c.what}; owner is ${c.owner}`);
    });
  });
}

function checkLinks(file) {
  const text = readFileSync(file, "utf8");
  for (const [, target] of text.matchAll(/\]\(([^)\s#]+)(#[^)]*)?\)/g)) {
    if (/^[a-z]+:/i.test(target)) continue;
    if (!existsSync(resolve(dirname(file), target))) fail(file, `broken link ${target}`);
  }
}

function checkOwners(items) {
  const owners = readFileSync(join(ROOT, "OWNERS.md"), "utf8");
  for (const item of items) {
    if (!owners.includes(`\`${item}\``)) fail(join(ROOT, "OWNERS.md"), `no owner row for "${item}"`);
  }
}

function checkManifests() {
  for (const f of ["plugin.json", "marketplace.json"]) {
    const p = join(ROOT, ".claude-plugin", f);
    if (!existsSync(p)) { fail(p, "missing"); continue; }
    try { JSON.parse(readFileSync(p, "utf8")); } catch (e) { fail(p, `invalid JSON: ${e.message}`); }
  }
}

const listDir = (d) => (existsSync(join(ROOT, d)) ? readdirSync(join(ROOT, d)) : []);
const skills = listDir("skills").filter((n) => statSync(join(ROOT, "skills", n)).isDirectory());
const agents = listDir("agents").filter((n) => n.endsWith(".md"));
const commands = listDir("commands").filter((n) => n.endsWith(".md"));

skills.forEach((n) => checkSkill(join(ROOT, "skills", n)));
agents.forEach((n) => checkAgentOrCommand(join(ROOT, "agents", n), true));
commands.forEach((n) => checkAgentOrCommand(join(ROOT, "commands", n), false));
checkOwners([...skills, ...agents.map((a) => basename(a, ".md")), ...commands.map((c) => basename(c, ".md"))]);
checkManifests();

const terms = privateTerms();
const textFiles = walk(ROOT).filter((f) => /\.(md|json|ya?ml|mjs|js|ts|txt)$/i.test(f) && !f.endsWith(".private-terms"));
textFiles.forEach((f) => checkText(f, terms));
textFiles.filter((f) => f.endsWith(".md")).forEach(checkLinks);

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: ${skills.length} skills, ${agents.length} agents, ${commands.length} commands, ${textFiles.length} files checked`);
