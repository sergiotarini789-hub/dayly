# Dayly Architecture Documentation

**Current phase:** PHASE 0E — Technical Specification & Engineering Contract
**Status:** In progress

The architecture documentation defines Dayly's conceptual domains, logical persistence boundaries, ownership model, lifecycle expectations, constraints, provider-neutral integration architecture, and final pre-implementation engineering contract. It does not implement Next.js, database tables, migrations, authentication, integrations, production UI, or dependencies.

## Domain and data architecture

- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — core entities, relationships, derived concepts, and domain boundaries.
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — logical persistence blueprint and conceptual record attributes; not a physical schema.
- [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md) — source-of-truth matrix and external ownership boundaries.
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) — lifecycle transitions, archive/delete behavior, and retention expectations.
- [`DATA_CONSTRAINTS.md`](DATA_CONSTRAINTS.md) — integrity constraints, indexing strategy, RLS model, and migration strategy.

## Integration architecture

- [`INTEGRATION_ARCHITECTURE.md`](INTEGRATION_ARCHITECTURE.md) — provider-neutral layers, connection lifecycle, security, idempotency, observability, and rollout.
- [`CALENDAR_SYNC_MODEL.md`](CALENDAR_SYNC_MODEL.md) — calendar ownership, provider profiles, import/export, identity, sync, recurrence, and conflict model.
- [`NUTRITRACK_INTEGRATION.md`](NUTRITRACK_INTEGRATION.md) — read-oriented NutriTrack boundary, consent, minimization, freshness, and deletion considerations.
- [`AUTH_INTEGRATION_MODEL.md`](AUTH_INTEGRATION_MODEL.md) — conceptual identity, account, session, integration connection, and token boundaries.
- [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md) — sync states, error categories, retry safety, degradation, observability, and future testing.

## Technical specification

- [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md) — approved stack, architectural layers, module boundaries, data access, state, time, and implementation contract.
- [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) — intended Next.js/feature-oriented repository structure.
- [`API_CONVENTIONS.md`](API_CONVENTIONS.md) — Server Components, Server Actions, Route Handlers, validation, responses, errors, pagination, and idempotency.
- [`ERROR_HANDLING.md`](ERROR_HANDLING.md) — normalized error taxonomy, retry behavior, safe exposure, and recovery.
- [`SECURITY_MODEL.md`](SECURITY_MODEL.md) — Auth, authorization, RLS, secrets, input safety, OAuth/webhooks, privacy, and audit.
- [`ENVIRONMENT.md`](ENVIRONMENT.md) — `.env.local`, `.env.example`, public/server-only/secret configuration, and environment separation.
- [`TESTING_STRATEGY.md`](TESTING_STRATEGY.md) — testing pyramid, unit/component/integration/E2E/contract layers, security testing, and CI gates.
- [`OBSERVABILITY.md`](OBSERVABILITY.md) — structured logs, correlation, errors, metrics, business events, and integration health.
- [`PERFORMANCE.md`](PERFORMANCE.md) — rendering, query, caching, pagination, integration, and measurement strategy.
- [`ACCESSIBILITY.md`](ACCESSIBILITY.md) — WCAG 2.2 AA target and implementation requirements.
- [`ENGINEERING_RULES.md`](ENGINEERING_RULES.md) — architecture, type, security, dependency, Git, documentation, feature, and Definition of Done rules.

Open questions are intentionally documented rather than encoded as implementation decisions. PHASE 1 — Design System must not begin until PHASE 0E is reviewed and explicitly approved.
