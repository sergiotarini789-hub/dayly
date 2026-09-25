# Dayly Engineering Rules

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md), [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md), [`TESTING_STRATEGY.md`](TESTING_STRATEGY.md), [`SECURITY_MODEL.md`](SECURITY_MODEL.md)

> These rules are the engineering contract for future implementation. They do not create application code, configuration, dependencies, migrations, or CI workflows.

## 1. Scope rule

Implement only approved product/UX/domain behavior. When a requirement is unclear:

1. locate the current source-of-truth document;
2. identify the ambiguity or contradiction;
3. record an ADR or update the relevant specification;
4. do not silently create a new product domain or provider behavior.

The MVP boundary remains the product specification. Integrations, AI, team collaboration, and experimental features do not enter implementation by convenience.

## 2. Architecture rules

- Follow Presentation → Application Services → Domain → Repositories/Infrastructure → External Services.
- Keep Next.js/React/Supabase/provider details out of pure Domain logic.
- Use application services for use-case orchestration, authorization, validation, transactions, and cache invalidation.
- Keep repositories/data access out of UI components and feature presentation.
- Keep provider adapters behind normalized integration capabilities.
- Avoid circular module dependencies; cross-module workflows use application services or neutral ports.
- Preserve source ownership and provenance.
- Derived views are never alternate editable sources.
- A technical shortcut that crosses a domain boundary requires documented review.

## 3. Type and validation rules

- TypeScript strict mode is mandatory.
- Do not use `any` unless a localized exception includes a reason and safe conversion.
- Use `unknown` for untrusted input until runtime-validated.
- Validate requests, form data, query params, webhooks, provider payloads, environment variables, and database-bound values.
- Use discriminated unions for lifecycle/operation states where they make invalid states harder to represent.
- Keep domain types, DTOs, persistence records, and provider records distinct when their meaning differs.
- Prefer branded/opaque IDs for identifiers that must not be mixed.
- Do not duplicate types with incompatible definitions; map explicitly at boundaries.
- Use the approved strongly typed runtime validation approach, with Zod as the default choice unless an ADR changes it.

## 4. Data and API rules

- All persistence access goes through server-only repositories/application services.
- Supabase client details do not leak into Domain/Presentation.
- RLS is required in addition to application authorization.
- Mutations use explicit ownership checks and safe concurrency behavior.
- List queries have allowlisted filters/sorts, bounded limits, deterministic ordering, and appropriate pagination.
- Public HTTP contracts are versioned and documented; Server Actions are not a replacement for webhooks/public APIs.
- Errors use the normalized taxonomy and never expose stack traces, SQL, tokens, or private payloads.
- Persist UTC/instant values unambiguously and preserve IANA timezone/local date semantics.
- Never store derived flags or progress as authoritative source facts without a documented performance decision.

### 4.1 Migration and seed rules

- Future Supabase migration files use an ordered timestamp plus a short descriptive name, such as `YYYYMMDDHHMMSS_add_task_schedule_blocks.sql`.
- Migrations are reviewed for ownership, RLS, indexes, data backfill, performance, rollback/recovery, and deployment order before merge.
- Prefer additive expand → backfill/validate → switch → contract changes; do not drop/rename production data in one unreviewed step.
- Production migrations run through a controlled release process with backups/recovery and explicit destructive-change approval.
- Rollback plans must account for data written under the new shape; a forward corrective migration may be safer than reversing a destructive change.
- Development fixtures are synthetic, resettable, and never production exports.
- Test fixtures are isolated and deterministic.
- Reference data is versioned/idempotent and safe to apply repeatedly.
- Production seed data is limited to approved reference/configuration data; no demo users, sample personal records, provider credentials, or fake health data.
- Migration/seed output must not print secrets or sensitive payloads.

## 5. Security rules

- Authentication proves identity; authorization determines access.
- Never expose service-role keys, provider secrets, refresh tokens, webhook secrets, or encryption keys to the browser.
- Never commit secrets, `.env.local`, private keys, dumps, or real credentials.
- Validate and sanitize all external/user input and output context.
- Use safe cookies/session/CSRF/CORS/security-header behavior when authentication is implemented.
- Verify OAuth callback state/nonce/redirect assumptions and webhook signatures/replay windows.
- Minimize and protect nutrition/health/calendar data.
- Redact sensitive values from logs, errors, analytics, screenshots, and fixtures.
- Report security issues through a private channel rather than a public issue.

## 6. UX and accessibility rules

