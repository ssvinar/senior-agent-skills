---
name: lean-code
description: "Code structure for React 19 and Next.js 16 - size and complexity limits, state, hooks, composition, memoization, project layout. Use when writing or refactoring components, hooks and modules, or auditing complexity (duplication, dead code, cycles). Language rules: typescript-style."
---

# lean-code

## Limits

| What | Limit |
|---|---|
| File | 300 lines, no blanks or comments |
| Function, component | 50 lines |
| Cyclomatic complexity | 20 |
| Nesting depth | 4 |
| Parameters | 3, then one options object |
| Duplication | 3% (jscpd, whole codebase) |
| Dead code, import cycles | 0 |

New code stays within limits. Existing violations are frozen and only go down. Never grow an over-limit function; split it when safe.

## State

- Store only what changes over time, is not a prop, and cannot be computed. Compute the rest during render.
- State lives in the closest common parent of its readers.
- No effects for derived values or user actions: compute in render, act in the handler.
- State a user expects to survive reload, back, and a shared link (search, filters, sort, page, selected tab) lives in URL search params, and the server renders from them; no client store mirrors it.

## Hooks

- Same stateful or effect logic in 2+ components: one hook for one concrete task.
- No lifecycle wrappers (`useMount`, `useEffectOnce`, `useUpdateEffect`).
- `use` prefix only if it calls a hook. Callbacks a hook runs from an effect go through `useEffectEvent`.

## Components

- Variants (separate components or one `variant` prop) instead of boolean flags.
- Parts sharing state form a compound component: the parent owns state, parts read context.
- `children` over render props unless data flows back.
- `ref` is a prop; no `forwardRef`.
- Never define a component inside another.
- Shared UI components take data and copy as props, limited to the fields they render: no data fetching and no database types inside. New screens are built from them, not from copies.

## Data

Independent requests run in parallel (`Promise.all`); chain only dependent ones.

## Memoization

- `reactCompiler` on: no new `useMemo`, `useCallback`, `memo` unless precise control is needed; keep existing ones unless tested.
- Off: memoize only a measured problem.

## Structure

- `app/` (or `src/app/`) holds routes and route files only; other code is grouped by feature outside it (e.g. `src/components`, `src/lib`).
- `(group)`: shared layout, no URL segment. `_folder`: outside routing.
- No re-export-only `index.ts` barrels.
- Export only what other files use.

## Avoid

Class components, `propTypes`/`defaultProps`, render props by default, memoization "just in case", micro-optimizations without a measurement.

## Measure

Audit and repo setup: [references/audit.md](references/audit.md). Related: `typescript-style`, `react-performance`, `/simplify`.
