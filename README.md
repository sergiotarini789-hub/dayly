# Dayly

Dayly is a personal productivity platform designed to help a user understand the day, decide what matters, allocate time, execute tasks, and review progress. It brings together tasks, projects, Dayly planning, habits, focus sessions, analytics, and carefully governed context from future integrations such as NutriTrack and external calendars.

## Current phase

**PHASE 1F — Product-facing onboarding & Today preview**

**Status: COMPLETE**

PHASE 1A visual direction, PHASE 1B design tokens, PHASE 1C core components, PHASE 1D layout foundations, and PHASE 1E interaction/motion foundations are complete. PHASE 1F composes those foundations into a cohesive frontend-only product surface: `/` and `/today` provide Today, while `/onboarding` provides a short welcome, planning context, optional profile, and optional first-task flow. Onboarding and Today interactions use local React state only and explicitly disclose that preview values are temporary. No backend, database, authentication, integrations, persistence, or fake server functionality is included.

## Source of truth

- [Product specification](PRODUCT_SPEC.md)
- [Project state](PROJECT_STATE.md)
- [UX architecture, visual direction, token, component, layout, and product surface documentation](docs/ux/)
- [Design-token CSS foundation](src/styles/tokens.css)
- [Application shell and layout implementation](src/components/layout/)
- [Product surface implementation](src/components/product/)
- [Domain, integration, and technical architecture](docs/architecture/)
- [Architecture decision index](docs/decisions/ADR_INDEX.md)

The approved documentation defines the MVP boundary, user journeys, information architecture, domain model, ownership boundaries, integration contracts, technology stack, repository structure, security model, testing strategy, engineering rules, and visual language direction.

## Approved technology direction

Future implementation is contractually based on Next.js 15 App Router, TypeScript, Tailwind CSS v4, Supabase/PostgreSQL, Supabase Auth, Supabase Realtime where justified, runtime validation, Vitest, React Testing Library, and Playwright. See [`docs/architecture/TECHNICAL_SPEC.md`](docs/architecture/TECHNICAL_SPEC.md) for engineering boundaries and [`docs/ux/DESIGN_TOKENS.md`](docs/ux/DESIGN_TOKENS.md) for the token integration contract.

## Roadmap

1. **PHASE 0A — Product Foundation & Specification** — completed and approved.
2. **PHASE 0B — UX Architecture & Information Architecture** — completed and approved.
3. **PHASE 0C — Domain Model & Database Architecture** — completed and approved.
4. **PHASE 0D — Integration Architecture** — completed and approved.
5. **PHASE 0E — Technical Specification & Engineering Contract** — completed and approved.
6. **PHASE 1A — Visual Direction & Design Language** — completed and reviewed.
7. **PHASE 1B — Design Tokens & Theme Foundation** — completed.
8. **PHASE 1C — Core Components** — completed.
9. **PHASE 1D — Layout System & Application Shell** — completed.
10. **PHASE 1E — Interaction & Motion** — completed.
11. **PHASE 1F — Product-facing onboarding & Today preview** — completed.
12. **PHASE 1G** — not started; scope requires explicit approval.

## Project status

Dayly now has a bounded product-facing preview while the development-only `/showcase` route remains a separate design-system reference and is not the product. The Today surface supports first-use guidance, title-only in-memory task capture, explicit completion/reopen behavior, planning-context entry points, and clear local-state disclosure. Onboarding supports welcome, planning preferences, optional display name, and first-task-or-do-later flow. See [`PROJECT_STATE.md`](PROJECT_STATE.md) for the phase and approval rule.
