---
name: python-style
description: "Python language conventions and code limits - type hints, Any vs object, dataclasses and Protocols, Pydantic at the boundary, exceptions, logging, pathlib, asyncio (TaskGroup, timeouts, blocking calls), PEP 8 naming, complexity and size limits. Use when writing or reviewing .py code. Tools: python-tooling; security: python-security; tests: python-testing."
---

# Python Style

Tool configs: `python-tooling`. Security: `python-security`. Tests: `python-testing`. Error handling review: agent `silent-failure-hunter`.

## Limits

Ruff's defaults, enforced by the `python-tooling` config. Ruff counts statements, not lines.

| What | Limit | Rule |
|---|---|---|
| Cyclomatic complexity | 10 | C901 |
| Branches | 12 | PLR0912 |
| Return statements | 6 | PLR0911 |
| Statements in a function | 50 | PLR0915 |
| Arguments, positional arguments | 5, then group related ones in a dataclass | PLR0913, PLR0917 |
| Duplication across the codebase, exact copies | as in `lean-code` | jscpd |
| New exact copies in a pull request | 0 | jscpd against `.jscpd-baseline.json` |
| Dead code, import cycles | as in `lean-code` | vulture, import-linter |

New code stays within limits. Existing violations are frozen with `# noqa` and only go down; never grow an over-limit function.

A copy of existing code, even with new names, becomes a shared function or class instead. CI blocks exact copies; renamed copies and similar functions come as reports for review (`python-tooling`).

## Types

- Annotate every function signature (mypy strict); locals rely on inference.
- `X | None` over `Optional`, `None` last; built-in generics (`list[str]`) over `typing` aliases. Type aliases: the `type` statement (Python 3.12+).
- Arguments take abstract types (`Sequence`, `Mapping`, `Iterable`); returns are concrete (`list`, `dict`). No union return types: callers would need `isinstance()`.
- `object` for "any value"; `Any` only when the type system cannot express the type.
- Records: `@dataclass(frozen=True)`; change by `dataclasses.replace()`, never by mutating arguments. Interfaces: `Protocol`. Fixed sets of values: `Literal` or `Enum`, not bare strings.
- `# type: ignore[<code>]` with a code, never bare.

## External input

- Validate at the boundary (request bodies, webhooks, files, environment) with a Pydantic model or `TypeAdapter`; pass the typed object inward. Build a `TypeAdapter` once at module level, not per call.
- Where validation is mandatory: `python-security`.

## Exceptions

- Catch specific exceptions; no bare `except:`. `except Exception` only at an isolation point that logs and re-raises or reports.
- Keep the `try` body to the line that can fail.
- Translate with `raise NewError(...) from err`.
- No `assert` for runtime checks: `python -O` removes it.
- Either every `return` returns a value or none does.

## Resources

- `with` for files, locks, connections, sessions.
- `pathlib.Path` over `os.path`.
- Timezone-aware datetimes: `datetime.now(tz=UTC)`.

## Logging

- `logger = logging.getLogger(__name__)` in each module. `print` only for a command-line program's own output.
- Pass arguments, not f-strings: `logger.info("sent %s", message_id)`.
- `logger.exception(...)` inside `except` keeps the traceback.
- Libraries add no handlers except `NullHandler`; the application configures logging.

## asyncio

- No blocking calls in `async def`: run them with `await asyncio.to_thread(...)`.
- Concurrent work: `asyncio.TaskGroup`, which cancels the rest when one task fails; not `gather`.
- Keep a reference to every task created with `create_task`; the loop holds only weak references.
- Bound every wait: `async with asyncio.timeout(seconds)`.
- `CancelledError`: clean up in `finally`, re-raise if caught; never swallow it.
- Debug mode while developing and testing: `PYTHONASYNCIODEBUG=1`.

## Idioms

- Comprehensions: one `for`, at most one condition; otherwise a loop.
- `is None`, `isinstance()`, empty sequences are false, `startswith()`/`endswith()` over slicing.
- No mutable default arguments (`def f(items: list[str] | None = None)`), no mutable module-level state; constants `UPPER_CASE`.
- Naming per PEP 8: `snake_case` functions, variables and modules; `CapWords` classes; `_leading_underscore` for non-public.
- Public modules, classes and functions get a docstring: a command ending in a period ("Return the next slot."), not a restated signature.
- Executable modules: logic in `main()`, called under `if __name__ == "__main__":`.
- No nested functions except closures; no `from module import *`.
