---
description: Save the session state (goal, what worked and failed, files, decisions, next step) to a dated file in ~/.claude/session-data/ for /resume-session.
---

Write an honest handoff file for the next session. Use it at the end of work, before the context runs out, or after solving something worth keeping.

1. Gather: files changed (git diff or the conversation), what was tried and decided, errors and how they were resolved, current build and test state if relevant.
2. Run `mkdir -p ~/.claude/session-data`.
3. Create a new file `~/.claude/session-data/YYYY-MM-DD-<short-id>-session.tmp` with today's date. The short-id uses letters, digits, `-`, and `_`; prefer 8 or more lowercase letters, digits, and hyphens so files from the same day do not collide. Never append to an older session's file.
4. Fill every section of the template. Write "None" rather than skipping a section. When saving mid-session, mark unfinished items as in progress.
5. Show the whole file with its resolved path, ask whether anything should be corrected or added, and edit until the user confirms.

```markdown
# Session: YYYY-MM-DD

**Started:** ~time | **Last updated:** time | **Project:** name or path | **Topic:** one line

## Goal
What is being built or fixed, why, and how it fits the system; enough for a reader with no memory of this session.

## Worked
- <item>: confirmed by <test, browser check, HTTP response, ...>
(Anything without evidence goes under "Not tried yet".)

## Did not work
- <approach>: failed because <exact error or reason>
(The most important section: it stops the next session from repeating dead ends.)

## Not tried yet
- <concrete idea, specific enough to act on>

## Files
| File | Status | Notes |
|---|---|---|
| `path/to/file` | done / in progress / broken / not started | what is done, what is left |

## Decisions
- <decision>: <reason, so it is not reopened>

## Blockers and open questions
- <item>

## Next step
<The single next action, precise enough to start without thinking. If unknown: "Review 'Not tried yet' and 'Blockers' before choosing a direction.">

## Environment
<Only if non-standard: commands, env vars, services that must run. Otherwise omit.>
```
