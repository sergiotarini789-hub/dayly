# Dayly Observability Contract

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`ERROR_HANDLING.md`](ERROR_HANDLING.md), [`SECURITY_MODEL.md`](SECURITY_MODEL.md), [`PERFORMANCE.md`](PERFORMANCE.md), [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md)

> This document defines future logging, tracing, metrics, and business-event behavior. It does not add an observability provider, logger, dashboard, or application code.

## 1. Observability goals

Dayly should be able to answer:

- Did the request succeed, fail, or partially succeed?
- Which use case/provider operation ran and how long did it take?
- Can a user-safe request ID connect UI feedback to diagnostics?
- Are Tasks, Today, Focus, Habits, and integrations healthy without logging private content?
- Where are performance regressions or retry storms occurring?

Observability must improve reliability without becoming a second copy of user data.

## 2. Structured logging

Future logs use structured events rather than ad hoc text. A safe baseline includes:

- timestamp and environment;
- severity;
- service/module/use case;
- request/correlation/operation ID;
- authenticated User scope only where safe;
- duration/status;
- normalized error code/category;
- provider/capability for integrations;
- retry/attempt/queue metadata;
- records/counts/size summaries where non-sensitive.

Use stable field names and avoid logging full request/response objects by default.

### Never log

- passwords, session secrets, cookies, access tokens, refresh tokens, authorization codes, or private keys;
- raw SQL with user values;
- detailed nutrition/health payloads;
- full calendar descriptions, task descriptions, notes, or arbitrary user content unless a reviewed redacted diagnostic is required;
- provider response bodies by default.

## 3. Correlation and request tracing

- Generate or accept a safe correlation/request ID at the boundary.
- Propagate it through Server Actions, Route Handlers, application services, repository calls, integration operations, jobs, and user-facing error responses.
- A webhook/push signal receives its own operation ID and links to the connection/sync operation without trusting an external correlation value blindly.
- Preserve parent/child operation relationships for a sync batch and record pages.
- Do not include correlation IDs in secrets or external provider identity fields.

## 4. Error tracking

Unexpected errors should be captured with:

- normalized category/code;
- request/operation ID;
- release/build/environment;
- route/use case/module;
- safe stack/context in the error-tracking system;
- User/connection scope only if access is controlled and necessary;
- redacted input shape, not private payload.

Expected validation, auth, not-found, conflict, and user-action errors should not create high-noise unexpected-error alerts.

## 5. Performance metrics

Track aggregate metrics for:

- server render and application query duration;
- database query/transaction duration and failure count;
- API/Server Action latency and status;
- page/route initial response and client hydration where relevant;
- cache hit/miss/stale rates without exposing User data;
- pagination/search/analytics query volume;
- integration sync duration, freshness, record counts, retries, conflicts, and error categories;
- background queue depth/age when jobs exist;
- Web Vitals after the UI exists.

Metrics should be tagged by route/use case/environment and bounded dimensions. Do not tag with arbitrary User IDs or raw content.

## 6. Business events

Useful aggregate business events may include:

- task_created, task_completed, task_reopened;
- project_created, project_archived;
- schedule_block_created, schedule_block_rescheduled;
- habit_created, habit_occurrence_completed;
- focus_session_started, focus_session_completed;
- notification_handled;
- integration_connected, sync_succeeded, sync_failed, conflict_detected.

Business events must:

- be privacy-reviewed and minimized;
- avoid titles/descriptions/health payloads by default;
- use stable event names and versioned properties;
- distinguish product analytics from security/audit events;
- not become an alternate source of truth for domain records.

## 7. Sync observability

Integration operations should report:

- provider/connection/capability;
- operation mode (initial, incremental, reconciliation, manual);
- started/completed moments and duration;
- last successful/attempted sync;
- cursor/checkpoint status without token values;
- imported/exported/updated/deleted/skipped/conflict/error counts;
- normalized error category and retry action;
- connection health and user-action requirement.

See [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md) for retry/error semantics.

## 8. Alerting principles

Alert on aggregate conditions that require action, such as:

- elevated unexpected errors;
- repeated database/transaction failures;
- sustained latency regression;
- integration retry storm or provider outage;
- webhook verification failures;
- queue backlog/age beyond an approved threshold;
- unusual authorization/abuse pattern.

Alerts must avoid including secrets or raw private data and must identify a runbook/correlation path where possible.

## 9. Retention and access

- Keep operational logs only as long as needed for reliability/security/support.
- Restrict production observability access by role.
- Separate security audit retention from noisy application logs.
- Redact or aggregate sensitive values before long-term analytics.
- Define deletion/export treatment for User-linked observability data before production launch.

## 10. Development and test behavior

- Tests can assert emitted event shape/category without contacting production telemetry.
- Local logs are readable but still redacted.
- CI logs never print secrets or full environment values.
- Provider contract tests use synthetic/test payloads.
- A disabled external provider produces an explicit capability/degraded state rather than noisy repeated errors.

## 11. Phase boundary

No logger, error tracker, metrics backend, alert, dashboard, business-event emitter, or application code was created.
