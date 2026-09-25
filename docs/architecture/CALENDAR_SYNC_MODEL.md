# Dayly Calendar Synchronization Model

**Phase:** 0D — Integration Architecture
**Status:** In progress
**Related documents:** [`INTEGRATION_ARCHITECTURE.md`](INTEGRATION_ARCHITECTURE.md), [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md), [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md), [`SYNC_ERROR_MODEL.md`](SYNC_ERROR_MODEL.md)

> This is a provider-neutral synchronization design. It does not implement calendar APIs, OAuth, webhooks, queues, database migrations, or UI.

## 1. Purpose and scope

Dayly has its own planning layer. Future external calendar connections provide context and, only after explicit approval, may exchange selected objects with a provider.

The model must keep these concepts separate:

| Concept | Owner | Meaning | Can it complete a Task? |
|---|---|---|---:|
| **Dayly Calendar Event** | Dayly | A Dayly-owned time-bound commitment. | No |
| **External Calendar Event** | Google/Apple/Outlook or another provider | Provider-owned event mirrored into Dayly with provenance. | No |
| **Task Schedule Block** | Dayly | Planned time to work on a Dayly Task. | No |
| **Focus Session** | Dayly | Actual effort record, optionally linked to a Task/Project. | No |

A task deadline remains a deadline. It is not an external event and does not automatically become one.

## 2. Provider-neutral records

### 2.1 Integration Connection

Represents a User-authorized provider relationship:

- Dayly User owner;
- provider key;
- external account reference;
- selected scope/calendars;
- connection state;
- consent metadata;
- last attempted/successful sync;
- health/error state;
- disconnect/revocation timestamps.

### 2.2 External Calendar

Represents a provider calendar available under a connection:

- external calendar ID;
- display name;
- provider account/connection;
- selected/sync-enabled state;
- provider time zone when supplied;
- last-seen and last-synchronized metadata.

### 2.3 External Calendar Event

Represents a provider event read model:

- connection and external calendar;
- external event ID;
- occurrence/instance identity where recurring events require it;
- title/summary;
- description/location where approved;
- start/end/all-day and time zone;
- recurrence/exception representation;
- provider revision/etag/change marker when available;
- source lifecycle state;
- provenance and freshness;
- conflict/sync status.

It is not a Dayly Calendar Event row with an external ID added as an afterthought. The ownership model must remain explicit.

### 2.4 Mapping and sync state

A future implementation needs a mapping between a Dayly-exported object and its provider representation only if export/write is enabled. It may contain:

- Dayly object identity and kind;
- provider/account/calendar identity;
- external event ID and occurrence identity;
- last exported source revision;
- last seen provider revision;
- export/import direction;
- conflict state;
- last synchronization result.

Read-only import does not need to create a Dayly Calendar Event or Task mapping merely to display an external event.

## 3. Provider-specific adapter profiles

The profiles below describe integration boundaries, not implementation facts. Current provider documentation, test accounts, platform constraints, permissions, and terms must be verified before an adapter is built.

### 3.1 Google Calendar

**Adapter boundary:** A future Google Calendar adapter is responsible for Google authorization, selected calendar discovery, event/occurrence normalization, incremental-change behavior, push/change-signal handling where available, provider errors, quotas, and token lifecycle. Core Dayly logic receives normalized calendar capabilities.

**Authorization and scope philosophy:** Start with the narrowest read-oriented Calendar permission that supports the approved import feature. Exact Google scopes, consent behavior, verification requirements, and whether a scope permits event writes must be checked against current Google documentation before implementation. Calendar selection is a user-level choice after authorization where the provider capability supports it.

**Calendars and events:** Preserve provider account, calendar ID, event ID, and recurring-instance identity separately from Dayly IDs. Normalize title, description/location only when approved, start/end, all-day, recurrence, exceptions, provider revision, and source timestamps. Do not use title/time as identity.

**Recurring/all-day/timezone behavior:** Treat Google recurrence and individual instances as provider-specific mappings. Preserve enough source metadata to avoid flattening a series or losing exceptions. Verify all-day inclusive/exclusive end semantics and time-zone behavior with contract tests.

**Read/write posture:** Read-only import is the recommended first capability. Export/write requires separate permission, mapping, idempotency, deletion, and conflict decisions. Do not assume bidirectional sync is required.

