# Dayly API and Server Boundary Conventions

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md), [`ERROR_HANDLING.md`](ERROR_HANDLING.md), [`SECURITY_MODEL.md`](SECURITY_MODEL.md)

> This document defines future API/action conventions. It does not create endpoints, handlers, schemas, or production code.

## 1. Boundary selection

### Server Components

Use Server Components for read-oriented route composition and initial data loading when:

- the data is User-scoped and can be fetched server-side;
- the page does not need browser event handlers for the read itself;
- rendering should avoid a client-side loading waterfall.

Server Components call application query services directly. They do not call the same application's public HTTP endpoint through localhost or a browser loopback.

### Client Components

Use Client Components only for interaction requiring browser state/events, such as form controls, dialogs, drag alternatives, timers, keyboard shortcuts, and optimistic feedback. They receive typed data/actions and do not create direct database/provider clients.

### Server Actions

Use Server Actions for authenticated, UI-originated mutations that are internal to Dayly and have a clear form/use-case boundary. Actions must:

- validate input at runtime;
- resolve the authenticated User;
- authorize the specific record/action;
- call an application service;
- return a typed success/error result;
- revalidate affected views;
- never expose secrets or raw database errors.

Server Actions are not a substitute for public APIs, provider webhooks, or long-running jobs.

### Route Handlers

Use Route Handlers for:

- versioned HTTP APIs for non-UI clients;
- provider OAuth callbacks and webhooks in a future integration phase;
- machine-to-machine callbacks;
- exports or downloads requiring an HTTP contract;
- endpoints that need explicit HTTP semantics.

Route Handlers validate origin/signatures/authentication as appropriate and call the same application services as the UI. They do not duplicate domain logic.

### Background jobs

Future sync, recurring reminders, webhook-triggered reconciliation, and long-running imports belong in a worker/job boundary. Do not hold an HTTP request open for provider sync or implement a hidden in-process infinite loop.

## 2. Resource and naming conventions

If a public HTTP API is required, use a versioned resource-oriented namespace:

```text
/api/v1/tasks
/api/v1/projects
/api/v1/calendar/events
/api/v1/habits
/api/v1/focus-sessions
/api/v1/notifications
/api/v1/integrations/{provider}
```

Conventions:

- plural resource nouns;
- kebab-case URL segments;
- stable resource IDs in path segments;
- nested paths only when ownership/context is unambiguous;
- no provider-specific paths inside core resource routes unless the operation is explicitly integration management;
- action endpoints are reserved for domain actions that are not ordinary CRUD, such as complete, reopen, start-focus, or sync, and must use documented HTTP semantics.

No endpoint list is an implementation commitment until the relevant feature is approved.

## 3. HTTP semantics

| Operation | Preferred semantics |
|---|---|
| Create resource | `POST`, return created representation or resource reference. |
| Fetch resource/list | `GET`, never mutate. |
| Replace/meaningful update | `PATCH` for partial update; `PUT` only when full replacement is intentional. |
| Archive/delete | `POST` action or `DELETE` only when semantics are explicit and idempotent. |
| Domain action | `POST` to a named action when it changes lifecycle/state. |
| Invalid input | `400` or `422` according to the chosen API convention; use one consistently. |
| Unauthenticated | `401`. |
| Authenticated but forbidden | `403`. |
| Missing resource | `404`, without leaking another User's existence. |
| Conflict/stale version | `409`. |
| Rate limited | `429` with safe retry metadata when appropriate. |
| Unexpected server failure | `500` with correlation ID and sanitized body. |

Server Actions use the same semantic taxonomy even though they do not expose raw HTTP status codes directly.

## 4. Request validation

- Parse all untrusted input with a runtime schema before application logic.
- Validate path parameters, query parameters, JSON/form bodies, headers used for idempotency, and provider callbacks.
- Reject unknown/high-risk fields rather than mass-assigning arbitrary objects.
- Normalize dates, IDs, pagination, sort keys, and enum values through shared boundary schemas.
- Keep schemas close to the transport boundary and map validated values to domain commands.
- Return field-level validation details only for fields the user is allowed to know.

The default runtime validation choice is Zod or a documented equivalent. No validation package is installed in Phase 0E.

## 5. Response conventions

### Success

Use a consistent envelope for public HTTP APIs:

```text
{
  "data": <resource or result>,
  "meta": {
    "requestId": "<opaque correlation id>",
    "pagination": { "nextCursor": "<opaque value or null>" }
  }
}
```

`meta` is omitted or minimized when not relevant. Server Actions may return a typed result object rather than an HTTP envelope, but the data/error meaning remains consistent.

### Error

```text
{
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "The task could not be found.",
    "requestId": "<opaque correlation id>",
    "fields": []
  }
}
```

- `code` is stable and safe for client behavior.
- `message` is user-safe and may be localized later.
- `requestId` supports support/observability.
- `fields` contains only safe validation/conflict details.
- Never include stack traces, SQL, provider tokens, internal paths, or raw provider payloads.

## 6. Pagination, filtering, and sorting

- Lists accept an opaque cursor and bounded `limit` rather than trusting arbitrary offsets for unbounded data.
- The server enforces a maximum page size.
- Cursor encoding is opaque, scoped to the query/User, and invalidated safely when the sort contract changes.
- Small, stable date-range views may use bounded page/offset behavior if justified.
- Filters use an allowlisted set of fields; unknown filter keys are rejected.
- Sort keys and direction are allowlisted; every list has a deterministic tie-breaker such as stable ID.
- Search queries are length-limited, normalized, and User-scoped.
- Pagination metadata never reveals counts or records the actor cannot access.

## 7. Idempotency and concurrency

- Repeated create/export/sync actions that may be retried accept an idempotency key at the application boundary.
- The key is scoped to User, operation type, and relevant resource; its retention/expiry is defined with the operation.
- Mutations include an expected version/updated-at check when concurrent edits could overwrite user work.
- Stale updates return a ConflictError with a safe recovery path.
- Idempotency does not make an unsafe provider operation safe; the provider adapter must also have a stable external mapping.

## 8. Authentication and authorization

Every request/action:

1. resolves the authenticated actor;
2. maps the actor to a Dayly User;
3. checks feature/action permission and resource ownership;
4. calls the application service;
5. relies on RLS as an additional boundary.

An authenticated actor must not receive a different User's existence through error wording, timing assumptions, search results, or pagination.

## 9. Cache and revalidation contract

After a mutation, the application service identifies affected read views and revalidates/invalidates them through the chosen Next.js strategy. It must not rely on a browser refresh to correct stale source data.

Integration responses are never publicly cached across Users. Freshness is explicit for provider data.

## 10. API documentation

Future public routes/actions must document:

- purpose and ownership;
- input schema and examples without secrets;
- output DTO and error codes;
- authentication/authorization requirements;
- idempotency/concurrency behavior;
- pagination/filter/sort behavior;
- rate limits and observability fields;
- deprecation/versioning policy.

## 11. Phase boundary

No endpoint, Server Action, Route Handler, request schema, or API client was created by this document.
