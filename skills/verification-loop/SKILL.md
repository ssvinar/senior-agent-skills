---
name: verification-loop
description: "Pre-PR verification - build, typecheck, lint, tests, code-health audit, security pass, diff review - reported with the exact commands and output. Use after finishing a change, before a PR, or when a change must be proven to work."
---

# verification-loop

Run the phases in order. Prefer the repo's own scripts (`package.json`, Makefile, CI config) over ad-hoc commands. Read live state (files, git, command output), not memory. If asked only to check, do not edit.

## Phases

1. **Build**: `npm run build` (or the repo's package manager). On failure, stop and fix first; minimal-diff fixes: agent `build-error-resolver`.
2. **Types**: `npx tsc --noEmit`. Python: `uv run mypy`.
3. **Lint**: `npm run lint`. Python: `uv run ruff format --check .` and `uv run ruff check .`; the full Python gate is in `python-tooling`.
   - Next.js 16 removed `next lint`, and `next build` no longer lints. A `lint` script calling `next lint` fails; run ESLint directly.
   - ESLint 10 reads only flat config (`eslint.config.*`); `.eslintrc*` and `.eslintignore` are ignored. Set file patterns in the config's `files`.
4. **Tests**: full suite with coverage. Report total, passed, failed, skipped, and coverage of new code. Coverage threshold: see `tdd-workflow`.
5. **Code health**: run the audit from the `lean-code` skill.
6. **Security**: `/security-review` on the diff. Rules: `security`.
7. **Diff review**: `git status --short --branch`, `git diff --stat <base>...HEAD`. In every changed file look for:
   - unintended or unrelated changes (leave other local work alone);
   - missing error handling; for network, SSH or database calls use agent `silent-failure-hunter`;
   - unhandled edge cases;
   - leftover debug output (`console.log`).

   Deeper review: `/code-review`.

## While fixing

- Read the error, the file and git state before editing.
- Prove with the smallest command first (one test file, one package); widen to the full phase once it passes.
- Same failure twice: stop broad retries and narrow the scope.
- Fix only the failure; no repo-wide churn, no destructive git commands.
- Call it fixed only after the proving command was rerun and passed.

## Report

Quote each command and the lines of output that matter. Never report a phase that did not run.

```text
VERIFICATION <repo> <branch>
Build:     PASS|FAIL  `<command>`
Types:     PASS|FAIL  <n errors>
Lint:      PASS|FAIL  <n errors, n warnings>
Tests:     PASS|FAIL  <passed>/<total>, new-code coverage <x%>
Audit:     PASS|FAIL  <findings>
Security:  PASS|FAIL  <findings>
Diff:      <n files>, <notes>
State:     inspected | changed locally | verified locally | committed | pushed | blocked
Overall:   READY | NOT READY for PR
Fix list:  1. ...
```

`pushed` only when the remote branch actually moved; name the branch and quote the push result.

## Cadence

Rerun the relevant phase after each finished function or component and before switching tasks. Edit-time hooks catch single-file problems; this loop covers the whole change.