**Incremental and push behavior:** Use the provider's documented change cursor/token or equivalent only after its expiration, deletion, and invalidation semantics are verified. A push/watch signal, if available and approved, should enqueue reconciliation rather than carry the sole source of truth. Periodic reconciliation remains necessary.

**Token expiration/revocation:** Refresh or reauthorize through the secure token boundary. Provider revocation changes the connection to Auth Required/Revoked; it does not delete Dayly data or claim the external calendar is current.

**Rate limits/retry:** Translate provider quota/rate responses into the normalized Rate Limit category, honor provider retry guidance when safe, and use bounded backoff with idempotent operations. Exact quotas and headers are implementation verification items.

### 3.2 Apple Calendar and iCloud distinction

**Adapter boundary:** “Apple Calendar integration” and “iCloud server-side calendar synchronization” are not assumed to be the same technical path.

- A platform-native Apple Calendar experience may depend on device/platform calendar APIs and user permission on that device.
- A server-side iCloud synchronization path may require a different Apple-supported account/credential/capability model and may not expose the same behavior as a device calendar framework.
- A web Dayly server must not assume that a browser Apple identity or Apple Sign In grants access to a user's calendars.

**Authorization and platform constraints:** Verify whether the planned Dayly client/server experience can access calendars lawfully and securely, where authorization occurs, whether a server refreshable credential exists, and what platform entitlements or user prompts are required. Do not transfer device-only calendar access into a server integration without an approved architecture.

**Event ownership and sync:** Preserve Apple/provider account, calendar, event/occurrence identity, ownership, recurrence, all-day, location, notes, and time zone as an external read model. Read-only import is the safe initial assumption. Write/export and server-side iCloud sync remain separate decisions.

**Incremental sync, push, and token lifecycle:** Do not assume that Apple provides the same cursor, webhook, refresh-token, or change-notification model as Google. Verify the supported mechanism for the selected platform path. If no durable server-side incremental mechanism exists, use a bounded platform-mediated or reconciliation approach rather than inventing one.

**Rate limits and retry:** Apply the normalized provider-neutral error model, but verify platform/network restrictions, quotas, background execution, and retry rules before operating a server sync.

### 3.3 Outlook / Microsoft calendar

**Adapter boundary:** A future Outlook adapter will likely use Microsoft's identity/calendar API boundary, but the exact service, tenant behavior, permissions, and endpoint contract must be verified for the Dayly deployment and target account types.

**Authorization and ownership:** Preserve Microsoft provider identity, account/tenant context where relevant, selected calendars, and external IDs. Start with least-privilege read permissions. Calendar write permissions require a separate approved feature and user consent.

**Events and recurrence:** Normalize provider event IDs/instances, start/end/all-day, time zone, recurrence, exceptions, change markers, and source lifecycle. Verify how recurring instances, moved occurrences, deleted occurrences, and time-zone changes are represented.

**Incremental and push behavior:** Use the provider's documented delta/change mechanism and subscription/push capability only after expiration, renewal, deletion, and permission behavior are verified. Push signals enqueue a sync/reconciliation and are not the sole source of truth.

**Token lifecycle and revocation:** Handle access expiration, refresh, consent changes, tenant/admin restrictions, and revocation through the secure boundary. An auth/permission error is user-action-required, not an infinite retry.

**Rate limits and retry:** Translate throttling into the normalized Rate Limit category, honor provider retry guidance, and protect the provider and Dayly with bounded backoff/coalescing. Exact limits must be verified during adapter implementation.

### 3.4 Provider profile rule

A provider profile may declare capabilities as unsupported. The core domain must never infer provider behavior from a provider name, and no adapter may silently map a lossy recurrence, all-day, time-zone, or deletion representation as exact.

## 4. Import, export, and bidirectional meanings

### 4.1 Import: External → Dayly

Import makes selected provider events available as source-labeled external read models in Calendar/Today.

- Provider remains source of truth.
- Dayly may normalize time, recurrence, all-day, and provenance for display.
- Dayly does not automatically create Tasks or Schedule Blocks.
- Dayly edits are disabled unless a later provider-write capability is explicitly enabled.
- Provider deletion is represented only after a verified deletion/tombstone signal or authoritative reconciliation.

### 4.2 Export: Dayly → External

Export creates or updates an explicitly eligible Dayly-owned representation in a provider.

