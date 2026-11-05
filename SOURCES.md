# Sources

Basis for every rule. The monthly review (`kit-review`) checks each row; `verified` changes only when a row was actually checked; `-` means not yet verified.

| Id | Source | Watch | Used by | Verified |
|---|---|---|---|---|
| react-thinking | https://react.dev/learn/thinking-in-react | content | lean-code (state) | 2026-10-21 |
| react-custom-hooks | https://react.dev/learn/reusing-logic-with-custom-hooks | content | lean-code (hooks) | 2026-10-21 |
| react-no-effect | https://react.dev/learn/you-might-not-need-an-effect | content | lean-code (state) | - |
| react-components | https://react.dev/learn/your-first-component | nested component definitions | lean-code (components) | - |
| react-context | https://react.dev/learn/passing-data-deeply-with-context | content | lean-code (compound components) | - |
| react-children | https://react.dev/learn/passing-props-to-a-component | `children` | lean-code (components) | - |
| react-ref-prop | https://react.dev/reference/react/forwardRef | React 19 `ref` as prop | lean-code (components) | - |
| react-compiler | https://react.dev/blog/2025/10/07/react-compiler-1 , npm `babel-plugin-react-compiler` | stable version, memoization guidance | lean-code, react-performance, tooling | 2026-10-21 |
| next-structure | https://nextjs.org/docs/app/getting-started/project-structure | version, last updated | lean-code (structure) | 2026-10-21 |
| next-fetching | https://nextjs.org/docs/app/getting-started/fetching-data | parallel fetching | lean-code (data) | - |
| next-barrels | https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports | barrel imports | lean-code (structure) | - |
| next-search-params | https://nextjs.org/learn/dashboard-app/adding-search-and-pagination | URL search params as state: bookmarkable, shareable, server-rendered | lean-code (state) | 2026-10-28 |
| next-eslint | https://nextjs.org/docs/app/api-reference/config/eslint | recommended config (core-web-vitals, typescript, Prettier), ESLint versions | tooling | 2026-10-21 |
| prettier-options | https://prettier.io/docs/options | defaults, printWidth guidance | tooling | 2026-10-21 |
| prettier-tailwind | https://github.com/tailwindlabs/prettier-plugin-tailwindcss | `tailwindStylesheet` for v4, plugin order, version | tooling | 2026-10-22 |
| knip-fix | https://knip.dev/features/auto-fix | `--fix` behavior | tooling | - |
| next-react-compiler | https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler | option status | lean-code, tooling | 2026-10-21 |
| eslint-rules | https://eslint.org/docs/latest/rules/max-lines (+ max-lines-per-function, complexity, max-depth, max-params) | defaults | lean-code (limits) | 2026-10-21 |
| eslint-versions | https://eslint.org/version-support | supported lines | lean-code | 2026-10-21 |
| eslint-suppressions | https://eslint.org/docs/latest/use/suppressions | flags | tooling | 2026-10-21 |
| sonar-way | https://docs.sonarsource.com/sonarqube-community-build/ (quality gates) | duplication, coverage conditions | lean-code, tdd-workflow | 2026-10-21 |
| biome-rules | https://biomejs.dev/linter/rules/ | size and complexity defaults | lean-code (limits) | 2026-10-21 |
| knip | https://knip.dev , npm `knip` | releases, `cycles` | lean-code (audit), tooling | 2026-10-21 |
| jscpd | npm `jscpd` , https://github.com/kucherenko/jscpd | releases, Python format, `--ignore-identifiers`, `--similarity`, `--baseline-from-ref`, `--fail-on-new-clones`, ignore markers | lean-code (audit), tooling, python-tooling, python-style | 2026-10-23 |
| web-vitals | https://web.dev/articles/vitals | thresholds | react-performance | - |
| next-image | https://nextjs.org/docs/app/api-reference/components/image | `preload`, `fetchPriority`, `loading`, `sizes` (1x/2x without it), `formats` (WebP by default, AVIF trade-offs) | react-performance (LCP image, optimizer) | 2026-10-23 |
| next-lazy-loading | https://nextjs.org/docs/app/guides/lazy-loading | `next/dynamic` = `React.lazy` + Suspense, `loading`, `ssr` | react-performance (LCP image) | 2026-10-23 |
| web-optimize-lcp | https://web.dev/articles/optimize-lcp | LCP resource discoverable from HTML, `fetchpriority` | react-performance (LCP image) | 2026-10-23 |
| lighthouse-facades | https://developer.chrome.com/docs/lighthouse/performance/third-party-facades | facades for embeds | react-performance (widgets) | 2026-10-23 |
| web-font-size | https://web.dev/articles/reduce-webfont-size | subsetting, pyftsubset | react-performance (fonts) | 2026-10-23 |
| fonttools-subset | https://fonttools.readthedocs.io/en/latest/subset/ | options | react-performance (scripts) | - |
| ofl-faq | https://openfontlicense.org/ofl-faq/ | 2.6-2.7: subsetting is modification, Reserved Font Name | react-performance (fonts) | 2026-10-23 |
| next-intl-client | https://next-intl.dev/docs/environments/server-client-components | messages sent to the client, `pick` | react-performance (translations) | 2026-10-23 |
| use-intl-provider | https://github.com/amannn/next-intl/blob/main/packages/use-intl/src/react/IntlProvider.tsx | nested provider: `messages` replace the parent's | react-performance (translations) | 2026-10-23 |
| css-starting-style | https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style | first-appearance transitions, browser support | react-performance (shared layout) | - |
| lucide-react | https://lucide.dev/guide/packages/lucide-react | tree-shaking of named imports | react-performance (icons) | 2026-10-23 |
| css-layer | https://developer.mozilla.org/en-US/docs/Web/CSS/@layer | unlayered styles override layers | react-performance (carousels) | 2026-10-23 |
| swiper-api | https://swiperjs.com/swiper-api | `slidesPerView: "auto"` | react-performance (carousels) | - |
| webpack-exports | https://webpack.js.org/api/module-methods/#magic-comments | `webpackExports`: `import()` bundles the whole module otherwise | react-performance (libraries) | - |
| web-optimize-cls | https://web.dev/articles/optimize-cls | web fonts shift layout with either fallback strategy, `size-adjust`, `font-display: optional`; shifts within 500 ms of input excluded | react-performance (CLS, fonts), browser-qa | 2026-10-26 |
| next-font | https://nextjs.org/docs/app/api-reference/components/font | `adjustFontFallback`, `preload`, `display` | react-performance (fonts) | 2026-10-26 |
| next-script | https://nextjs.org/docs/app/api-reference/components/script | `beforeInteractive`: root layout only, does not block hydration | react-performance (render reference) | 2026-10-26 |
| react-sync-store | https://react.dev/reference/react/useSyncExternalStore | `getServerSnapshot` used during server rendering and hydration | react-performance (render reference) | 2026-10-26 |
| css-attr | https://developer.mozilla.org/en-US/docs/Web/CSS/attr | `content: attr()` | react-performance (render reference) | - |
| headlessui-modal | https://headlessui.com/react/menu , https://headlessui.com/react/listbox , https://headlessui.com/react/combobox | `modal` default `true`: scroll locking, focus trapping, `inert` | make-interfaces-feel-better (dropdowns), browser-qa | 2026-10-26 |
| mdn-focus-visible | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible | UA heuristics; removing focus styles breaks keyboard use; style `:focus-visible`, not `:focus` | make-interfaces-feel-better (focus style) | 2026-10-28 |
| shadcn-input | https://ui.shadcn.com/docs/components/input | default text size `text-base md:text-sm` (16px on phones, no iOS focus zoom) | make-interfaces-feel-better (field text size) | 2026-10-28 |
| mdn-min-width | https://developer.mozilla.org/en-US/docs/Web/CSS/min-width | `auto` for flex and grid items: transferred size from `aspect-ratio` with a definite height; `0` for scroll containers | make-interfaces-feel-better (min-w-0) | 2026-10-28 |
| next-redirect | https://nextjs.org/docs/app/api-reference/functions/redirect | `redirect()` ends rendering; redirect before render via `next.config` or proxy | react-performance (waterfalls) | 2026-10-28 |
| next-cache-components | https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents , https://nextjs.org/docs/app/guides/migrating-to-cache-components | `partialPrefetching` alongside; segment configs that fail; `instant = false`; Activity keeps state | react-performance (server) | 2026-10-28 |
| wcag22 | https://www.w3.org/TR/WCAG22/ | version | accessibility | - |
| owasp | https://cheatsheetseries.owasp.org/ (XSS, CSP) | guidance | security | - |
| next-security | https://nextjs.org/docs/app/guides/data-security | server actions; props limited to the fields a component renders | security, lean-code (components) | 2026-10-28 |
| next-csp | https://nextjs.org/docs/app/guides/content-security-policy | nonce vs static vs SRI options | security | 2026-10-21 |
| zod | https://zod.dev | API changes | typescript-style, security | - |
| testing-library | https://testing-library.com/docs/ | API | react-testing | - |
| playwright | https://playwright.dev/docs/intro | releases | browser-qa | - |
| google-search | https://developers.google.com/search/docs | guidance | seo | - |
| next16-upgrade | https://nextjs.org/docs/app/guides/upgrading/version-16 | breaking changes (`proxy.ts`, image props) | lean-code, security, react-performance, landing-standard | - |
| llms-txt | https://llmstxt.org/ | format: `##` sections are link lists | landing-standard | 2026-10-24 |
| content-signals | https://contentsignals.org/ | signal names | landing-standard | - |
| mcp-spec | https://modelcontextprotocol.io/specification | current version 2026-07-28: per-request `_meta` version, `server/discover`, header validation, legacy `initialize` | landing-standard | 2026-10-24 |
| mcp-server-card | https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1960 | SEP-1960 closed as duplicate of SEP-1649 (server card, continued as SEP-2127) | landing-standard | 2026-10-24 |
| webmcp | https://webmachinelearning.github.io/webmcp/ | draft 2026-10-20: `document.modelContext`, `registerTool(tool, { signal })` | landing-standard | 2026-10-24 |
| agent-skills-discovery | https://isitagentready.com/.well-known/agent-skills/index.json | index schema 0.2.0, `digest: sha256:` | landing-standard | 2026-10-24 |
| next-segment-config | https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config | `dynamic` removed under `cacheComponents` | landing-standard | 2026-10-24 |
| anthropic-crawlers | Anthropic help center, crawler user agents (ClaudeBot, Claude-User, Claude-SearchBot) | agent names | landing-standard | - |
| consent-mode | https://developers.google.com/tag-platform/security/guides/consent | version | landing-standard | - |
| claude-skills | https://code.claude.com/docs/en/skills | frontmatter, size | kit-review | 2026-10-21 |
| gh-run-list | https://cli.github.com/manual/gh_run_list | JSON fields `createdAt`, `startedAt`, `updatedAt` | work-estimate (scripts) | 2026-10-23 |
| claude-plugins | https://code.claude.com/docs/en/plugins | layout, install, updates | kit-review | 2026-10-21 |
| agent-skills-spec | https://agentskills.io/specification | fields, limits | kit-review | 2026-10-21 |
| pep8 | https://peps.python.org/pep-0008/ | programming recommendations, naming, wildcard imports | python-style | 2026-10-23 |
| pep257 | https://peps.python.org/pep-0257/ | which objects get docstrings, one-line form | python-style | 2026-10-23 |
| typing-practices | https://typing.python.org/en/latest/reference/best_practices.html | `Any` vs `object`, argument and return types, unions | python-style | 2026-10-23 |
| google-pyguide | https://google.github.io/styleguide/pyguide.html | exceptions, defaults, globals, comprehensions, logging, `main`, nested functions | python-style | 2026-10-23 |
| python-dataclasses | https://docs.python.org/3/library/dataclasses.html | `frozen`, `replace()` | python-style | 2026-10-23 |
| python-logging | https://docs.python.org/3/howto/logging.html | module loggers, library handlers, `print` vs logging | python-style | 2026-10-23 |
| asyncio-dev | https://docs.python.org/3/library/asyncio-dev.html | debug mode, blocking calls | python-style | 2026-10-23 |
| asyncio-task | https://docs.python.org/3/library/asyncio-task.html | task references, `TaskGroup` vs `gather`, `timeout`, cancellation | python-style | 2026-10-23 |
| pydantic-typeadapter | https://pydantic.dev/docs/validation/latest/concepts/type_adapter/ | build once | python-style | 2026-10-23 |
| ruff-settings | https://docs.astral.sh/ruff/settings/ | mccabe and pylint defaults, `target-version` from `requires-python` | python-style (limits), python-tooling | 2026-10-23 |
| ruff-rules | https://docs.astral.sh/ruff/rules/ | stable or preview status of the selected rules | python-style, python-tooling, python-security | 2026-10-23 |
| ruff-linter | https://docs.astral.sh/ruff/linter/ | rule selection, `--add-noqa`, fix safety | python-tooling | 2026-10-23 |
| ruff-formatter | https://docs.astral.sh/ruff/formatter/ | conflicting rules, best-effort line length | python-tooling | 2026-10-23 |
| mypy-existing | https://mypy.readthedocs.io/en/stable/existing_code.html | strict flags, overrides, missing imports | python-tooling | 2026-10-23 |
| mypy-dynamic | https://mypy.readthedocs.io/en/stable/dynamic_typing.html | operations on `Any` not checked | python-tooling | 2026-10-24 |
| sp-style | https://learn.scientific-python.org/development/guides/style/ | mypy extra error codes, Ruff groups | python-tooling | 2026-10-23 |
| sp-pytest | https://learn.scientific-python.org/development/guides/pytest/ | pytest config, `spec` on mocks | python-tooling, python-testing | 2026-10-23 |
| typing-conformance | https://github.com/python/typing/tree/main/conformance | type checker conformance scores | python-tooling (checker choice) | 2026-10-23 |
| pyrefly | https://pyrefly.org/ , https://pyrefly.org/en/docs/migrating-from-mypy/ | stable 1.x, migration from mypy | python-tooling (checker choice) | 2026-10-23 |
| pypi | https://pypi.org/ (JSON API) | release dates, development status | python-tooling (versions) | 2026-10-23 |
| uv-settings | https://docs.astral.sh/uv/reference/settings/ | `exclude-newer`, `exclude-newer-package` | python-tooling | 2026-10-23 |
| uv-resolution | https://docs.astral.sh/uv/concepts/resolution/ | cooldown timestamp in `uv.lock` | python-tooling | 2026-10-23 |
| uv-sync | https://docs.astral.sh/uv/concepts/projects/sync/ | `--locked` vs `--frozen`, `dev` group | python-tooling | 2026-10-23 |
| uv-github | https://docs.astral.sh/uv/guides/integration/github/ | setup-uv, pinned uv, cache | python-tooling | 2026-10-23 |
| uv-dependabot | https://docs.astral.sh/uv/guides/integration/dependabot/ | cooldown equal to `exclude-newer` | python-tooling | 2026-10-23 |
| uv-audit | https://astral.sh/blog/uv-audit | preview status | python-security | 2026-10-23 |
| pytest-practices | https://docs.pytest.org/en/stable/explanation/goodpractices.html | src layout, import mode, `strict` | python-testing, python-tooling | 2026-10-23 |
| pytest-config | https://docs.pytest.org/en/stable/reference/customize.html | `[tool.pytest]` native TOML (9.0+) | python-tooling | 2026-10-23 |
| pytest-strict | https://github.com/pytest-dev/pytest/pull/13839 | options `strict` turns on, locked pytest | python-tooling | 2026-10-23 |
| pytest-asyncio | https://pytest-asyncio.readthedocs.io/en/latest/concepts.html | auto vs strict mode | python-testing | 2026-10-23 |
| anyio-testing | https://anyio.readthedocs.io/en/stable/testing.html | plugin, conflict with pytest-asyncio auto mode | python-testing | 2026-10-23 |
| httpx-transports | https://www.python-httpx.org/advanced/transports/ | `MockTransport`, RESPX, pytest-httpx | python-testing | 2026-10-23 |
| zoneinfo | https://docs.python.org/3/library/zoneinfo.html | `timedelta` added in a zone keeps the wall time across a clock change | python-testing | 2026-10-24 |
| coverage-config | https://coverage.readthedocs.io/en/latest/config.html | `branch`, `fail_under` | python-tooling, tdd-workflow | 2026-10-23 |
| diff-cover | https://github.com/Bachmann1234/diff_cover | `--compare-branch`, `--fail-under` | python-tooling, python-testing, tdd-workflow | 2026-10-23 |
| git-diff-copies | https://git-scm.com/docs/diff-options | `-M` takes a rename only from a file that disappeared; `-C` also takes files modified in the same change as copy sources | python-tooling | 2026-10-24 |
| vulture | https://github.com/jendrikseipp/vulture | confidence, whitelist | python-tooling | 2026-10-23 |
| import-linter | https://import-linter.readthedocs.io/en/stable/contract_types/acyclic_siblings/ | acyclic siblings contract, importable root package | python-tooling | 2026-10-23 |
| python-security-warnings | https://docs.python.org/3/library/security_warnings.html | modules with security notes, `-I` | python-security | 2026-10-23 |
| python-subprocess | https://docs.python.org/3/library/subprocess.html | security considerations, `timeout`, `check` | python-security | 2026-10-23 |
| python-tarfile | https://docs.python.org/3/library/tarfile.html | extraction filters, 3.14 default | python-security | 2026-10-23 |
| python-xml | https://docs.python.org/3/library/xml.html | XML attacks, Expat version | python-security | 2026-10-23 |
| python-hmac | https://docs.python.org/3/library/hmac.html | `compare_digest` | python-security | 2026-10-23 |
| psycopg-params | https://www.psycopg.org/psycopg3/docs/basic/params.html | parameters, `sql.Identifier` | python-security | 2026-10-23 |
| requests-timeouts | https://requests.readthedocs.io/en/latest/user/advanced/#timeouts | no default timeout, `verify=False` | python-security | 2026-10-23 |
| httpx-timeouts | https://www.python-httpx.org/advanced/timeouts/ | default timeout | python-security | 2026-10-23 |
| ruff-s701 | https://docs.astral.sh/ruff/rules/jinja2-autoescape-false/ | Jinja2 autoescape default | python-security | 2026-10-23 |
| owasp-python | https://cheatsheetseries.owasp.org/ (Deserialization, OS Command Injection Defense, SSRF Prevention, Password Storage, Logging, Input Validation, Secrets Management) | guidance | python-security | 2026-10-23 |

