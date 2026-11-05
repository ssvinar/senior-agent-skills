# senior-agent-skills

26 skills that make any coding agent work like a senior developer on TypeScript, React, Next.js and Python projects. Each rule has one owner and, wherever possible, a source you can check.

The skills follow the open [Agent Skills](https://agentskills.io) format, so they fit Claude Code, Cursor, GitHub Copilot, Codex, Gemini CLI and other agents that support it. Tested on Claude Code; other agents should load them the same way, and reports are welcome in Issues.

## Why

Coding rules for AI agents pile up. The same rule ends up in three files with three different numbers, and nobody remembers where it came from. This kit keeps them in order:

- **One rule, one owner.** [OWNERS.md](OWNERS.md) says which skill owns each topic. Other files can point to it, but never repeat it.
- **Sources you can check.** [SOURCES.md](SOURCES.md) links 118 sources. Rules without an outside source yet are listed openly under "Not yet sourced", along with what was measured.
- **Enforced by a script.** `scripts/check.mjs` fails when a size limit, coverage threshold or Core Web Vitals target is restated outside its owner.

Used daily on production projects.

## Install

**Any agent that reads `.agents/skills/`** (Cursor, GitHub Copilot, Codex, Gemini CLI and others):

```sh
git clone https://github.com/ssvinar/senior-agent-skills
mkdir -p ~/.agents/skills
cp -r senior-agent-skills/skills/* ~/.agents/skills/
```

For one project only, copy them to `.agents/skills/` in that project instead.

**Claude Code**, as a plugin with updates, the agents and the commands:

```sh
claude plugin marketplace add ssvinar/senior-agent-skills
claude plugin install canon@canon --scope user
```

Skills load on their own when a task matches. In Claude Code you can also call them as `/canon:<skill>`.

## What's inside

| Area | Skills |
|---|---|
| Code structure and style | `lean-code`, `typescript-style`, `python-style` |
| Tooling and CI | `tooling`, `python-tooling` |
| Tests and verification | `tdd-workflow`, `react-testing`, `python-testing`, `verification-loop`, `browser-qa`, `click-path-audit` |
| Security | `security`, `python-security` |
| Performance, SEO, accessibility | `react-performance`, `seo`, `accessibility`, `landing-standard` |
| Design | `make-interfaces-feel-better` |
| Audits | `production-audit`, `agent-architecture-audit`, `automation-audit-ops`, `kit-review` |
| Workflow | `search-first`, `codebase-onboarding`, `work-estimate`, `article-writing` |

Extras for Claude Code: agents `build-error-resolver`, `silent-failure-hunter`, `python-reviewer`; commands `save-session`, `resume-session`.

## Layout

```
skills/<name>/    SKILL.md (+ references/, configs/, scripts/)
agents/           Claude Code subagents
commands/         Claude Code slash commands
.claude-plugin/   Claude Code plugin.json, marketplace.json
scripts/check.mjs structural check (CI)
```

## Credit

MIT licensed, free to use. If this kit helps you, please credit the author: [Sergei Svinar](https://github.com/ssvinar).

## Need this set up for your team?

I set up AI coding workflows and standards for teams and projects. Email [s@svinar.com](mailto:s@svinar.com) or message [@s_svinar](https://t.me/s_svinar) on Telegram.