- It is not required for MVP.
- Eligibility and write permissions must be explicit.
- The Dayly object remains source-owned by Dayly; provider copy carries mapping/provenance.
- A provider rejection does not roll back a valid Dayly object; it creates an actionable sync state.
- Export must be idempotent and must not create a new external event on every retry.

### 4.3 Bidirectional sync: Dayly ↔ External

Bidirectional behavior means both sides may update a mapped representation. It requires:

- stable mapping and source revisions;
- a defined source-of-truth policy per field/object;
- conflict detection;
- user-visible conflict resolution;
- deletion semantics;
- recurrence/time-zone mapping rules;
- retry-safe writes;
- audit/observability.

Bidirectional sync is not an MVP requirement and should not be enabled merely because both import and export exist as technical capabilities.

## 5. Recommended rollout

| Stage | Capability | Ownership and risk posture |
|---|---|---|
| 0 | Documentation and provider contract | No provider access. This phase. |
| 1 | Read-only import for one verified provider | External events shown with provenance; no Dayly writes. |
| 2 | Incremental read, freshness, retry, and operational recovery | No silent deletion; stale/error states visible. |
| 3 | Optional Dayly export of a narrow object type | Explicit opt-in, mapping, idempotency, and provider permission. |
| 4 | Carefully scoped bidirectional sync | Conflicts, revisions, deletes, recurrence and time-zone rules required. |
| 5 | Additional providers | Independent adapter and contract verification for Apple/Outlook. |

## 6. Idempotency and identity

A provider event's stable identity is scoped, not just a string:

```text
provider
external_account_id
external_calendar_id
external_event_id
external_occurrence_id (when needed)
```

The effective idempotency key may be a normalized tuple or a safely derived value. It must be stable across retries and must not use title/start time as identity.

For export/write operations, use a separate operation idempotency key tied to:

```text
Dayly object ID
provider/account/calendar
operation kind
source revision
```

If the same export request is retried, the adapter must be able to recognize it as the same logical operation. If an external event ID is returned but the response is lost, reconciliation must find the mapping before creating another event.

## 7. Synchronization modes

### 7.1 Initial full sync

1. Validate connection, consent, selected calendars, and adapter capability.
2. Enumerate selected calendars/resources using bounded pages.
3. Normalize event records and identities.
4. Upsert/reconcile external read models idempotently.
5. Process verified deletions/tombstones.
6. Store the last successful checkpoint only after the corresponding page/range is committed.
7. Report imported, updated, skipped, deleted, conflict, and error counts.

A full sync is not necessarily one unbounded request. It may be partitioned by calendar, page, or time window according to provider capability.

### 7.2 Incremental sync

When a provider offers a change cursor/token or equivalent:

1. start from the last successfully committed checkpoint;
2. request changes;
3. process records/deletions idempotently;
4. commit the next checkpoint only after processing succeeds;
5. mark the cursor invalid and request a full reconciliation when the provider says it is stale/expired or when continuity cannot be trusted.

Provider-specific cursor semantics must be verified during implementation rather than assumed from another provider.

### 7.3 Reconciliation sync

A periodic or user-requested reconciliation compares the selected provider range with Dayly's read model. It is needed even when webhooks exist because push delivery can be delayed, duplicated, or lost.

### 7.4 On-demand refresh

A user refresh can enqueue a bounded sync. The UI should report queued/running/result state rather than blocking indefinitely or promising freshness before completion.

## 8. Recurring and all-day events

### 8.1 Recurrence

- Preserve provider recurrence identity/rule where possible.
- Distinguish a series rule from an individual occurrence.
- Preserve exceptions, moved occurrences, and cancellations as provider semantics permit.
- If a provider rule cannot be represented without loss, mark it as limited/unsupported or retain provider metadata for read-only display.
- Do not flatten an unbounded recurrence into permanent Dayly Event rows.

Exact provider recurrence formats and supported mappings must be verified per adapter.

### 8.2 All-day events

All-day events use local calendar dates and the provider/source time zone. They must not be converted into a timed event at UTC midnight. Date ranges, inclusive/exclusive end semantics, and multi-day behavior require adapter contract tests.

### 8.3 Time zones

- Preserve provider event zone when supplied.
- Store/interpret actual instants separately from local wall-clock intent.
- Display in the user's selected context without changing source ownership or source time.
- Reconcile daylight-saving and travel behavior through provider-specific contract tests.
- A Task Schedule Block and an external event can have different relevant zones; conflict display must state the interpreted time zone.

