---
name: react-testing
description: "React component, hook and page tests - Testing Library on Vitest or Jest, MSW, axe, and where Playwright takes over. Use when writing, fixing or setting up *.test.tsx / *.spec.tsx. Process and coverage: tdd-workflow."
---

# react-testing

Test process and coverage: `tdd-workflow`. Browser checks: `browser-qa`.

## Principle

Test what the user sees and does.

- Render with the providers used in production. Interact through accessible queries and `userEvent`. Assert visible output and observable effects (callback called, request sent).
- Never assert on state, props passed to children, which hooks ran, render counts, or DOM structure users cannot perceive.
- A behavior-preserving refactor must keep tests green; a test that breaks checked implementation.

## Runners

| Runner | Use for |
|---|---|
| Vitest | New and Vite-based projects; Jest-compatible API, native ESM |
| Jest | Repos already on Jest; Next.js ships `next/jest` |
| Playwright Component Testing | Components that need a real browser engine |
| Cypress Component Testing | Same, when the repo already uses Cypress |
| Playwright | E2E of critical user flows (Cypress only if already in use) |

- One component-test runner per repo, unless the lanes are clearly split.
- React 19 needs React Testing Library 16.1+. Install `@testing-library/dom` next to it (peer dependency since 16.0).

## Queries

Prefer, top down:

1. `getByRole(role, { name })`; `getByLabelText` for fields; `getByPlaceholderText` only when there is no label (then add one); `getByText` for non-interactive text; `getByDisplayValue`.
2. `getByAltText` for images; `getByTitle` (weak).
3. `getByTestId` when nothing above fits.

- `getBy*` throws on no match, `queryBy*` returns `null` (assert absence), `findBy*` returns a promise (async appearance).
- No `container.querySelector`: it lets tests pass where users fail.

## Interaction and async

- `userEvent`, not `fireEvent`: it plays the full browser sequence (focus, keys, input); `fireEvent` sends one event.
- `const user = userEvent.setup()` once per test, before render; `await` every call.
- Content that arrives later: `await screen.findBy*` (a sync `getBy*` throws).
- Side effects: `await waitFor(() => expect(spy).toHaveBeenCalled())`.
- Removal: `await waitForElementToBeRemoved(() => screen.queryByText('Loading'))`.
- Never `setTimeout` then assert.
- Treat `act()` warnings as bugs: an unawaited update or an update after unmount.

## Network: MSW

Mock HTTP at the network layer; components, hooks and the fetch client run unchanged.

```ts
// test/setup.ts
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.get('/api/items/:id', ({ params }) => HttpResponse.json({ id: params.id, title: 'Desk' })),
)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

- `onUnhandledRequest: 'error'` fails any test that makes an unmocked request.
- Per test: `server.use(...)`, e.g. return `new HttpResponse(null, { status: 500 })` and assert the error UI.

## Providers and hooks

- One `renderWithProviders` in `test-utils.tsx` that also re-exports Testing Library; import from it everywhere.
- New `QueryClient` per test with `retry: false`, created outside the wrapper component (inside, it is rebuilt each render and drops its cache). In-memory router for routed components.
- Hooks: `renderHook(() => useX(arg), { wrapper })`; wrap state changes in `act`; assert only the returned API.

## Accessibility

- Every interactive component: `expect(await axe(container)).toHaveNoViolations()` (`jest-axe`; `expect.extend(toHaveNoViolations)` in setup, works with Vitest). Catches missing labels, invalid ARIA, missing alt text, heading order.
- JSDOM has no real CSS, so contrast results here are unreliable; check contrast in the browser (`browser-qa`). Criteria: `accessibility`.

## Snapshots

- Do not snapshot rendered components: they break on styling, get approved unread, and pin structure, not behavior.
- Allowed for stable non-visual output: serializers, generated config.
- Visual regression uses screenshots (`browser-qa`), not DOM strings.

## Component test or browser test

JSDOM has no real layout (flex, grid, viewport), CSS animation or transitions, scrolling, drag-and-drop, clipboard, iframes, popups, downloads or cross-origin flows.

- Hook, presentational component, form logic: Testing Library.
- Layout-dependent component, or a browser API JSDOM lacks: Playwright Component Testing.
- Async Server Component (Next.js App Router): Vitest and Jest cannot render it; cover it with E2E. Sync Server and Client Components unit-test normally.
- Flow across pages: Playwright E2E.

## Anti-patterns

- Mocking React or its hooks (`vi.mock('react')`): refactor the component.
- Mocking child components by default; mock only children with heavy side effects.
- Mutable state shared between tests.
- A test that stays green when the code under test is broken.

Worked examples (provider helper, form with MSW, error boundary, Suspense): [references/examples.md](references/examples.md).
