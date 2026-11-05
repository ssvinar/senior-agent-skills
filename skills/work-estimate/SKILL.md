---
name: work-estimate
description: "Estimate how long a change takes end to end when an agent does the coding - edit and local checks, CI, review wait, deploy, live verification - from the repo's own workflow history, then report progress against it. Use before starting agreed work, when asked \"how long\", or when the scope grows mid-task."
---

# work-estimate

An agent edits code in minutes; most of the elapsed time is waiting for CI, approvals, deploys and checks. Estimating in human-developer hours overshoots by 5-30x (measured). Estimate by steps instead.

## Steps

1. Count the scope: files and places to change, new tests, scripts to run. Large means hundreds of places (a lint sweep, a migration).
2. Measure the pipeline: `node scripts/step-durations.mjs [owner/repo]` prints median and p90 of the last successful runs of every workflow (CI, build check, deploy), queue and run time separately. Run it once per session; reuse the numbers.
3. Add the steps:

| Step | Source of the number |
|---|---|
| Edit and local checks (typecheck, lint, tests) | scope: small change 2-5 min, several files with tests 5-15 min, large sweeps hours |
| CI on the pull request | `step-durations` median for the PR workflow |
| Owner approval (merge, deploy) | not estimated; name it as a wait |
| Deploy | `step-durations` median for the deploy workflow; a workflow that only triggers a server script hides the build, time that script once |
| Live verification | browser check about 1 min per page type and viewport pair; measurement tools by their throughput, timed once |

4. Say it in one line before the first edit: "edit ~X min, CI ~Y, deploy ~Z, check ~W: about T after your OK".
5. During the work report percent done and time left at each step boundary. When the scope grows, say so at once with a new estimate and the options (finish, ship part).

## Rules

- Use p90, not the median, when a deadline depends on it.
- Count each deploy separately: an experiment with two variants means two deploys and two measurements.
- Waiting steps (CI, deploy, measurements) run in the background; do other approved work meanwhile and say so in the estimate.