- Treat loading, empty, populated, error, offline, permission, no-results, first-use, and success states as part of the feature.
- Preserve user input on recoverable errors.
- Use semantic HTML, keyboard access, visible focus, accessible names, WCAG 2.2 AA target, and text alternatives to color/drag/charts.
- Mobile is a deliberate composition, not a shrunken desktop view.
- Keep Today action-oriented and preserve Task/Event/Habit/Focus distinctions.
- Do not make drag, swipe, hover, or keyboard shortcut the only route to an action.
- Do not make health context or integration setup required for core Dayly use.

## 7. Dependency policy

Before adding a dependency:

1. confirm the capability cannot be provided by the approved stack/platform or a small local utility;
2. evaluate maintenance, license, security history, bundle/server cost, TypeScript quality, and transitive dependencies;
3. confirm it does not duplicate an existing library;
4. define whether it belongs in client, server, test, or build scope;
5. document material decisions in an ADR/PR;
6. pin/lock the resolved version and remove it if unused.

Do not install dependencies during documentation phases. Provider SDKs, state libraries, chart libraries, date libraries, and rich-text libraries each require explicit justification.

## 8. Git and branch strategy

### Branches

```text
main        protected, releasable history
 develop     shared integration branch when the team uses one
feature/*   additive feature work
fix/*        bug/security fixes
chore/*      maintenance/tooling/documentation work
```

- Pull requests are required before merging to protected branches.
- `main` must remain buildable and reviewed.
- `develop` is optional when a small team can safely merge reviewed work directly to `main`; if used, it must not become an unreviewed dumping ground.
- Branch names communicate intent, not implementation ownership.

### Commits

- Use Conventional Commit style: `type(scope): summary` where useful.
- Keep commits small and logically reversible.
- Do not mix unrelated features, migrations, formatting churn, or generated artifacts.
- Documentation phases should use one clean commit when the phase instruction requires it.
- Rebase/update a topic branch before merge when needed to resolve conflicts; do not rewrite protected shared history.
- Squash a PR when individual commits are exploratory/noisy and the repository convention prefers a single reviewed unit. Preserve separate commits when each is a meaningful, independently reviewed migration or fix.
- Never commit secrets, generated build output, local caches, or large data unless explicitly justified.

## 9. CI/CD contract

The future pull-request pipeline should run:

```text
Pull Request
    ↓
Lint/format checks
    ↓
Typecheck
    ↓
Unit tests
    ↓
Component/integration tests
    ↓
Production build
    ↓
E2E where appropriate
    ↓
Review
    ↓
Merge
```

- Fail fast on type/lint/test errors.
- Keep CI deterministic and isolated from production.
- Use least-privilege CI secrets only for jobs that need them.
- Do not run destructive migrations or provider writes from ordinary PR validation.
- Release/deploy workflow requires a reviewed main commit and documented rollback.

No CI workflow is created in Phase 0E.

## 10. Documentation and ADR rules

Document:

- product/domain changes in the product source documents;
- cross-cutting technical choices in ADRs;
- API changes with request/response/error/authorization behavior;
- migrations with impact, rollout, rollback, and destructive-change review;
- integrations with ownership, permissions, sync, errors, and provider verification;
- breaking changes with migration/communication guidance;
- unresolved choices explicitly instead of hiding them in code.

Use the ADR index in `docs/decisions/ADR_INDEX.md`. A decision record should contain Decision, Context, Reason, Trade-offs, Status, and source references. Do not create historical records that claim a decision was approved when the source documents do not support it.

## 11. Feature development contract

Every future feature follows:

```text
Specification
    ↓
Architecture/ownership review
    ↓
Implementation
    ↓
Unit tests
    ↓
Integration/component tests
    ↓
UX/accessibility verification
    ↓
Build and performance check
    ↓
Security/error review
    ↓
Documentation
    ↓
Review
    ↓
Commit
```

A feature is not complete because it renders a successful path.

## 12. Reusable Definition of Done

A future Dayly feature is done only when:

- approved requirements and domain boundaries are satisfied;
- module dependencies remain acyclic and documented;
- strict TypeScript/typecheck passes;
- runtime validation exists at trust boundaries;
- unit tests cover domain/risk-critical rules;
- integration/component/E2E coverage exists where the risk warrants it;
- loading, empty, error, offline, permission, no-results, and success states are addressed;
- accessibility meets the project target and keyboard/screen-reader paths are checked;
- mobile/tablet/desktop behavior follows the UX contract;
- authorization, RLS, secrets, input/output safety, and audit implications are reviewed;
- performance/query/pagination behavior is acceptable on realistic data;
- documentation/API/migration/integration notes are current;
- no secrets, unexplained dependencies, generated artifacts, or unrelated scope are included;
- build and CI checks pass;
- the change has been reviewed and committed cleanly.

## 13. Phase boundary

These rules do not authorize PHASE 1 Design System or any application implementation within PHASE 0E.
