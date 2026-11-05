---
name: python-tooling
description: "Code tooling for Python repos - uv (lock, dependency groups, release-age window), Ruff lint and format, mypy strict, pytest and coverage, vulture, import-linter, jscpd, Dependabot and the CI gate, with ready config files. Use when setting up, upgrading or checking a Python repo's lint, format, type-check, test and code-audit tools."
---

# python-tooling

Ready configs: [configs/](configs/). Merge [pyproject.toml](configs/pyproject.toml) into the repo's file; change only for a documented reason. Limits behind the Ruff rules belong to `python-style`.

## Tools

| Tool | Config | Command |
|---|---|---|
| uv: environment, `uv.lock`, `dev` dependency group | `[tool.uv]` | `uv sync --locked` |
| Ruff formatter, defaults | none | `uv run ruff format --check .` |
| Ruff linter, rule groups in the config | `[tool.ruff.lint]` | `uv run ruff check .` |
| mypy, strict | `[tool.mypy]` | `uv run mypy` |
| pytest, strict, warnings as errors | `[tool.pytest]` | `uv run pytest` |
| coverage.py via pytest-cov, branch coverage | `[tool.coverage.*]` | `uv run pytest --cov` |
| diff-cover: coverage of changed lines | CLI flags | see [ci-steps.yml](configs/ci-steps.yml) |
| vulture: dead code | `[tool.vulture]`, `vulture_whitelist.py` | `uv run vulture` |
| import-linter: import cycles | `[tool.importlinter]` | `uv run lint-imports` |
| jscpd: duplication across the codebase, exact copies | [.jscpd.json](configs/.jscpd.json) | `npx --yes jscpd@<version>` |
| jscpd: new exact copies in a pull request | same, `.jscpd-baseline.json` | see [ci-steps.yml](configs/ci-steps.yml) |
| jscpd: renamed copies, a report, never a gate | same | `npx --yes jscpd@<version> --ignore-identifiers --threshold 100 --baseline-from-ref origin/main` |
| jscpd: similar functions, a report, never a gate | same | `npx --yes jscpd@<version> --similarity --kind similar --threshold 100 --baseline-from-ref origin/main` |
| Dependabot | [dependabot.yml](configs/dependabot.yml) | |

CI order: [ci-steps.yml](configs/ci-steps.yml). Layout: code in `src/<package>/`, tests in `tests/`.

Stable releases only, exact versions in the `dev` group, each published at least two weeks ago. `exclude-newer = "14 days"` makes uv resolve only such releases; Dependabot's `cooldown` must equal it.

## Apply to a repo

1. `uv add --dev` the tools at the versions in the config; merge the tables; replace `<package>`.
2. `uv run ruff format .` as its own commit. Add its SHA to `.git-blame-ignore-revs`; merge that PR with a merge commit (squash drops the SHA). A repo that keeps a linear history merges with squash and skips the file.
3. Before any `--fix`: list RUF100 (unused `noqa`) and move each of those comments back onto the line its rule flags, then format again; repeat until RUF100 is empty. The formatter leaves the `noqa` of a call it splits on the closing line, and `--fix` would delete it as unused. A `# type: ignore` moves the same way; mypy reports it as `unused-ignore`.
4. `uv run ruff check --fix .` (safe fixes only), then `uv run ruff check --add-noqa .`: existing violations get `# noqa: <code>` and CI fails only on new ones. RUF100 reports a `noqa` that no longer applies, so the list only shrinks.
5. `npx --yes jscpd@<version> --baseline .jscpd-baseline.json --update-baseline`: today's copies, committed.
6. mypy: modules that do not pass strict yet get a `[[tool.mypy.overrides]]` entry with relaxed flags; the list only shrinks.
7. `uv run vulture --make-whitelist > vulture_whitelist.py`: today's findings, frozen like `noqa`. A name only a framework uses stays; the rest wait for review and leave together with their code. Existing import cycles go to the contract's `ignore_imports` the same way.
8. Add the CI steps and `.github/dependabot.yml`.

