# Dayly Error Handling Contract

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`API_CONVENTIONS.md`](API_CONVENTIONS.md), [`SECURITY_MODEL.md`](SECURITY_MODEL.md), [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md)

> This document defines normalized error behavior. It does not implement error classes, middleware, logging, or UI.

## 1. Error-handling goals

Dayly errors should be:

- predictable for domain/application callers;
- safe for users and clients;
- useful for recovery;
- observable with a correlation ID;
- isolated from secrets, SQL, stack traces, and private provider payloads;
- explicit about retryability and user action;
- consistent across Server Components, Server Actions, Route Handlers, jobs, and integrations.

## 2. Error taxonomy

| Error | Meaning | User-facing treatment | Retryability |
|---|---|---|---|
| `ValidationError` | Input is missing, malformed, out of range, or unsupported. | Show safe field/summary guidance; preserve input. | No until input changes. |
| `AuthenticationError` | No valid authenticated actor/session. | Ask the user to authenticate or retry session recovery. | Usually no automatic retry. |
| `AuthorizationError` | Actor is authenticated but cannot perform/read the action. | Explain lack of access without revealing protected data. | No unless permission changes. |
| `NotFoundError` | Resource is unavailable in the actor's allowed scope. | Safe not-found message and return path. | No. |
| `ConflictError` | Stale version, ownership conflict, duplicate/idempotency conflict, or sync conflict. | Explain conflict and offer refresh/resolve/retry. | Not blindly. |
| `RateLimitError` | Request or provider quota limit reached. | Show temporary degradation/retry guidance. | Yes with bounded backoff. |
| `ExternalServiceError` | External service failed or is unavailable. | Keep core Dayly usable; show stale/degraded state. | Usually bounded retry. |
| `IntegrationError` | Adapter, normalization, capability, token, or sync failure. | Show source/connection action required when relevant. | Category-specific. |
| `DatabaseError` | Persistence/transaction failure. | Generic safe failure with retry if safe. | Only when operation is safe/idempotent. |
| `UnknownError` | Unexpected failure with no safe classification. | Generic error plus request ID. | Conservative; alert/diagnose. |

A provider-specific error maps to a normalized category at the integration boundary. Domain code does not parse provider error strings.

## 3. Error shape

Application services return a typed result or throw a normalized internal error that is mapped at the boundary. A public error response uses:

```text
{
  error: {
    code: "STABLE_MACHINE_CODE",
    message: "Safe user-facing message",
    requestId: "opaque-correlation-id",
    retryable: false,
    fields: [],
    action: "optional safe next action"
  }
}
```

- Stable `code` is for client behavior and tests.
- `message` must not contain secrets, SQL, provider tokens, or internal stack details.
- `requestId` connects user feedback to structured logs.
- `fields` contains safe field names and validation/conflict hints only.
- `action` is a safe product action such as `retry`, `reauthorize`, `refresh`, or `resolve_conflict`.

Internal logs may carry more diagnostic classification, but not sensitive payloads by default.

## 4. Layer responsibilities

### Domain

Returns domain errors for invalid state transitions, invalid values, and business rule violations. It does not know HTTP status codes, React, Supabase, or provider errors.

### Application services

Resolve actor/authorization, classify repository/integration failures, choose transaction/retry behavior, and map domain errors to safe application results.

### Repositories/infrastructure

Translate database/client failures into `DatabaseError`, `NotFoundError`, `ConflictError`, or a more specific safe category. Do not leak Supabase/PostgreSQL response objects.

### Integrations

Translate provider authentication, permission, rate, network, invalid-data, conflict, and unknown failures into `IntegrationError` metadata using the model in `SYNC_ERROR_MODEL.md`.

### Presentation/API boundaries

Map errors to accessible UI states or HTTP semantics. Preserve entered data on recoverable form failure. Never render raw exception messages.

## 5. User-facing behavior

- Loading and error states are separate.
- Partial failures identify the affected section/provider while keeping unaffected Dayly data usable.
- A failed mutation does not optimistically leave a false success state.
- A retry action is shown only when retry can help.
- A conflict offers refresh/review/resolve rather than blind overwrite.
- A not-found state does not reveal whether another User's record exists.
- Integration errors show source, freshness, and reconnect/retry guidance without provider payloads.
- Destructive actions report whether the source was changed, pending, or failed.
- Offline/stale states distinguish cached known data from unsaved changes.

## 6. Retry rules

Retry only when:

- the error is classified transient or provider-rate-limited;
- the operation is idempotent or protected by a valid idempotency key;
- the retry budget is not exhausted;
- retry will not repeat an unsafe external side effect.

Use bounded exponential backoff with jitter for future background work. Respect provider retry hints. Do not retry authentication/authorization/invalid-data/conflict errors indefinitely.

## 7. Logging and redaction

Every unexpected or operationally meaningful error includes:

- request/operation/correlation ID;
- normalized category and stable code;
- User/connection scope only where safe;
- route/use-case/provider capability;
- retryability and attempt metadata;
- duration and outcome.

Never log passwords, access tokens, refresh tokens, authorization codes, raw cookies, SQL with user data, sensitive nutrition payloads, or unnecessary private event contents.

## 8. Error boundaries and recovery

- Route-level Error Boundaries protect a page without hiding unaffected navigation.
- Component-level error states are used for independent Today sections or analytics widgets.
- Not-found boundaries are distinct from unexpected errors.
- Server errors are correlated and sanitized before reaching clients.
- A failed initial load provides retry and a stable shell.
- A failed save keeps the user's draft when safe.
- A failed background integration operation updates connection health without making the request that triggered it appear successful.

## 9. Tests required later

- each domain transition maps to expected safe error code;
- unauthorized/not-found behavior does not leak cross-user data;
- validation errors preserve input and field details;
- stale-write conflicts are detectable and recoverable;
- retries stop at the budget and do not duplicate side effects;
- provider errors map to normalized categories;
- secrets/private payloads are absent from logs and responses;
- partial failures preserve independent successful work.

## 10. Phase boundary

No error class, handler, middleware, logger, retry implementation, API, or UI state was created.
