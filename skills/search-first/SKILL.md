---
name: search-first
description: "Research before coding - find existing code, packages, MCP servers, skills and maintained implementations before writing a new utility, integration or abstraction. Use when starting a feature, adding a dependency, or about to write custom code for a common problem."
---

# search-first

Before writing custom code, check whether it already exists.

## Steps

1. Preflight: check which search channels work. If one is unavailable, say so in the result; never report "nothing found" for a channel that was not searched.

   | Channel | Check |
   |---|---|
   | Repo | `rg --files`, targeted `rg` |
   | Package registry | `npm --version`, `python -m pip --version`, or the project's package manager |
   | GitHub | `gh auth status` |
   | MCP and docs tools | available tool list, MCP config |
   | Skills | `~/.agents/skills/`, project `.agents/skills/`, the agent's own skills folder |

2. Define the need: functionality, language, framework, constraints.
3. Search in this order: the repo, npm/PyPI, MCP servers, skills, GitHub and the web for maintained open source.
4. Score candidates on fit, maintenance, community, docs, license, and dependency weight.
5. Decide:

   | Finding | Action |
   |---|---|
   | Exact match, maintained, permissive license | Adopt as is |
   | Partial match on a solid base | Extend with a thin wrapper |
   | Several weak matches | Compose 2-3 small packages |
   | Nothing suitable | Build, informed by what the search found |

6. Implement: install the package, configure the MCP server, or write the minimal custom code.

## Size of the search

- Small utility: run steps 3-5 inline.
- Non-trivial feature: delegate steps 3-4 to a general-purpose subagent with the need, language, and constraints; ask for a structured comparison and a recommendation.
- Before planning (plan mode or the `Plan` agent), run the research first so the plan builds on existing tools, stack choices, integration patterns, and reference architectures.

## Where to look first

- Lint, format, test, pre-commit: eslint, ruff, textlint, markdownlint; prettier, black, gofmt; jest, pytest, go test; husky, lint-staged, pre-commit
- Document processing: unstructured, pdfplumber, mammoth
- HTTP clients: httpx (Python), ky or undici (Node)
- Validation: zod (TS), pydantic (Python)
- Markdown: remark, unified, markdown-it
- Images: sharp, imagemin
- Databases, prompt management, SDK docs: check MCP servers first

## Avoid

- Wrapping a library so heavily that its benefits disappear.
- Installing a large package for one small feature.