Variants instead of boolean flags (lean-code) follow from the complexity limit: each flag adds branches.

## Not yet sourced

Carried over from earlier practice without an external source: `make-interfaces-feel-better`, `production-audit`, `verification-loop`, `click-path-audit`, `agent-architecture-audit`, `automation-audit-ops`, `search-first`, `codebase-onboarding`, `article-writing`, agents `build-error-resolver`, `silent-failure-hunter`, `python-reviewer` (its own checks: locks, calls in loops, Django, FastAPI and Flask), commands `save-session`, `resume-session`. The next monthly review sources each rule or cuts it.

Measured, no external source yet: `work-estimate` step sizes and the 5-30x overshoot of human-hour estimates (one session, five pull requests). `react-performance`: `import()` of a package name pulling the whole package on Turbopack; the YouTube Shorts cover `oar2.jpg`; starting analytics on the first human action; `preload`/`priority` not setting `fetchpriority` (read in the Next.js 16.4 image source); the gains quoted in `references/ship-only-what-is-used.md`; a Suspense fallback around the LCP component delaying its paint (streamed hidden block, observed in PSI filmstrips); `next/font` `preload: false` measured slightly better with three weights. Measured 2026-10-26: inline `next/script` `beforeInteractive` ships in the App Router HTML as a push into `self.__next_s` that the Next.js runtime runs (Next.js 16.4); a stored currency applied after hydration painted as the default for about 1.3 s; PSI mobile renders at 412 px (full-page screenshot width, Lighthouse 13.5), where a hero price line that rewrapped on the web font swap at 390 px (CLS 0.28 in Chrome) did not shift. `make-interfaces-feel-better`: a crawl of 436 pages at phone and desktop width found stair-stepped card rows on 97 (up to 56 px) and none on a recheck of those pages after the `h-full`/`flex-1` change; Headless UI menus with the default `modal` moved fixed elements by the 15 px scrollbar on open. `browser-qa`: Playwright headless Chrome reports a 0 px scrollbar unless `--hide-scrollbars` is dropped (15 px on Windows).

