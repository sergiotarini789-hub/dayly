# Dayly UX Documentation

**Current phase:** PHASE 1C — Core UI Component System
**Status:** In progress

The UX documentation contains the approved PHASE 0B architecture, the reviewed PHASE 1A visual language, the PHASE 1B token foundation, and the PHASE 1C domain-agnostic component system. PHASE 1D layout work has not started.

## Approved PHASE 0B UX architecture

- [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md) — hierarchy, destinations, navigation, Today information architecture, and responsive shell direction.
- [`SCREEN_MAP.md`](SCREEN_MAP.md) — screen inventory, entry/exit paths, primary and secondary actions, and UX states.
- [`USER_FLOWS.md`](USER_FLOWS.md) — detailed MVP, future integration, onboarding, search, review, and quick-action flows.
- [`COMPONENT_INVENTORY.md`](COMPONENT_INVENTORY.md) — conceptual reusable navigation, domain, form, feedback, visualization, and mobile patterns.
- [`UX_PRINCIPLES.md`](UX_PRINCIPLES.md) — UX direction, responsive/state principles, decision log, and unresolved decisions.

## Reviewed PHASE 1A visual language

- [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md) — visual personality, reference analysis, color philosophy, typography, shape, surfaces, density, and module visual language.
- [`VISUAL_STATES.md`](VISUAL_STATES.md) — loading, empty, first-use, error, offline, success, interaction, permission, and conflict states.
- [`MOTION_PRINCIPLES.md`](MOTION_PRINCIPLES.md) — motion purpose, timing categories, easing, reduced motion, and interaction transitions.

## PHASE 1B implementation

- [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md) — implemented primitive, semantic, theme, Tailwind, accessibility, control, density, and chart token contract.
- [`../../src/styles/tokens.css`](../../src/styles/tokens.css) — CSS custom properties, light/dark themes, Tailwind CSS v4 bridge, focus treatment, and reduced-motion values.
- [`../../src/lib/design-system/validate-tokens.mjs`](../../src/lib/design-system/validate-tokens.mjs) — dependency-free token validation utility.

## PHASE 1C implementation

- [`CORE_COMPONENTS.md`](CORE_COMPONENTS.md) — component architecture, inventory, prop/state/accessibility contracts, responsive and motion behavior, showcase, and validation.
- [`../../src/components/ui/index.ts`](../../src/components/ui/index.ts) — public component barrel.
- [`../../src/components/ui/primitives.tsx`](../../src/components/ui/primitives.tsx) — native controls, visual primitives, feedback, and data foundations.
- [`../../src/components/ui/navigation.tsx`](../../src/components/ui/navigation.tsx) — tabs, collapsible, and accordion.
- [`../../src/components/ui/overlays.tsx`](../../src/components/ui/overlays.tsx) — overlays, menus, sheets, tooltips, and toast feedback.
- [`../../src/showcase/ComponentShowcase.tsx`](../../src/showcase/ComponentShowcase.tsx) — development-only component showcase at `/showcase`.

The component system remains domain-agnostic and consumes the PHASE 1B token contract. It contains no product screens, feature logic, data access, integrations, or PHASE 1D layout work.
