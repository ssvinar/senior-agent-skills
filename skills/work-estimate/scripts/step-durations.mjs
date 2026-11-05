// How long each GitHub Actions workflow of a repo takes: median and p90 of the last
// successful runs, split into queue time and run time.
// node step-durations.mjs [owner/repo] [runs=30]
// Needs the GitHub CLI (gh) signed in with access to the repo; without owner/repo it uses
// the repo of the current folder.
import { execFileSync } from "node:child_process";

const [repoArg, runsArg] = process.argv.slice(2);
const runs = Number(runsArg || 30);
const repo = repoArg ? ["--repo", repoArg] : [];
const gh = (args) => JSON.parse(execFileSync("gh", [...args, ...repo], { encoding: "utf8" }));

const minutes = (a, b) => (new Date(b) - new Date(a)) / 60000;
const pct = (values, p) => {
  const s = [...values].sort((x, y) => x - y);
  return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN;
};
const fmt = (m) => (Number.isNaN(m) ? "-" : `${m.toFixed(1)} min`);

const workflows = gh(["workflow", "list", "--json", "id,name,state"]).filter((w) => w.state === "active");
console.log(`workflow | runs | run median | run p90 | queue median`);
for (const w of workflows) {
  let list;
  try {
    list = gh(["run", "list", "--workflow", String(w.id), "--status", "success", "--limit", String(runs), "--json", "createdAt,startedAt,updatedAt"]);
  } catch {
    continue; // dynamic workflows (Dependabot) are not listed by id on every gh version
  }
  if (!list.length) continue;
  const run = list.map((r) => minutes(r.startedAt, r.updatedAt));
  const queue = list.map((r) => minutes(r.createdAt, r.startedAt));
  console.log(`${w.name} | ${list.length} | ${fmt(pct(run, 0.5))} | ${fmt(pct(run, 0.9))} | ${fmt(pct(queue, 0.5))}`);
}
