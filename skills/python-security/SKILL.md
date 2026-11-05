---
name: python-security
description: "Secure-coding rules for Python - SQL parameters, subprocess without a shell, path traversal, archives and temp files, unsafe deserialization (pickle, YAML, XML), secrets and env vars, tokens and password hashing, HTTP timeouts, TLS and SSRF, input validation, dependency audit. Use while writing Python code that handles input, files, processes, the network or secrets. Diff review: built-in /security-review."
---

# python-security

Ruff's `S` rules (Bandit) catch many of these in CI: `python-tooling`. Validation shape: `python-style`.

## Injection

- SQL: values only through driver parameters (`cur.execute("... WHERE id = %s", (user_id,))`); never f-strings, `%` or `+` on the query. Table and column names through the driver's composition API (psycopg `sql.SQL(...).format(sql.Identifier(name))`).
- Processes: a library call first. Otherwise `subprocess.run([...], check=True, timeout=...)` with an argument list; no `shell=True` with any outside value. Allowlist the program and validate each argument; put `--` before user-supplied ones when the command supports it.
- No `eval`, `exec` or `compile` on outside data. Jinja2 renders HTML only with `autoescape=True` or `select_autoescape()`; its default is off.

## Files and archives

- A path built from outside input: resolve it and check it stays inside the base directory (`target.resolve().is_relative_to(base.resolve())`).
- Tar: `extractall(filter="data")` explicitly; it is the default only from Python 3.14. Inspect untrusted archives before extracting; no filter stops size bombs. Zip: check member sizes before extracting.
- Temporary files: `tempfile.mkstemp`, `NamedTemporaryFile`, `TemporaryDirectory`; never `mktemp`.
- Scripts that process downloaded files run with `python -I`, so the current directory is not on `sys.path`.

## Deserialization

- Never `pickle`, `shelve`, `marshal` or `jsonpickle` on data from outside; exchange JSON.
- YAML: `yaml.safe_load`; no custom constructors that build arbitrary objects.
- XML from outside: Expat 2.7.2 or newer (`pyexpat.EXPAT_VERSION`), otherwise entity-expansion attacks work; `xmlrpc` is open to decompression bombs.

## Secrets

- A secret manager where one exists; environment variables only otherwise (other processes, logs and dumps can see them). Never in code, the repo or Docker `ENV`/`ARG`; `.env` git-ignored.
- Never logged: tokens, passwords, session IDs, keys, connection strings; mask or hash them in log lines and exception messages.
- Tokens, nonces, reset codes: `secrets`, never `random`. Comparing secrets: `hmac.compare_digest`.
- Passwords: Argon2id, else scrypt; never a fast hash. MD5 or SHA-1 for non-security checksums only, with `usedforsecurity=False`.

## Network

- Every outbound call has an explicit timeout. requests has none by default and can hang; httpx defaults to 5 seconds, set it per client anyway.
- TLS verification stays on: `verify=False` accepts any certificate.
- Fetching a URL that came from outside (webhooks, previews, imports): allowlist hosts and schemes; otherwise block loopback, private, link-local and cloud metadata addresses after DNS resolution; follow no redirects.

## Input

- Validate at the boundary against what is allowed: syntax (type, length, format) and meaning (range, ownership for the operation). Reject invalid input with a clear error; don't strip characters and carry on.

## Dependencies

- `uv.lock` committed; CI installs with `uv sync --locked`; updates through Dependabot (`python-tooling`).
- Known vulnerabilities: Dependabot alerts on the repo. `uv audit` checks the lock file locally; it is a preview command.