## Pitfalls

- `uv sync --locked`, not `--frozen`: `--frozen` skips the check that `uv.lock` matches `pyproject.toml`.
- A security fix newer than the window: exempt that one package with `exclude-newer-package = { <name> = false }` and remove the entry after the window.
- Leave Ruff `target-version` unset: Ruff reads `requires-python`.
- pytest `strict = true` also turns on strictness options added in later versions; safe only with pytest locked, which `uv.lock` does.
- `filterwarnings = ["error"]` fails on third-party deprecation warnings: allow each one by module, not globally.
- Packages without type information: per-module `ignore_missing_imports` in `[[tool.mypy.overrides]]`, never globally.
- mypy does not check a call through `**kwargs: Any`, `Callable[..., T]` or a value typed `Any`. After moving arguments into a parameter object (the usual fix for a frozen PLR0913), search for such forwarding before the first deploy: one unfreeze shipped a wrapper that still passed the old keywords, and its tests passed because they faked that wrapper.
- Strings in Cyrillic or another non-Latin script trip RUF001-RUF003 (confusable characters): ignore those three in such repos.
- Command-line modules that print for the user: per-file ignore of T201.
- Packaged projects (with `[build-system]`): drop `pythonpath`; uv installs the package. New projects: `--import-mode=importlib` in `addopts`.
- import-linter needs the root package importable: installed (packaged project) or on `sys.path` (`PYTHONPATH=src`, as in the CI steps).
- Adding `exclude-newer` re-resolves `uv.lock`: compare it before and after; a downgrade there is a downgrade on the server.
- diff-cover and the jscpd reports (`--baseline-from-ref`) need the base branch: checkout with `fetch-depth: 0`.
- Coverage of changed lines compares with `origin/main` as the PR's Ruff formats it (the CI step): against plain `origin/main` every line the formatter rewrote counts as new code (one rollout: 178 changed lines at 74%, of which 12 changed in substance, all covered). The same step absorbs a later Ruff style change.
- The same step drops trailing `# noqa` and `# type: ignore` on both sides before comparing: otherwise freezing a low-coverage repo fails its own rollout, and stripping only the PR side makes every frozen line look new in the next PR (one test PR with two comment-only changes and one code change: 42 lines at 38% instead of 1). Ruff leaves such comments out of the line length, so the formatting still matches.
- The same step sets `git config diff.renames copies` before diff-cover: `git diff` takes a rename only from a path that disappeared, so moving modules into a `src/` package and keeping a launcher under the old entry module's name made the whole moved module new code (one rollout: 850 changed lines, 588 with copy detection, where a changed file also counts as a copy source).
- Another repo's code kept as a copy and never edited here: `extend-exclude` in `[tool.ruff]`, outside the vulture and jscpd paths, and a mypy override with `ignore_errors = true` for its modules (its types still serve the repo). Its own repo checks it.
- The copies gate compares with the committed `.jscpd-baseline.json`, not with `origin/main`: after the formatting commit every copy the formatter touched has a new fingerprint (15 of 28 on the largest repo measured). A deliberate change to an existing copy refreshes the file in the same PR with `--update-baseline`; the diff shows it.
- `--fail-on-new-clones` takes an optional number and swallows the next argument: always write `--fail-on-new-clones 0`.
- Renamed copies (`--ignore-identifiers`) stay a report: replayed over 40 merged pull requests of a 37k-line repo, a renamed-copies gate would have failed 19, and 58 of its 122 hits were import blocks and field lists; the exact gate would have failed 8, with 16 of 17 hits real copies. The reports set `--threshold 100`, or old renamed copies trip the percentage.
- `--ignore-literals` stays off: it turns every query and message with the same shape into a copy.
- Preview Ruff rules stay off; the config selects stable rules only.
