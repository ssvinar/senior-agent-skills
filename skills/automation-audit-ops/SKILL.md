---
name: automation-audit-ops
description: "Evidence-first inventory of automations - scheduled jobs, CI workflows, hooks, MCP servers, connectors, wrapper scripts: live, broken, redundant or missing, with keep, merge, cut or fix-next calls. Use when asked what runs or is broken, or before consolidating automation. Context cost: kit-review."
---

# automation-audit-ops

Inventory first, recommendations second, changes only when asked.

## Rules

- Stay read-only unless the user asked for fixes.
- A config entry or a skill that mentions a tool does not prove it works; read the live state.
- Back each important claim with a source: file path, workflow run, hook log, config entry, command output, or the exact error.
- If the state is unclear, say so; do not present the audit as complete.
- Do not merge or delete overlapping items before the evidence table exists.
- Name the broken high-value path before cleaning up low-value redundancy.
- Do not grow an inventory request into a rewrite.

## Steps

1. Inventory: hooks and hook scripts, GitHub Actions and scheduled workflows, MCP config and enabled servers, connectors and app integrations, wrapper scripts and repo entry points. Group them by surface: local runtime, CI, external systems, notifications, billing and customer operations, research and monitoring.
2. Label each item's state: configured, authenticated, recently verified, stale or broken, missing.
3. Label each problem: active breakage, auth outage, stale status, overlap, missing capability.
4. Give each overlapping or suspect item one call: keep, merge, cut, or fix next. Aim for one canonical path per job.

## Output

```text
CURRENT SURFACE   automation | source | state | proof
FINDINGS          breakage | overlap | stale | missing
RECOMMENDATION    keep | merge | cut | fix next
NEXT MOVE         the one skill, hook, workflow, or integration to strengthen
```

Prove the state after fixes with `verification-loop`; switch to `production-audit` when the question becomes launch readiness.
