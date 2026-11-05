---
name: typescript-style
description: "TypeScript and JavaScript language conventions - types on public APIs, interface vs type, unions over enum, unknown over any, JSDoc, immutable updates, Zod-inferred types, naming, logging. Use when writing or reviewing .ts, .tsx, .js, .jsx or .mjs code. Structure and size: lean-code."
---

# TypeScript Style

Size limits, React state, hooks, composition, memoization, structure: `lean-code` skill. Error handling: `silent-failure-hunter` agent.

## Types

- Exported functions, shared utilities and public methods declare parameter and return types; locals rely on inference.
- Name an object shape once it repeats instead of retyping it inline.
- `interface` for object shapes that may be extended or implemented; `type` for unions, intersections, tuples, mapped and utility types.
- Component props: a named `interface`, callback props typed. No `React.FC` without a concrete reason.
- String literal unions instead of `enum`, unless interop requires an `enum`.
- No `any` in app code. External data and caught errors are `unknown`; narrow before use (`error instanceof Error ? error.message : fallback`). Use generics when the caller decides the type.
- Plain `.js`/`.jsx`: add JSDoc types where they help and a migration is not practical; keep them true to runtime.

## Immutability

- Never mutate arguments; return a copy (`{ ...user, name }`). Type inputs as `Readonly<T>` where useful.

## Input validation

- Describe external input with a Zod schema and derive its type with `z.infer`. Use top-level formats (`z.email()`), not the deprecated `z.string().email()`.
- Where validation is mandatory: `security` skill.

## Naming

- Components PascalCase; hooks start with `use`; animation timelines camelCase named for intent (`heroRevealTl`).

## Logging

- No `console.log` in production code; use a logging library.
