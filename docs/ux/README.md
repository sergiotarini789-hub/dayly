# Dayly UX Documentation

**Current phase:** PHASE 1B — Design Tokens & Theme Foundation
**Status:** In progress

The UX documentation contains the approved PHASE 0B architecture, the reviewed PHASE 1A visual language, and the PHASE 1B token foundation. PHASE 1B implements shared tokens and themes only; it does not create components, screens, or feature logic.

## Approved PHASE 0B UX architecture

- [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md) — hierarchy, destinations, navigation, Today information architecture, and responsive shell direction.
- [`SCREEN_MAP.md`](SCREEN_MAP.md) — screen inventory, entry/exit paths, primary and secondary actions, and UX states.
- [`USER_FLOWS.md`](USER_FLOWS.md) — detailed MVP, future integration, onboarding, search, review, and quick-action flows.
- [`COMPONENT_INVENTORY.md`](COMPONENT_INVENTORY.md) — conceptual reusable navigation, domain, form, feedback, overlay, visualization, and mobile patterns.
- [`UX_PRINCIPLES.md`](UX_PRINCIPLES.md) — UX direction, responsive/state principles, decision log, and unresolved decisions.

## Reviewed PHASE 1A visual language

- [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md) — visual personality, reference analysis, color philosophy, typography, shape, surfaces, density, and module visual language.
- [`VISUAL_STATES.md`](VISUAL_STATES.md) — loading, empty, first-use, error, offline, success, interaction, permission, and conflict states.
- [`MOTION_PRINCIPLES.md`](MOTION_PRINCIPLES.md) — motion purpose, timing categories, easing, reduced motion, and interaction transitions.

## PHASE 1B implementation

- [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md) — implemented primitive, semantic, theme, Tailwind, accessibility, control, density, and chart token contract.
- [`../../src/styles/tokens.css`](../../src/styles/tokens.css) — CSS custom properties, light/dark themes, Tailwind CSS v4 bridge, focus treatment, and reduced-motion values.
- [`../../src/lib/design-system/validate-tokens.mjs`](../../src/lib/design-system/validate-tokens.mjs) — dependency-free token validation utility.

The foundation uses semantic tokens and a platform-first font stack. No feature components or screens have been created. PHASE 1C — Core Components has not started.