Measured: the `python-tooling` Ruff rule set and mypy extra error codes were run read-only over three Python repos (2026-10-23); `exclude-newer = "14 days"` was locked in a scratch project and recorded as `exclude-newer-span = "P14D"` in `uv.lock`.

Measured: jscpd 5.4.1 over four Python repos (2026-10-23, read-only): exact copies 0.7-1.9% of lines; with `--ignore-identifiers` 1.3-6.8%, including real repeats the exact mode misses (an insert written twice with a renamed variable, a service start-up written twice, a command-handler preamble in fourteen handlers); `--ignore-literals` 10% on the largest repo, mostly same-shaped queries. In a scratch repo `--baseline-from-ref` with `--fail-on-new-clones 0` failed on a new copy and passed once it was on the base. Replayed over the last 40 merged pull requests of the largest repo: the renamed-copies gate would have failed 19 (122 new hits: 64 logic, 41 field lists, 17 import blocks), long renamed copies only (`--min-tokens 100`) 10 (4 logic, 8 field lists), the exact gate 8 (16 logic, 1 field list; among them one polling loop copied into six modules). After reformatting that repo, `--baseline-from-ref origin/main` counted 15 of its 28 old copies as new; a committed `--baseline` file (fingerprints only, no paths) passed, passed from another folder, and failed on a copied function. Rolling the standard out there: the formatter left 12 `noqa` comments on the closing line of the calls it split and `ruff check --fix` then deleted them as unused; PT018 split 885 compound assertions with the tests still passing; the baseline file made on Windows matched in Linux CI. Second rollout (a repo with a copy of the first's core): diff-cover against `origin/main` failed at 74% of 178 changed lines, against `origin/main` formatted by the PR's Ruff (two-dot range) 100% of 12; the formatter also moved one `# type: ignore`.

Measured, unfreezing the first repo (2026-10-24): every frozen limit fixed with mypy strict, Ruff and all 833 tests green; the deploy rolled back on its health check because a wrapper typed `**kwargs: Any` still passed the old keywords to a function that now took a parameter object, and the tests passed because they faked that wrapper with the old signature; a test that runs the real path down to `urlopen` fails on that code. A test computing next Monday by adding days to a UTC instant failed in the hour after local midnight before the clocks went back; adding days to the local date passes at any hour.

Measured, rolling the standard out to a 4.7k-line repo with 20% coverage (2026-10-24): freezing added 82 `noqa` and 215 `# type: ignore` comments, and diff-cover against the formatted base counted 261 changed lines at 34%; with trailing pragmas dropped on both sides and committed, 7 lines at 85% (the comment strip alone, left uncommitted, still counted them: diff-cover reads staged and unstaged changes). Replayed on the largest repo with a test pull request (a `noqa` on an uncovered line, a new reason on an existing `noqa`, one code change): 1 line at 100% with both sides stripped, 42 lines at 38% with only the PR side stripped.

Measured, unfreezing that 4.7k-line repo and moving its modules into a `src/` package with a launcher left under the entry module's old name (2026-10-24): diff-cover counted 850 changed lines; with `diff.renames copies` 588 (the moved modules count only their edits); the `histogram` and `patience` diff algorithms saved 16 and 9 lines more, not worth a setting.
