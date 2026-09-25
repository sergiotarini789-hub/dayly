# Dayly UX Documentation

**Current phase:** PHASE 1F — Product-facing onboarding & Today preview
**Status:** Complete

The UX documentation contains the approved PHASE 0B architecture, the reviewed PHASE 1A visual language, the PHASE 1B token foundation, the PHASE 1C domain-agnostic component system, the PHASE 1D application shell/layout system, the PHASE 1E interaction/motion system, and the bounded PHASE 1F product-facing preview. PHASE 1G has not started.

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

## PHASE 1D implementation

- [`LAYOUT_SYSTEM.md`](LAYOUT_SYSTEM.md) — application shell, navigation bands, breakpoints, page containers, layout primitives, panels, scroll behavior, accessibility, showcase, and forbidden patterns.
- [`../../src/components/layout/index.ts`](../../src/components/layout/index.ts) — public layout composition barrel.
- [`../../src/components/layout/application-shell.tsx`](../../src/components/layout/application-shell.tsx) — shell landmarks, skip link, navigation frame, top bar, and main content boundary.
- [`../../src/components/layout/responsive-navigation.tsx`](../../src/components/layout/responsive-navigation.tsx) — single-registry desktop, tablet, and mobile navigation composition.
- [`../../src/components/layout/primitives.tsx`](../../src/components/layout/primitives.tsx) — page/header/section/layout/panel/master-detail/calendar structural primitives.
- [`../../src/styles/layout.css`](../../src/styles/layout.css) — responsive shell and layout behavior using approved tokens and safe-area values.
- [`../../src/showcase/LayoutShowcase.tsx`](../../src/showcase/LayoutShowcase.tsx) — development-only layout showcase content inside `/showcase`.

## PHASE 1E interaction and motion implementation

- [`INTERACTION_SYSTEM.md`](INTERACTION_SYSTEM.md) — implementation contract for motion categories, approved timing/easing, control states, overlays, loading/feedback, navigation, list/detail continuity, and reduced-motion behavior.
- [`../../src/components/ui/utils.ts`](../../src/components/ui/utils.ts) — generic presence and focus/Escape utilities.
- [`../../src/components/ui/overlays.tsx`](../../src/components/ui/overlays.tsx) — token-based dialog, drawer, popover, menu, and toast behavior.
- [`../../src/components/layout/primitives.tsx`](../../src/components/layout/primitives.tsx) — generic `MotionList`, `MotionListItem`, and master/detail continuity.
- [`../../src/showcase/ComponentShowcase.tsx`](../../src/showcase/ComponentShowcase.tsx) — interaction/motion states, controls, menus, overlays, loading, feedback, navigation, and reduced-motion preview.

## PHASE 1F product-facing implementation

- [`PRODUCT_SURFACE_IMPLEMENTATION.md`](PRODUCT_SURFACE_IMPLEMENTATION.md) — route map, onboarding/Today behavior, local-only state boundary, applicable UX states, accessibility contract, validation, and non-goals.
- [`../../src/components/product/`](../../src/components/product/) — product-facing onboarding and Today experiences.
- [`../../src/styles/product.css`](../../src/styles/product.css) — product composition and responsive styling using existing tokens.
- [`../../src/components/product/product.test.tsx`](../../src/components/product/product.test.tsx) — onboarding progression and in-memory Today task behavior coverage.
- [`../../src/app/page.tsx`](../../src/app/page.tsx) and [`../../src/app/today/page.tsx`](../../src/app/today/page.tsx) — Today launch and explicit routes.
- [`../../src/app/onboarding/page.tsx`](../../src/app/onboarding/page.tsx) — focused onboarding route.

The shell, layout, and interaction/motion systems remain reusable and domain-agnostic. PHASE 1F composes them into bounded product workflows without adding product persistence, data access, backend services, authentication, integrations, fake server behavior, or PHASE 1G work. `/showcase` remains a development-only design-system reference and is not the product surface.
