---
name: kit-review
description: "Monthly review and audit of this kit - structure, overlaps, contradictions, freshness of SOURCES.md - and context cost of the agent setup. Use for the monthly review, before changing a skill, agent or command, or when asked how much context the setup uses."
---

# kit-review

Kit rules: one function, one owner (`OWNERS.md`); every rule has a source (`SOURCES.md`); nothing personal; English; as short as possible without losing meaning.

## Limits

| What | Limit |
|---|---|
| `SKILL.md` body | under 500 lines; detail in `references/` |
| `description` | 1024 characters |
| `description` + `when_to_use` | 1536 characters |
| `name` | lowercase, digits, hyphens; equals folder name |

## Monthly review

1. `node scripts/check.mjs` passes.
2. For each `SOURCES.md` row: compare the current state with `verified` (latest version and date, docs "last updated", deprecations). On a change, read it and update the affected skill. Set `verified` only for rows actually checked.
3. Every tool a skill tells users to run: released within 6 months, not deprecated or archived. Record weekly npm downloads for it and its main alternatives. Report; do not switch tools in the review PR.
4. Each function has one owner; canonical values only in their owner; no two descriptions trigger on the same request.
5. Context cost: lines always loaded, loaded by `paths`, on demand; total description length.
6. One PR "Monthly review YYYY-MM": changes plus a table `Source | Was | Now | Action`. No change without a source; "no change" goes in the table too.

## Changing the kit

- Extend the owner instead of adding a second home for a function.
- Update `OWNERS.md` and `SOURCES.md` in the same PR.
- A rule needs a source showing current practice: official docs, a maintained standard, or a widely used tool's default.
- No names of people or projects, hosts, local paths, emails, tokens, or links to repos text was taken from.

## Setup context cost (on request)

Measure context cost only: agent instruction files, rules (always vs `paths`), skill and agent descriptions (loaded every session), MCP tool definitions. Report the top 3 savings in lines or tokens; live numbers: `/context` in Claude Code. What exists and whether it works: `automation-audit-ops`.
