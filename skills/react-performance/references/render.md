# Re-renders, rendering, JS hot paths

Apply only to a measured re-render problem, or when React Compiler is off; memoization policy: `lean-code`.

## Re-renders

- Do not subscribe to store values that only a callback reads; read them inside the callback (`useStore.getState()`).
- Select the derived value, not the whole collection: `useStore((s) => s.cart.length > 0)`.
- Hoist constant object and array fallbacks to module scope (`items ?? EMPTY_ITEMS`); an inline `[]` is a new value on every render.
- Put primitives in dependency arrays, never object or array literals.
- Pass a function to `useState` when the initial value is expensive to compute.
- Split a hook that reads unrelated sources so each part recomputes only for its own inputs.
- Mark non-urgent updates with `startTransition` or `useTransition` (the current UI stays visible while `isPending`); feed expensive renders a `useDeferredValue` copy of the input.
- Keep frequently changing values that are never rendered (timestamps, accumulators) in `useRef`.
- Initialize app-wide singletons (telemetry, logger) once behind a module-scope guard, not in an effect.

## Rendering

- Long lists: `content-visibility: auto` with `contain-intrinsic-size: auto <row height>` on each row.
- Hoist JSX that never changes to module scope.
- Round SVG path coordinates to two decimals.
- Set values needed before hydration (theme, locale, a stored currency or unit) with a small inline script that writes to `document.documentElement` before React mounts. In the App Router make it a plain `<script dangerouslySetInnerHTML>` in `<head>`: inline `next/script` `beforeInteractive` is queued for the Next.js runtime and runs after first paint.
- A stored preference on statically cached pages (the server cannot read it): render every variant on the server, the default as text and the others in `data-*` attributes, and let CSS keyed on the `<html>` attribute show the chosen one (`::after { content: attr(...) }`). The first paint is final, and crawlers and no-JS visitors read the default. A store that mirrors the value onto `<html>` writes only after hydration, because the hydration render uses the server snapshot. Measured: before this, prices showed the default currency for about 1.3 s after load.
- Use `suppressHydrationWarning` only on a leaf whose content is known to differ, such as a local timestamp, and on `<html>` when the inline script above sets an attribute on it.
- Hide tabs and panels with `<Activity mode="hidden">` (React 19.2+) instead of unmounting them; state and DOM survive.
- Use a ternary, not `&&`, when the condition can be `0`.
- Hint critical resources with `preload` and `preconnect` from `react-dom`.

## JS hot paths

Apply only where profiling shows a hot path (`lean-code`).

- Batch style changes into one class swap or one `cssText` write.
- Use `Map`/`Set` for repeated lookups and membership tests.
- Cache `length` and other property reads in tight loops; build `RegExp` objects outside loops.
- Cache pure-function results in a module-level `Map`.
- Filter and map in one pass (`flatMap` or a single loop).
- Compare lengths before deep comparisons; return early.
- Find min or max with a loop, not `sort()`.
- Defer non-critical work with `requestIdleCallback`.
