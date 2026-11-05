---
name: agent-architecture-audit
description: "Layer-by-layer audit of LLM and agent applications - prompts, history, memory, tools, answer shaping, rendering, hidden repair loops, persistence - with severity-ranked, code-first fixes. Use before shipping an agent feature, or when it degrades after wrapper changes, skips tools, or works directly but fails in the app."
---

# agent-architecture-audit

Not for general code review (`/code-review`; Python: agent `python-reviewer`) or swallowed errors and missing timeouts (agent `silent-failure-hunter`).

## Layers that can corrupt an answer

| # | Layer | Typical failure |
|---|---|---|
| 1 | System prompt | conflicting or bloated instructions; the same fact also in memory and history |
| 2 | Session history | stale turns injected into new ones |
| 3 | Long-term memory | old topics leak across sessions; user corrections overwritten; the agent's own monologue admitted; unbounded growth |
| 4 | Distillation | compressed summaries come back as facts |
| 5 | Active recall | redundant re-summaries waste context |
| 6 | Tool selection | a required tool is skipped and the model still answers; tools overlap in responsibility |
| 7 | Tool execution | a call is claimed or faked but never ran |
| 8 | Tool interpretation | output misread or ignored |
| 9 | Answer shaping | final format broken |
| 10 | Rendering, transport | logs show a correct answer, the user sees a broken one (markdown, JSON, streaming fragments) |
| 11 | Hidden repair loops | a silent retry, repair or summarize pass rewrites the output |
| 12 | Persistence | expired state or cache reused as live evidence |

Wrapper regression: the model is right in a direct call and wrong inside the app, often since the last update.

## Steps

1. Scope: target system, entry points, models and providers, symptoms, when it started, which layers apply.
2. Evidence: agent loop, tool router, memory admission, prompt assembly, session logs and tool-call traces, prompt templates, tool schemas, provider config, memory stores.

   ```bash
   rg "must.*tool|required.*call" --type md                                   # tool rules only in prompt text
   rg "tool_call|toolCall|tool_use" --type py --type ts                       # execution without validation
   rg "completion|chat\.create|messages\.create|llm\.invoke"                  # LLM calls outside the main loop
   rg "memory.*admit|long.*term.*update|persist.*memory" --type py --type ts  # memory admission
   rg "fallback|retry.*llm|repair.*prompt|re-?prompt" --type py --type ts     # extra LLM passes
   rg "mutate|rewrite.*response|transform.*output|shap" --type py --type ts   # output mutation
   ```

3. Per finding: symptom, mechanism, layer, root cause, evidence (file:line or log row), confidence 0-1.
4. Fix in this order, code before prompt:
   1. Enforce required tools in code.
   2. Remove hidden repair agents or give them explicit contracts.
   3. Stop sending the same facts through prompt, history, memory, and distillation at once.
   4. Admit memory strictly: user corrections outrank agent statements.
   5. Distill only what should be compressed.
   6. Pass output through rendering untouched.
   7. Use typed JSON envelopes internally, not free prose.

## Severity

| Level | Meaning | Action |
|---|---|---|
| critical | can confidently take wrong operational action | fix before the next release |
| high | often degrades correctness or stability | fix this sprint |
| medium | usually correct, but fragile or wasteful | next cycle |
| low | cosmetic or maintainability | backlog |

## Report

Order: findings by severity; then which layer corrupted what, and why; then the ordered fix plan. No compliments or summary first; if the system is broken, say so.

- Rule out wrapper regressions before blaming the model.
- Show the contamination path before blaming memory.
- A clean current state does not erase a past incident.
- Do not trust markdown prose as an internal protocol.

Related: `automation-audit-ops` for hooks, MCP servers, and connectors; `verification-loop` to prove the state after fixes.
