# Evidence report template

```markdown
# <task>: TDD evidence

Source plan: <plan path, or "journeys written during this run">

## Journeys
- As a <role>, I want <action>, so that <benefit>

## Tasks
### <task or behavior>
- Done: <one sentence>
- Command: `<exact command>`
- RED: <output excerpt>
- GREEN: <output excerpt>
- Proves: <what the passing tests guarantee>

## Guarantees
| # | Guarantee | Test | Type | Result | Command |
|---|---|---|---|---|---|
| 1 | Empty query returns `[]` without throwing | `src/search.test.ts` "empty query" | unit | PASS | `npx vitest run src/search.test.ts` |

## Coverage and gaps
- Coverage of new code: <command and result>
- Intentional gaps, skipped tests, follow-ups: <list>

## Plan concerns
- <ambiguous or suspicious plan content, and the reading chosen>

## Merge evidence
<RED/GREEN/refactor summary; copy into the PR body or squash commit if checkpoints get squashed>
```
