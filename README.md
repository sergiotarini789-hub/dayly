# Dayly

Dayly is a personal productivity platform designed to help a user understand the day, decide what matters, allocate time, execute tasks, and review progress. It brings together tasks, projects, Dayly planning, habits, focus sessions, analytics, and carefully governed context from future integrations such as NutriTrack and external calendars.

## Current phase

**PHASE 1B — Design Tokens & Theme Foundation**

**Status: IN PROGRESS**

PHASE 1A visual direction has been completed and reviewed. The repository now contains the shared design-token foundation only: CSS custom properties, light/dark theme mappings, Tailwind CSS v4 semantic utilities, accessibility/focus values, responsive/layer values, and a dependency-free validator. No application UI, feature components, screens, business logic, or unnecessary dependencies have been implemented.

## Source of truth

- [Product specification](PRODUCT_SPEC.md)
- [Project state](PROJECT_STATE.md)
- [UX architecture, visual direction, and token contract](docs/ux/)
- [Design-token CSS foundation](src/styles/tokens.css)
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
7. **PHASE 1B — Design Tokens & Theme Foundation** — in progress.
8. **PHASE 1C — Core Components** — begins only after PHASE 1B has been reviewed and explicitly approved.

## Project status

Dayly remains pre-application implementation. PHASE 1B defines the shared visual foundation only; it does not authorize feature components, application screens, production business logic, or automatically start PHASE 1C. See [`PROJECT_STATE.md`](PROJECT_STATE.md) for the current phase and approval rule.
