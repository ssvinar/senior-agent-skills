---
name: make-interfaces-feel-better
description: "Visual design and polish - direction, palette, type pairing, CSS tokens, anti-template layout, radii, shadows, text wrapping, motion, interaction states, hit areas. Use when starting a UI surface, when it looks generic or unfinished, or reviewing visual details. WCAG: accessibility."
---

# Make Interfaces Feel Better

Animation performance and font loading: `react-performance`. Contrast, focus visibility, minimum target size: `accessibility`.

## Direction before code

- Commit to a named direction, never "clean minimal": editorial/magazine, neo-brutalism, glassmorphism with real depth, dark or light luxury with disciplined contrast, bento, scrollytelling, 3D, Swiss/International, retro-futurism.
- Define the palette and the type pairing before building components.
- Collect a few real references.
- Choose themes on purpose: dark mode is not a default; if both themes ship, design both.

## Never ship

- Uniform card grids with no hierarchy
- A stock hero: centered headline, gradient blob, generic CTA
- Library defaults (stock Tailwind or shadcn look) presented as finished design
- Flat pages with no layering, depth, or motion
- The same radius, spacing, and shadow on every component
- Gray-on-white with one decorative accent
- Sidebar + cards + charts dashboards with no point of view
- Default font stacks without a reason

## Show at least four

1. Hierarchy through scale contrast
2. Spacing rhythm instead of uniform padding
3. Depth through overlap, shadows, surfaces, or motion
4. Type with character and a deliberate pairing
5. Color that carries meaning
6. Designed hover, focus, and active states
7. Grid-breaking editorial or bento composition where it fits
8. Texture, grain, or atmosphere where the direction calls for it
9. Motion that explains flow rather than decorates
10. Charts styled as part of the design system

## Tokens

Declare colors (`oklch`), a fluid type scale and section spacing (`clamp()`), durations, and easing curves as custom properties on `:root`. Reference tokens; never repeat raw palette, type, or spacing values. Class names: kebab-case or utility classes.

## Details

- Nested rounded surfaces: outer radius = inner radius + gap. With a large gap, treat them as separate surfaces.
- Center optically: nudge asymmetric icons (play, arrows, stars) by fixing the SVG, or by a pixel-level offset.
- Borders separate and frame focus; layered, low-opacity shadows lift cards, buttons, menus, and popovers and must read on any background.
- `text-wrap: balance` on headings and short titles; `text-wrap: pretty` on short-to-medium body text, captions, and list items; neither on long prose or code.
- `font-variant-numeric: tabular-nums` on counters, timers, prices, tables, and any changing number.
- If the root does not set it, add `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` on `html`.
- Give images a 1px inset outline (`outline-offset: -1px`) at 10% black, 10% white in dark mode; never brand-tinted.
- Cards in one row are one height: the card fills its cell (`h-full`, flex column) and its body grows (`flex-1`), so a missing optional line or a wrapped one does not stair-step the row.
- One focus style for the whole site, on `:focus-visible` in global CSS. Components never remove the outline (`outline-none`, `ring-0`) without an equally visible replacement; a text field may use its own border instead. Visibility and contrast: `accessibility`.
- Text fields, selects, and textareas use at least 16px text on phones (`text-base md:text-sm`): iOS Safari zooms into smaller fields on focus. Never fix it by blocking zoom.
- A flex or grid child with `aspect-ratio` and a definite height takes its minimum width from the ratio (`min-width: auto`) and overflows a narrow parent: add `min-w-0`, or make it a scroll container (`overflow-hidden`).
- Dropdowns do not lock page scroll. Headless UI `MenuItems`, `ListboxOptions` and `ComboboxOptions` default to `modal`: on desktop the scrollbar disappears and fixed elements (floating buttons, banners) jump by its width while the dropdown is open. Pass `modal={false}`; modal dialogs keep the lock.

## Motion design

- Transitions for interactive state changes, because they retarget mid-motion; keyframes only for staged one-shot entrances and loading sequences.
- Enter: opacity plus a small upward `translateY`, optionally blur. Exit: shorter and quieter, about 150ms.
- Press: `scale(0.96)` on tactile buttons, with a way to turn it off where it distracts.
- Icon swaps: cross-fade opacity, scale, and blur; never an instant toggle.
- List transitioned properties explicitly; never `transition: all`.

## Hit areas

Aim for 44x44px where the layout allows; the minimum is in `accessibility`. Extend small icons with a pseudo-element; extended areas must not overlap.

## Review output

Check every section above and ask whether the result would pass as a real product screenshot. Report each change as a row: Principle | Before | After (for example: Transition scope | `transition: all` | `transform, background-color`). Add file paths when not obvious; skip principles checked but unchanged.
