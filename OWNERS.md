# Owners

One function, one owner. Every other file may name the owner ("see `lean-code`"), but never restates its rules or numbers. `scripts/check.mjs` flags restatements of canonical values outside their owner.

## Functions

| Function | Owner | Not covered here (goes to) |
|---|---|---|
| Code structure: size and complexity thresholds, React state and effects, custom hooks, component composition, memoization policy, parallel data loading, Next.js project structure, read-only code-health audit and its report | skill `lean-code` | TS language rules (`typescript-style`), runtime speed (`react-performance`), tools and their configs (`tooling`), cleanup of a diff (built-in `/simplify`) |
| Code tooling: ESLint, Prettier, knip, jscpd, React Compiler setup, their configs, versions and CI order | skill `tooling` | limits (`lean-code`), running checks before a PR (`verification-loop`) |
| TypeScript and JavaScript language conventions: types, `any`/`unknown`, immutability, input validation, naming, logging | skill `typescript-style` | CSS class names (`make-interfaces-feel-better`) |
| Security while writing code: XSS, CSP and headers, secrets, auth in server actions, forms, URLs | skill `security` | review of a diff (built-in `/security-review`) |
| Runtime performance: Core Web Vitals, bundle budgets, waterfall techniques beyond parallel requests, rendering, images, fonts, animation performance; shipping only the fonts, library code and widgets a site uses (subsetting, facades) | skill `react-performance` | memoization policy and parallel requests (`lean-code`) |
| Testing process (test first) and the coverage threshold | skill `tdd-workflow` | locators and assertions (`react-testing`) |
| React component tests: Testing Library, Vitest/Jest, MSW, axe, locators and assertions | skill `react-testing` | coverage numbers (`tdd-workflow`), browser checks (`browser-qa`) |
| Browser checks of a UI: visual, interaction, breakpoints | skill `browser-qa` | launch readiness (`production-audit`) |
| Verification before a PR: build, typecheck, lint, tests, code audit, diff review | skill `verification-loop` | |
| Production readiness of a shipped app | skill `production-audit` | browser checks (`browser-qa`) |
| UI design: direction, typography, palette, CSS tokens and class names, motion design, interaction states, polish | skill `make-interfaces-feel-better` | animation performance (`react-performance`), accessibility (`accessibility`) |
| Accessibility: WCAG 2.2 AA, semantic HTML, ARIA | skill `accessibility` | |
| SEO | skill `seo` | |
| Landing-page standard (orchestrates the owners above) | skill `landing-standard` | performance, SEO, accessibility details (their owners) |
| Agent readiness (llms.txt, Markdown for agents, MCP discovery, WebMCP, Content-Signal) and Consent Mode v2 | skill `landing-standard` | |
| Audit of this kit (overlaps, contradictions, source freshness) and context cost of the agent setup | skill `kit-review` | what exists and whether it works (`automation-audit-ops`) |
| Automation inventory: scheduled jobs, hooks, connectors, MCP servers; live, broken, redundant | skill `automation-audit-ops` | context cost (`kit-review`) |
| Research before writing code: reuse existing libraries and patterns | skill `search-first` | |
| Estimating agent work end to end (edit, CI, deploy, verification) from the repo's workflow history, progress reporting | skill `work-estimate` | planning the change itself (plan mode) |
| Onboarding to a repo and writing its agent instructions file (`AGENTS.md`, `CLAUDE.md`) | skill `codebase-onboarding` | |
| Tracing click paths through state changes | skill `click-path-audit` | |
| Audit of LLM and agent applications | skill `agent-architecture-audit` | |
| Long-form writing | skill `article-writing` | |
| Fixing build and type errors with minimal diffs | agent `build-error-resolver` | |
| Silent failures and error handling, any language | agent `silent-failure-hunter` | |
| Python language conventions and limits: types, exceptions, logging, asyncio, idioms, naming, complexity and size thresholds | skill `python-style` | tools (`python-tooling`), security (`python-security`), tests (`python-testing`) |
| Python tooling: uv, Ruff, mypy, pytest and coverage config, vulture, import-linter, jscpd for Python, Dependabot for uv, versions and CI order | skill `python-tooling` | limits (`python-style`), running checks before a PR (`verification-loop`) |
| Python tests: pytest layout, fixtures, parametrize, doubles, async tests | skill `python-testing` | coverage numbers and process (`tdd-workflow`) |
| Python security while writing code: injection, files and archives, deserialization, secrets, network, dependency audit | skill `python-security` | review of a diff (built-in `/security-review`) |
| Python code review | agent `python-reviewer` | the rules it applies (`python-style`, `python-security`, `python-testing`), error handling (`silent-failure-hunter`) |
| Saving and resuming a session | commands `save-session`, `resume-session` | |

## Built into Claude Code (the kit does not duplicate these)

| Function | Built-in |
|---|---|
| Code review | `/code-review` |
| Planning before changes | plan mode, `Plan` agent |
| Security review of a diff | `/security-review` |
| Cleanup of a diff | `/simplify` |

## Canonical values

| Value | Owner |
|---|---|
| File size | `lean-code` |
| Function size | `lean-code` |
| Cyclomatic complexity | `lean-code` |
| Nesting depth | `lean-code` |
| Parameters (TS/JS) | `lean-code` |
| Duplication (jscpd, whole codebase; TS and Python) | `lean-code` |
| Test coverage of new code | `tdd-workflow` |
| Breakpoints | `browser-qa` |
| Core Web Vitals | `react-performance` |
| Props declaration | `typescript-style` |
| Formatting (Prettier defaults, Tailwind class order) | `tooling` |
| Python limits (Ruff C901, PLR09; new exact copies in a pull request) | `python-style` |
| Python formatting (Ruff formatter defaults) | `python-tooling` |

