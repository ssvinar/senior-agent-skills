# Audit

## Read-only mode

Export the branch to a temp folder (`git archive origin/main | tar -x -C <tmp>`), run `npm ci --ignore-scripts` there, install the `tooling` tools in another temp folder.

## Checks

Code may sit in `src/`, a root `app/`, or both: `DIRS=$(ls -d src app 2>/dev/null)` (jscpd fails on a missing path).

1. Sizes: `find $DIRS \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.test.*" | xargs wc -l | sort -rn | head -30`
2. Limits: `npx eslint -c <tooling eslint.config.mjs> --no-config-lookup $DIRS -f json -o eslint.json`
3. Duplication: `npx jscpd $DIRS --format "typescript,tsx" --ignore "**/*.test.ts" --threshold 3`. jscpd measures the whole codebase; a gate on new code only needs SonarQube or SonarCloud.
4. Dead code: `npx knip`. Cycles: `npx knip --include cycles`. knip counts runtime imports only: `import type` is not a cycle.

An "unused export" used inside its own file: only the `export` keyword is extra.

## Repo setup

Tools, configs and CI: `tooling`.

## Report

| Metric | Before | After | Target |
|---|---|---|---|
| Files over 300 lines | | | no new |
| Functions over 50 lines | | | no new |
| Functions over complexity 20 | | | no new |
| Functions over 3 parameters | | | no new |
| Duplication, % (whole codebase) | | | max 3 |
| Dead code (symbols, files, deps) | | | 0 |
| Import cycles | | | 0 |

Then the 10 largest files and 10 most complex functions as `file:line`.
