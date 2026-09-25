# Dayly Architecture Documentation

**Current phase:** PHASE 0D — Integration Architecture
**Status:** In progress

The architecture documentation defines Dayly's conceptual domains, logical persistence boundaries, ownership model, lifecycle expectations, constraints, and provider-neutral integration architecture. It does not implement OAuth, provider connections, synchronization, database migrations, application code, authentication, or UI.

## Domain and data architecture

- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — core entities, relationships, derived concepts, and domain boundaries.
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — logical persistence blueprint and conceptual record attributes; not a physical schema.
- [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md) — source-of-truth matrix and external ownership boundaries.
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) — lifecycle transitions, archive/delete behavior, and retention expectations.
- [`DATA_CONSTRAINTS.md`](DATA_CONSTRAINTS.md) — integrity constraints, indexing strategy, RLS model, and migration strategy.

## Integration architecture

- [`INTEGRATION_ARCHITECTURE.md`](INTEGRATION_ARCHITECTURE.md) — provider-neutral layers, connection lifecycle, security, idempotency, observability, and rollout.
- [`CALENDAR_SYNC_MODEL.md`](CALENDAR_SYNC_MODEL.md) — calendar ownership, import/export, identity, sync, recurrence, and conflict model.
- [`NUTRITRACK_INTEGRATION.md`](NUTRITRACK_INTEGRATION.md) — read-oriented NutriTrack boundary, consent, minimization, freshness, and deletion considerations.
- [`AUTH_INTEGRATION_MODEL.md`](AUTH_INTEGRATION_MODEL.md) — conceptual identity, account, session, integration connection, and token boundaries.
- [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md) — sync states, error categories, retry safety, degradation, observability, and future testing.

Open questions are intentionally documented rather than encoded as implementation decisions. PHASE 0E — Technical Specification must not begin until PHASE 0D is reviewed and explicitly approved.