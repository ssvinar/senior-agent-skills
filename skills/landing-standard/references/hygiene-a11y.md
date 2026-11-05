# Hygiene and accessibility

Items most often missed on otherwise polished landings.

## App Router files

- `app/[locale]/error.tsx` and `app/global-error.tsx`: without them, a runtime error in any client island (carousel, lightbox) shows Next's bare default screen with no branding or reset button.
- Locale-aware not-found: `app/[locale]/not-found.tsx` with `getTranslations`, plus a root catch-all. Typical bug: text hardcoded in one locale under `<html lang>` of another.
- `viewport` export in the layout (`themeColor`, `colorScheme`) instead of meta tags; it colors the mobile browser UI.

## Accessibility

Rules (WCAG 2.2 AA, skip link, form ARIA, reduced motion): `accessibility`. Landing check: find `outline: none` left by libraries (slick and similar) without a replacement and remove it.

## Code

- No `.jsx` in a TS project: convert content components to `.tsx` (SVG wrappers last).
- No Pages Router (`pages/api`): move lead endpoints to App Router route handlers, keeping their anti-abuse, validation and escaping (`security`).
- Logging: `typescript-style`.
