# Dayly

Dayly is a personal productivity platform designed to help a user understand the day, decide what matters, allocate available time, execute tasks, and review progress. It brings together tasks, projects, Dayly planning, habits, focus sessions, analytics, and carefully governed context from future integrations such as NutriTrack and external calendars.

## Current phase

**PHASE 0E — Technical Specification & Engineering Contract**

**Status: IN PROGRESS**

The repository currently contains product, UX, domain, integration, and technical architecture documentation only. No application UI, Next.js application, database schema, migrations, authentication, integrations, or unnecessary dependencies have been implemented.

## Source of truth

- [Product specification](PRODUCT_SPEC.md)
- [Project state](PROJECT_STATE.md)
- [UX architecture](docs/ux/)
- [Domain and integration architecture](docs/architecture/)
- [Architecture decision index](docs/decisions/ADR_INDEX.md)

The approved documentation defines the MVP boundary, user journeys, information architecture, domain model, ownership boundaries, integration contracts, technical stack, repository structure, security model, testing strategy, and engineering rules.

## Approved technology direction

Future implementation is contractually based on Next.js 15 App Router, TypeScript, Tailwind CSS v4, Supabase/PostgreSQL, Supabase Auth, Supabase Realtime where justified, runtime validation, Vitest, React Testing Library, and Playwright. See [`docs/architecture/TECHNICAL_SPEC.md`](docs/architecture/TECHNICAL_SPEC.md) for boundaries and the rest of the technical contract.

## Roadmap

1. **PHASE 0A — Product Foundation & Specification** — completed and approved.
2. **PHASE 0B — UX Architecture & Information Architecture** — completed and approved.
3. **PHASE 0C — Domain Model & Database Architecture** — completed and approved.
4. **PHASE 0D — Integration Architecture** — completed and approved.
5. **PHASE 0E — Technical Specification & Engineering Contract** — in progress.
6. **PHASE 1 — Design System** — begins only after PHASE 0E has been reviewed and explicitly approved.

## Project status

Dayly remains pre-implementation. PHASE 0E defines the final engineering contract; it does not authorize application development or automatically start PHASE 1. See [`PROJECT_STATE.md`](PROJECT_STATE.md) for the current phase and approval rule.
