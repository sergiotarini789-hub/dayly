# Dayly Testing Strategy

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md), [`ENGINEERING_RULES.md`](ENGINEERING_RULES.md), [`SECURITY_MODEL.md`](SECURITY_MODEL.md)

> This document defines future testing responsibilities and quality gates. It does not create tests, install test dependencies, or configure CI.

## 1. Testing goals

Testing should protect the highest-risk Dayly behavior:

- task lifecycle and explicit completion;
- deadline versus Schedule Block semantics;
- project/task relationships;
- habit occurrence and streak behavior;
- Focus actual-duration calculations without task auto-completion;
- Today composition and partial failure;
- User ownership/RLS/authorization;
- time zones, date-only values, recurrence, and DST;
- integration idempotency, errors, conflicts, and provenance;
- accessibility and responsive critical journeys.

Coverage is risk-driven. Dayly will not set an arbitrary percentage target for the entire repository. A high percentage can still miss ownership, time, or integration failures; a lower percentage may be reasonable for thin adapters or presentational composition when critical behavior is covered another way.

## 2. Testing pyramid

```text
             End-to-end
            /          \
       Integration / Contract
          /              \
       Unit / Component tests
```

- Many fast unit tests for pure rules and validation.
- A focused component layer for user-observable interaction.
- Integration tests for repositories, RLS, application services, and transaction behavior.
- Contract tests for normalized provider adapters and future NutriTrack/calendar boundaries.
- A small number of stable Playwright tests for critical end-to-end journeys.

Avoid using E2E tests to cover every validation branch or every presentational variant.

## 3. Unit tests

Use Vitest for:

- Task lifecycle transitions and derived conditions;
- parent/subtask constraints and project membership rules;
- deadline/overdue and Schedule Block semantics;
- recurrence/occurrence generation and streak/consistency calculations;
- Focus duration, pause, interruption, and orphan-session behavior;
- notification trigger/state rules;
- analytics metric definitions and missing-data treatment;
- pagination/filter/sort validation;
- time-zone/date-only/DST utilities;
- error classification, retry/backoff, idempotency, and redaction;
- authorization decision helpers that do not require a database.

Unit tests must be deterministic and use injected clocks/time-zone fixtures rather than the machine's current time.

## 4. Component tests

Use React Testing Library for user-observable behavior:

- Quick Add task with title-only creation and progressive disclosure;
- task completion/reopen feedback;
- schedule/reschedule conflict presentation;
- Project empty/populated/archive states;
- Habit occurrence completion and streak explanation;
- Focus start/pause/resume/finish review;
- Today primary/secondary/contextual hierarchy and partial failure;
- Search query/no-results/filter behavior;
- Settings/notification forms and errors;
- dialogs, bottom sheets, command palette alternatives, and focus management;
- keyboard and accessible-name behavior for critical controls.

Tests should query by role, label, text, or accessible state rather than private class names or component implementation.

## 5. Integration tests

Integration tests cover the boundary between application services and infrastructure:

- repository mapping and query filters;
- PostgreSQL constraints and transactions after migrations exist;
- RLS same-user/cross-user/anonymous/service-operation behavior;
- optimistic concurrency and conflict errors;
- pagination stability;
- auth actor resolution and authorization;
- cache invalidation/revalidation;
- notification persistence and read/handled state;
- integration connection state without real provider credentials.

Use isolated test data and deterministic cleanup. Never run integration tests against production.

## 6. Contract tests

Future provider contract tests validate:

- adapter capability declarations;
- provider identity and scope mapping;
- normalized events, recurring/all-day/time-zone behavior;
- cursors/checkpoints and deletion/tombstone semantics;
- idempotent replay and duplicate webhooks;
- rate-limit and error classification;
- NutriTrack summary normalization, units, periods, freshness, and provenance;
- disconnect/revocation behavior.

Use provider sandbox/test accounts where available. For unavailable Apple/server-side or provider capabilities, maintain explicit verification fixtures and do not pretend mocked behavior proves a provider contract.

## 7. End-to-end tests

Use Playwright for a small critical set:

1. first launch/onboarding → first task → completion;
2. project → task → completion → project context;
3. task deadline → schedule → reschedule;
4. Today orientation → complete/focus/replan;
5. habit create → occurrence completion → streak display;
6. Focus start → pause/resume → finish → actual duration without auto-completion;
7. Search → result → source-owned detail;
8. authentication/authorization isolation when implemented;
9. future connection/reconnect/error flows in a controlled sandbox.

E2E tests should assert outcomes and accessibility-relevant behavior, not exact styling or internal network calls.

## 8. Security testing

- RLS cannot read/update another User's records.
- Missing/expired/revoked sessions fail safely.
- Server-only variables never appear in client output.
- OAuth callbacks validate state/nonce/redirect assumptions.
- Webhooks reject invalid signatures/replays.
- Provider scopes and User/connection ownership are enforced.
- Errors/logs redact secrets and sensitive health/calendar data.
- Rate limits prevent obvious abuse paths.
- Input/output validation rejects dangerous or oversized values.

## 9. Time and data fixtures

Maintain reusable synthetic fixtures for:

- users with isolated records;
- tasks in every canonical/derived state;
- parent/child tasks at the allowed depth;
- events around midnight, timezone changes, and DST transitions;
- habits across completed/missed/pause-rule scenarios;
- focus sessions with pauses, interruptions, orphan context, and clock boundaries;
- provider events with recurrence, all-day, deletion, conflict, and stale data;
- partial NutriTrack summaries and invalid units/periods.

Fixtures must contain no real credentials, personal data, or production exports.

## 10. CI/CD test gates

The future pull-request pipeline should run in a stable order:

```text
Pull Request
    ↓
Formatting/lint checks
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
Review and merge
```

Fast deterministic checks should run for every PR. E2E/provider sandbox checks may use an appropriate separate job while still blocking changes to affected critical paths. See [`ENGINEERING_RULES.md`](ENGINEERING_RULES.md) for review/commit rules.

## 11. Test data and environment safety

- Unit/component tests use in-memory/fake repositories or isolated fixtures.
- Integration tests use a dedicated test Supabase/project/database.
- E2E tests use disposable or resettable test users.
- Provider contract tests use sandbox accounts and synthetic data.
- CI secrets are least-privilege and scoped to the job; production secrets are never used.
- A failed cleanup must fail the test job rather than leave shared data silently.

## 12. Phase boundary

No test files, test runner configuration, fixtures, CI workflow, provider sandbox account, or dependency was created.
