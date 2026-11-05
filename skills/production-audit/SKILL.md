---
name: production-audit
description: "Production readiness of a shipped or about-to-ship app from local evidence - auth, data integrity, payments and webhooks, operations, failure states - scored with a ship or block call. Use for \"is this ready to ship\", \"what breaks in prod\", pre-launch and post-merge risk checks."
---

# production-audit

Engineering triage of launch risk, not a compliance, legal or regulatory audit.

## Not for

- line-level review while coding: `/code-review`, `/security-review`, agent `python-reviewer`;
- libraries, templates or docs-only repos, unless packaging readiness is the question;
- an idea with no repo, deployment or CI to inspect.

## Evidence

- Local and user-approved evidence only. No unpinned remote code (`npx <pkg>@latest`), no external scanners, no uploading source, secrets, customer data or topology unless the user approves that tool and data flow.
- Build, typecheck, lint, tests and diff review come from `verification-loop`: run it first or read its latest report. Its results are inputs here, not findings to redo.
- Deployed URL: browser or HTTP checks against that URL only; no credentialed actions without a test account. Browser checks: `browser-qa`.

## Steps

1. Release surface: branch, `git log --oneline --decorate -20`, what ships.
2. Inspect what exists: package and release scripts, CI workflows, Docker and deploy manifests, API routes, webhooks, auth in `proxy.ts` (Next.js 16; formerly `middleware.ts`), workers and cron, migrations, env docs, error reporting, logs, health checks, rollback notes, E2E coverage of launch-critical paths.
3. Apply the lenses.
4. Score and recommend.

## Lenses

**Security and auth** (rules: `security`)
- Public, API and admin routes separated; authentication and authorization enforced on the server.
- No secrets in client bundles, logs, sample output or committed files.
- Rate limits, CSRF, CORS and upload validation where the app needs them.
- AI or agent features: untrusted content cannot reach privileged tools (prompt injection, tool abuse).

**Data integrity**
- Migrations run forward cleanly and have a rollback or recovery plan; destructive migrations, backfills and imports are staged.
- Database policies, grants and service roles match the tenancy model.
- Retried writes, jobs and webhook handlers are idempotent.

**Payments and webhooks**
- Signature verified before any payload field is trusted.
- Every payment, subscription and fulfillment handler is idempotent and survives replays, duplicates and out-of-order delivery.
- Test and live credentials separated.

**Operations**
- Starts from a clean checkout with the documented commands.
- Required env vars documented, validated at startup, fail fast.
- A health check proves dependencies are reachable.
- Deploy, rollback and incident owner documented.
- Logs are useful and contain no secrets or personal data.

**User experience**
- Launch-critical paths work on desktop and mobile.
- Mobile forms: no input zoom, no overlap, submit never stuck.
- Loading, empty, error and permission-denied states say what happened.
- A support or recovery path exists when a critical action fails.

## Score

| Band | Score | Meaning |
|---|---|---|
| Blocked | 0-49 | Do not ship until the top risks are fixed |
| Risky | 50-69 | Small rollout or internal beta only |
| Launchable with caveats | 70-84 | Ship if owners accept the listed risks |
| Strong | 85-100 | No launch blockers in the available evidence |

- Cap at 69 if any: sensitive data without authentication or authorization; non-idempotent payment or fulfillment webhooks; migrations that cannot run safely; exposed secrets; no rollback for a high-impact release.
- Cap at 84 if CI is red or the launch-critical path was not tested end to end.
- The score forces priorities; it is not a measurement.

## Report

First line: `Production audit: <score>/100, <band>: <the one or two risks that matter>.`

Then:
- **Blockers**: fix before deploy.
- **High-value fixes**: next improvements.
- **Evidence checked**: files, commands, CI runs, URLs, PRs.
- **Evidence missing**: what would change confidence.
- **Next action**: one concrete fix or check, offered directly.

Strengths get one line at most. Never score without the evidence list; green CI alone is not readiness.
