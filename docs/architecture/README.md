# Dayly Architecture Documentation

**Current phase:** PHASE 0C — Domain Model & Database Architecture
**Status:** In progress

The architecture documentation defines Dayly's conceptual domains, logical persistence boundaries, ownership model, lifecycle expectations, constraints, indexing strategy, RLS direction, and migration discipline. It does not create database tables, SQL, migrations, application code, authentication, or integrations.

- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — core entities, relationships, derived concepts, and domain boundaries.
- [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md) — logical persistence blueprint and conceptual record attributes; not a physical schema.
- [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md) — source-of-truth matrix and NutriTrack/external calendar boundaries.
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) — lifecycle transitions, archive/delete behavior, and retention expectations.
- [`DATA_CONSTRAINTS.md`](DATA_CONSTRAINTS.md) — integrity constraints, indexing strategy, RLS model, and migration strategy.

Open questions are intentionally documented rather than encoded as implementation decisions. PHASE 0D — Integrations Architecture must not begin until PHASE 0C is reviewed and explicitly approved.