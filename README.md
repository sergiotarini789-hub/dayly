# Dayly

Dayly is a personal productivity platform designed to help a user understand the day, decide what matters, allocate available time, execute tasks, and review progress. It brings together tasks, projects, Dayly planning, habits, focus sessions, analytics, and carefully governed context from future integrations such as NutriTrack and external calendars.

## Current phase

**PHASE 0A — Product Foundation & Specification**

**Status: IN PROGRESS**

This repository currently contains product documentation only. No application UI, Next.js application, database schema, authentication, integration, or unnecessary dependency has been implemented.

## Source of truth

- [Product specification](PRODUCT_SPEC.md)
- [Project state](PROJECT_STATE.md)
- [Documentation structure](docs/)

The product specification defines the MVP boundary, core journeys, product modules, task and calendar concepts, data ownership boundaries, and future direction.

## Architecture direction

Future development should preserve explicit boundaries between Dayly-owned productivity domains, NutriTrack, and external calendar providers. Tasks, projects, scheduling, habits, focus, notifications, analytics, search, and integrations should interact through clear product and application responsibilities rather than becoming one tightly coupled record model. Implementation choices will be documented in later architecture decisions; this phase does not prescribe a framework, database, or deployment design.

## Roadmap

1. **PHASE 0A — Product Foundation & Specification** — define the product, scope, journeys, principles, and domain boundaries.
2. **PHASE 0B — UX Architecture** — begin only after PHASE 0A has been reviewed and explicitly approved.
3. Future phases — architecture, implementation, validation, and integrations will be defined after the relevant documentation is approved.

## Project status

The repository is intentionally documentation-only during PHASE 0A. See [`PROJECT_STATE.md`](PROJECT_STATE.md) for the current phase and approval rule.
