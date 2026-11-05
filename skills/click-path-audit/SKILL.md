---
name: click-path-audit
description: "Trace each button, toggle and form submit through every state change it triggers to find calls that cancel each other or leave the UI wrong or inconsistent. Use when a button \"does nothing\" though each function works alone, or after changing shared state stores."
---

# click-path-audit

Finds bugs where each function works alone but the sequence fails. Typical case: a "New" button calls `setComposeMode(true)` and then `selectThread(null)`, and `selectThread` also resets `composeMode` to false, so the button does nothing.

## 1. Map store side effects first

For every store action or context setter in scope, record what it sets and what else it resets:

```text
STORE emailStore
  setComposeMode(bool)   sets {composeMode}
  selectThread(t|null)   sets {selectedThread, messages}  RESETS {composeMode: false}
DANGEROUS RESETS: selectThread clears composeMode (owned by setComposeMode)
```

## 2. Trace each touchpoint

List the handler's calls in order with what each reads, writes, and resets. Then check:

- Does a later call undo an earlier one?
- Does the final state match what the label promises?
- Can async calls resolve in an order that breaks it?

| Pattern | Sign |
|---|---|
| Sequential undo | a later call's side effect resets what an earlier call set |
| Async race | the final state depends on which promise resolves first |
| Stale closure | repeated `setCount(count + 1)` reads one captured value, so it adds 1, not 2 |
| Missing transition | the label says Save, Delete, or Send, but the handler only validates, sets a flag, or calls a removed endpoint |
| Dead path | the condition guarding the real action is always false at that point |
| Effect interference | an effect watching the new state resets it immediately |

## 3. Report

```text
CLICK-PATH-NNN [CRITICAL|HIGH|MEDIUM|LOW]
Touchpoint: <label>, <file:line>
Pattern: <pattern>
Trace: 1. <call> sets {...}  2. <call> RESETS {...}  <- conflict
Expected: <what the label promises>
Actual: <what happens>
Fix: <specific change>
```

## Scope

- Whole app (launch, large refactor): one agent maps all stores first; then one agent per page or feature area works from that map.
- One page: after building it, or after a broken-button report.
- One store: after changing an action, audit every caller.

Not for API bugs, layout issues, or performance. Each bug found gets a test (`tdd-workflow`); confirm the fixes with `verification-loop`.
