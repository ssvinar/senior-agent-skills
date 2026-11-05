---
name: tooling
description: "Code tooling for TypeScript, React and Next.js repos - ESLint (Next.js recommended config plus size limits), Prettier, knip, jscpd, React Compiler and the CI gate, with ready config files. Use when setting up, upgrading or checking a repo's lint, format and code-audit tools."
---

# tooling

Ready configs: [configs/](configs/). Copy them to the app root; change only for a documented reason. Limits inside the ESLint config belong to `lean-code`.

## Tools

| Tool | Config | Script |
|---|---|---|
| ESLint 10, `eslint-config-next` (`core-web-vitals` + `typescript`), `eslint-config-prettier` | [eslint.config.mjs](configs/eslint.config.mjs) | `lint` |
| Prettier, defaults; with Tailwind add `prettier-plugin-tailwindcss` | [.prettierrc.json](configs/.prettierrc.json), [.prettierignore](configs/.prettierignore) | `format`, `format:check` |
| knip, defaults, cycles as errors | [knip.json](configs/knip.json) | `audit:code` |
| jscpd | [.jscpd.json](configs/.jscpd.json) | `audit:code` |
| React Compiler | `reactCompiler: true` in `next.config`, `babel-plugin-react-compiler` | |
| TypeScript | the repo's `tsconfig.json` | `typecheck` |

Scripts: [scripts.json](configs/scripts.json). CI order: [ci-steps.yml](configs/ci-steps.yml).

Stable releases only, exact versions in `devDependencies`, each published at least two weeks ago.

## Apply to a repo

1. Install the tools; copy the configs; adjust the ESLint `files` globs to the repo's code folders.
2. `npx eslint . --suppress-all`: existing limit violations go to `eslint-suppressions.json` (commit it); CI fails only on new ones.
3. `npx prettier --write .` as its own commit. Add its SHA to `.git-blame-ignore-revs`; merge that PR with a merge commit (squash drops the SHA).
4. `npx knip --fix --fix-type exports,types --format`: removes `export` from names used only in their own file.
5. Add the CI steps.

## Pitfalls

- Add generated and data files to `.prettierignore` (migrations, downloaded data, test fixtures): formatting test inputs breaks tests.
- A few files may need a second `prettier --write` pass.
- Tailwind v4: the class-sorting plugin needs the CSS entry, or theme classes sort wrong: `{"plugins": ["prettier-plugin-tailwindcss"], "tailwindStylesheet": "./app/globals.css"}` (path relative to the Prettier config). The plugin goes last in `plugins`.
- Some plugins inside `eslint-config-next` do not list ESLint 10 as a peer: npm warns, strict peer mode fails.
- knip loads config files: give it dummy values for env variables they require (e.g. `DATABASE_URL`).
- `no-unused-vars` options `ignoreRestSiblings` and `argsIgnorePattern: "^_"` cover `{ dropped, ...rest }` and positional or typing-only arguments.
- Import cycles: knip, not madge (no release since 2024; counts type-only imports).
