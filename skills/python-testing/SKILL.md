---
name: python-testing
description: "Python tests with pytest - layout, fixtures and conftest, parametrize, raises with match, tmp_path and monkeypatch, mocks with spec at the boundary, async tests, strict mode and warnings as errors, changed-lines coverage. Use when writing, fixing or setting up Python tests. Process and coverage threshold: tdd-workflow."
---

# python-testing

Process and coverage threshold: `tdd-workflow`. Config (strict mode, warnings as errors, coverage): `python-tooling`.

## Layout

- Code in `src/<package>/`, tests in `tests/` outside it. Files `test_*.py`.
- Shared fixtures in `conftest.py` in the narrowest folder that needs them.

## Writing tests

- Plain `assert`; pytest shows the compared values on failure.
- Cases that differ only in data: one test with `@pytest.mark.parametrize`, readable names through `pytest.param(..., id="...")`. No loops over cases inside a test.
- Exceptions: `pytest.raises(ValueError, match="...")`; the `match` proves it is the expected failure.
- Fixtures for setup; teardown after `yield`; the narrowest scope that works; `autouse` only for safety nets that every test needs.
- Files in `tmp_path`; environment variables and attributes through `monkeypatch`. Never the real home directory, network or clock.

## Doubles

- Own code: real objects or simple fakes. Mocks only at the boundary (HTTP, message APIs, time).
- Mocks with a spec (`create_autospec`, `spec=`), so a wrong call or attribute fails.
- HTTP with httpx: hand the client an `httpx.MockTransport`; RESPX or pytest-httpx for complex cases. Don't patch the client's methods.
- A hand-written fake replaces the lowest boundary (the transport, `urlopen`), not your own wrapper around it: a fake of the wrapper keeps its old signature and passes after the wrapper and the code behind it stop matching. At least one test per outside service runs the real path down to that boundary.
- Time: pass a clock into the code, or patch the function it calls with `monkeypatch`.
- Dates in a local zone: add days to the local date, then attach the time. Days added to a UTC instant land an hour off when the clocks change.

## Async

- pytest-asyncio; in a project that uses only asyncio set `asyncio_mode = "auto"` in `[tool.pytest]`, which makes `async def` tests and fixtures run without markers.
- Projects on AnyIO: its own plugin (`anyio_mode = "auto"`); it conflicts with pytest-asyncio's auto mode, so never both.

## Strictness

- Unknown markers and config keys are errors; an `xfail` that passes fails the run, so a fixed bug forces the marker out.
- Warnings are errors; a test that expects one uses `pytest.warns`.

## Commands

- `uv run pytest -q`; one test: `uv run pytest tests/test_x.py::test_name`; stop at the first failure: `-x`.
- Coverage: `uv run pytest --cov`. Changed lines against the `tdd-workflow` threshold: `uv run diff-cover coverage.xml --compare-branch=origin/main --fail-under=<threshold>` after `--cov-report=xml`.