## 9. Conflict model

### 9.1 Conflict categories

- same mapped event changed in Dayly and provider;
- provider event moved, renamed, or resized;
- event deleted externally;
- Dayly export deleted/changed locally;
- recurrence rule or exception changed;
- time zone/all-day interpretation changed;
- provider mapping disappeared or duplicated;
- permission/scope no longer permits a read/write;
- Dayly event overlaps an external event without being a synchronization conflict.

### 9.2 Detection

A future sync engine compares:

- stable identity/mapping;
- last source revision or provider change marker;
- last successfully synchronized representation;
- current provider representation;
- current Dayly representation when write is enabled;
- operation direction and scope.

A time overlap alone is a planning conflict, not necessarily a data-sync conflict.

### 9.3 Representation

A conflict should include, conceptually:

- User/connection/provider scope;
- Dayly and external identities;
- object/occurrence kind;
- conflict category;
- fields affected;
- last-known representations or safe summaries;
- detected moment;
- current state: pending, resolved, ignored, or obsolete;
- chosen resolution and actor when resolved.

Do not store full private payload snapshots by default when a redacted field summary is enough.

### 9.4 Resolution

For read-only import, the default resolution is to retain provider data and show a stale/conflict state if the mapping is uncertain. For future write-enabled sync, the user may be offered provider version, Dayly version, duplicate/keep-both, or a carefully constrained merge where semantics are safe.

Do not silently merge recurrence, all-day, time-zone, deletion, or ownership changes. A conflict decision must be idempotent and auditable.

## 10. Delete and disconnect behavior

### Provider-side deletion

- Require an authoritative deletion/tombstone or verified reconciliation before removing an external read model.
- A transient provider error must not look like deletion.
- Preserve provenance and a deleted/stale marker if needed for user clarity and idempotency.

### Dayly-side deletion

- Deleting/archiving a Dayly Calendar Event or Schedule Block does not delete a provider event unless export/write mapping and explicit policy permit it.
- A future exported representation must define whether Dayly Archive means provider cancellation, deletion, or no action.

### Disconnect

On disconnect:

1. stop new sync operations;
2. invalidate/clear credentials through the secure boundary;
3. preserve connection audit/status needed to explain the action;
4. apply a later-approved policy to imported external read models;
5. keep Dayly-owned Events, Tasks, and Schedule Blocks intact;
6. do not present cached provider events as current.

Whether imported copies are retained, hidden, anonymized, or deleted remains unresolved until privacy/product review.

## 11. Sync observability

For each operation, track sanitized:

- provider/account/connection identity;
- selected calendar scope;
- operation type and range;
- full/incremental/reconciliation mode;
- cursor/checkpoint before and after, without sensitive tokens;
- start/end and duration;
- records fetched, inserted, updated, deleted, skipped, conflicted, and failed;
- last successful sync;
- error category, retryability, and next action.

Users should see last successful sync, current health, stale/error status, and recovery action. They do not need provider payloads or internal cursor values.

## 12. Provider verification requirements

Before implementing any provider adapter, verify with current provider documentation and sandbox/test accounts:

- authorization scopes and consent screens;
- identity and account discovery;
- calendar/event read/write permissions;
- event/occurrence identity stability;
- recurrence and exception semantics;
- all-day end-date semantics;
- time-zone behavior;
- incremental change/cursor behavior;
- deletion/tombstone behavior;
- webhook/push availability and verification;
- rate limits and retry guidance;
- token expiration/revocation behavior;
- provider terms and privacy requirements.

No provider detail not verified by these tests should be treated as an implementation fact.

## 13. Open questions

- Is read-only Google Calendar import the first provider capability?
- Which Dayly-owned objects, if any, may be exported?
- Are imported copies retained, hidden, or deleted on disconnect?
- What conflict choices should the user see for each object type?
- How should recurrence mappings with loss be represented?
- What is the exact full/incremental checkpoint storage strategy?
- Which provider push/webhook mechanisms are available and worth operating?
- What offline Dayly changes can wait for a provider sync without confusing the user?

## 14. Phase boundary

No calendar provider, OAuth flow, synchronization job, webhook, SDK, API route, schema change, or application code was created by this document.
