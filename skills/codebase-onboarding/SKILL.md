---
name: codebase-onboarding
description: "Map an unfamiliar repository into an onboarding guide (stack, architecture, entry points, conventions, commands) and a starter or refreshed agent instructions file (AGENTS.md or CLAUDE.md). Use when joining a project, asked to explain a codebase, or to create or refresh that file."
---

# codebase-onboarding

## 1. Recon

Use Glob and Grep in parallel; read files only to settle ambiguous signals.

- Manifests: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `Gemfile`, `composer.json`, `mix.exs`, `pubspec.yaml`
- Framework markers: `next.config.*`, `nuxt.config.*`, `vite.config.*`, `angular.json`, Django settings, Flask app factory, FastAPI main, Rails config
- Entry points: `main.*`, `index.*`, `app.*`, `server.*`, `cmd/`, `src/main/`
- Tree: top two levels, skipping `node_modules`, `vendor`, `.git`, `dist`, `build`, `.next`, `__pycache__`
- Tooling: `eslint.config.*`, `.eslintrc*`, `.prettierrc*`, `tsconfig.json`, `Makefile`, `Dockerfile`, `docker-compose*`, `.github/workflows/`, `.env.example`
- Tests: `tests/`, `test/`, `__tests__/`, `*.test.*`, `*.spec.*`, `*_test.go`, Jest, Vitest, or pytest config

## 2. Architecture

- Stack: languages and versions, frameworks, key libraries, databases and ORMs, build tools, CI/CD.
- Shape: monolith, monorepo, microservices, or serverless; frontend/backend split; API style (REST, GraphQL, gRPC, tRPC).
- Purpose of each top-level directory.
- One request traced end to end: entry (router, handler), validation, business logic, data access.

## 3. Conventions

- Naming of files, components or classes, and tests.
- Error handling style, dependency injection vs direct imports, state management, async style.
- Git: branch names, commit style, merge strategy, from recent history. With no or shallow history, write "Git history unavailable or too shallow".

## 4. Output

Onboarding guide, readable in two minutes:
Overview (2-3 sentences); Tech stack (layer, technology, version); Architecture; Key entry points; Directory map; Request lifecycle; Conventions; Common tasks (dev, test, lint, migrate, build commands); Where to look (task to path).

Agent instructions file (`AGENTS.md`, or `CLAUDE.md` for Claude Code), under 100 lines:
Tech stack; Code style; Testing (command, file pattern, coverage command if configured); Build and run (dev, build, lint); Project structure; Conventions (commits, PRs, error handling).

If that file exists, read it first, keep its project-specific instructions, extend it, and mark what changed.

- "Onboard me": full guide in the chat, plus the instructions file in the repo root.
- "Create or update AGENTS.md or CLAUDE.md": steps 1-3, then that file only.

## Rules

- When config and code disagree, trust the code.
- State unknowns ("could not determine test runner") instead of guessing.
- List only dependencies that shape how code is written.
- Do not explain obvious directories or repeat the README.
