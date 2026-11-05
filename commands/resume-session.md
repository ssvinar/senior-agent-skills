---
description: Load a saved session from ~/.claude/session-data/ (latest, by date, or by path), brief its state, and wait for instructions.
---

Counterpart of `/save-session`.

- `/resume-session`: the latest file in `~/.claude/session-data/`
- `/resume-session YYYY-MM-DD`: the latest file for that date
- `/resume-session <path>`: that file, for example one a teammate forwarded

1. Find the file.
   - No argument: the most recently modified `*-session.tmp` in `~/.claude/session-data/`. If there is none, reply "No session files found in ~/.claude/session-data/. Run /save-session at the end of a session to create one." and stop.
   - Date: the most recently modified `YYYY-MM-DD-*-session.tmp`.
   - Path: read it directly.
   - Not found: say so and stop.
2. Read the whole file. Never modify it.
3. Reply with this briefing. Keep every section, even when empty; always show DO NOT RETRY, with "None" if nothing failed.

   ```text
   SESSION LOADED: <resolved path>
   PROJECT: <project and topic>
   GOAL: <2-3 sentences in your own words>
   STATE: working <n> items | in progress <files> | not started <files>
   DO NOT RETRY: <each failed approach and why>
   BLOCKERS: <open questions>
   NEXT STEP: <from the file, or "None defined; review 'Not tried yet' together first">
   Ready to continue. What would you like to do?
   ```

   Add a warning line when a referenced file is missing on disk, when the session is more than 7 days old ("things may have changed"), or when the file is empty or unreadable (suggest a new `/save-session`).
4. Wait. Do not start work or touch files. If the user says "continue" and a next step is defined, do exactly that step; otherwise ask where to start, optionally suggesting an item from "Not tried yet".
