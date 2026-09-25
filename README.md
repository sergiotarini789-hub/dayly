# Dayly

Dayly is a personal productivity platform designed to help a user understand the day, decide what matters, allocate time, execute tasks, and review progress. It brings together tasks, projects, Dayly planning, habits, focus sessions, analytics, and carefully governed context from future integrations such as NutriTrack and external calendars.

## Current phase

**PHASE 1D — Layout System & Application Shell**

**Status: IN PROGRESS**

PHASE 1A visual direction, PHASE 1B design tokens, and PHASE 1C core components are complete. The repository now contains the token-driven core UI system plus a structural application shell, responsive navigation model, page containers, generic layout primitives, panels, master/detail and calendar foundations, and a development-only showcase. No product functionality, feature data, business logic, database, API routes, authentication, or integrations have been implemented.

## Source of truth

- [Product specification](PRODUCT_SPEC.md)
- [Project state](PROJECT_STATE.md)
- [UX architecture, visual direction, token, component, and layout documentation](docs/ux/)
- [Design-token CSS foundation](src/styles/tokens.css)
- [Application shell and layout implementation](src/components/layout/)
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
9. **PHASE 1D — Layout System & Application Shell** — in progress.
10. **PHASE 1E — Interaction & Motion** — not started.

## Project status

Dayly is in structural application implementation. PHASE 1D establishes the shell and layout system only. The development-only `/showcase` route demonstrates representative placeholder layouts and core components; it is not a production dashboard. See [`PROJECT_STATE.md`](PROJECT_STATE.md) for the current phase and approval rule.
