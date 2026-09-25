# Dayly Architecture Decision Index

**Purpose:** Navigation index for decisions already approved in PHASE 0A–0D and for future ADRs.

> This index does not replace the approved source documents. It records source references and summaries without inventing historical ADR files or claiming decisions that were not approved.

## Approved phase decision references

| ID | Decision area | Status | Canonical source | Approved commit |
|---|---|---|---|---|
| ADR-001 | Product foundation, MVP boundary, domain boundaries, AI/non-goals | Approved before PHASE 0B | [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md) | `b4d64a05b6fd4e531c32b789337f8777aa3b8315` |
| ADR-002 | Today-first information architecture, navigation, screen map, UX flows | Approved before PHASE 0C | [`docs/ux/`](../ux/) | `5673ce5ac4986b2d168f7680bae168fbbbc29ceb` |
| ADR-003 | Domain model, logical persistence, ownership, lifecycle, constraints | Approved before PHASE 0D | [`docs/architecture/DOMAIN_MODEL.md`](../architecture/DOMAIN_MODEL.md) and related data architecture docs | `1e0b253268aaf6a886f75b61717d5ae1cd33b6e9` |
| ADR-004 | Provider-neutral integration boundaries, calendar sync, NutriTrack boundary | Approved before PHASE 0E | [`docs/architecture/INTEGRATION_ARCHITECTURE.md`](../architecture/INTEGRATION_ARCHITECTURE.md) and related integration docs | `81a34109eb0e2a97ee5c9e42424bdd966f42c4f9` |

These entries are phase decision references, not newly authored historical records. If a decision is superseded, create a new ADR with context, alternatives, consequences, and a link to the material it replaces.

## Current PHASE 0E contract references

The technical specification is being established in:

- [`TECHNICAL_SPEC.md`](../architecture/TECHNICAL_SPEC.md)
- [`PROJECT_STRUCTURE.md`](../architecture/PROJECT_STRUCTURE.md)
- [`API_CONVENTIONS.md`](../architecture/API_CONVENTIONS.md)
- [`ERROR_HANDLING.md`](../architecture/ERROR_HANDLING.md)
- [`SECURITY_MODEL.md`](../architecture/SECURITY_MODEL.md)
- [`ENVIRONMENT.md`](../architecture/ENVIRONMENT.md)
- [`OBSERVABILITY.md`](../architecture/OBSERVABILITY.md)
- [`PERFORMANCE.md`](../architecture/PERFORMANCE.md)
- [`ACCESSIBILITY.md`](../architecture/ACCESSIBILITY.md)
- [`TESTING_STRATEGY.md`](../architecture/TESTING_STRATEGY.md)
- [`ENGINEERING_RULES.md`](../architecture/ENGINEERING_RULES.md)

PHASE 0E technical choices are contract documentation for implementation and are not represented as approved historical phase commits until this phase is reviewed.

## Future ADR format

```text
# ADR-NNN — Short decision title

Status: Proposed | Accepted | Superseded | Rejected
Date: YYYY-MM-DD

## Decision

## Context

## Options considered

## Reason

## Trade-offs and consequences

## Affected boundaries

## Source references
```

## ADR rules

- Do not create an ADR for an obvious local implementation detail unless it affects a boundary or future compatibility.
- Do not rewrite an accepted ADR; create a superseding record.
- Link decisions to product/UX/domain/integration sources.
- Mark unresolved choices as Proposed or Open rather than Accepted.
- Keep secrets, credentials, personal data, and provider payloads out of ADRs.
