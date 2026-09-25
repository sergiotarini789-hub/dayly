# Dayly Data Constraints, Indexing, RLS, and Migration Strategy

**Phase:** 0C — Domain Model & Database Architecture
**Status:** In progress
**Related documents:** [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md), [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md), [`DATA_OWNERSHIP.md`](DATA_OWNERSHIP.md), [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)

> This document describes constraints and architecture the future database should enforce. It contains no SQL, DDL, migrations, executable Row-Level Security policies, or application code.

## 1. Constraint principles

- Enforce ownership and relationship integrity at the database boundary as well as in application services.
- Reject invalid records rather than relying on every UI path to prevent them.
- Keep constraints stable and domain-oriented; do not encode an unresolved UX label as a permanent schema rule.
- Use database constraints for invariants and application/domain services for rules requiring current time, external state, or complex product policy.
- Every query path must be safe when a client supplies an identifier from another User.
- Historical and external data must retain enough provenance to explain freshness and ownership.

## 2. Ownership constraints

### 2.1 User isolation

Every Dayly-owned record must be associated with exactly one User either directly or through an ownership-checked parent. The future implementation should prefer direct owner access for high-frequency child queries where it makes RLS easier to audit.

At minimum, ownership must be enforced for:

- Profile and Preferences;
- Project, Task, Tag, Task-Tag association, and Schedule Block;
- Calendar Event;
- Habit and Habit Occurrence;
- Focus Session;
- Reminder Rule and Notification;
- Integration Connection and all external read models;
- Availability Rules and Exceptions.

### 2.2 Same-owner relationships

A relationship is valid only when all related records belong to the same User:

- Task → Project;
- Task → parent Task;
- Task ↔ Tag;
- Schedule Block → Task;
- Focus Session → Task/Project;
- Reminder Rule → source record;
- Habit Occurrence → Habit;
- Notification → User/source context;
- Integration child → Integration Connection/User.

The database should reject cross-user references even if a caller bypasses normal UI selection.

## 3. Required and value constraints

### 3.1 General records

- Stable identifier is required and immutable after creation.
- Owner is required for Dayly-owned records.
- Creation moment is required and immutable.
- Update moment changes whenever user-visible source data changes.
- Milestone moments cannot be earlier than creation when that relationship is meaningful.
- Enumerated values must be from an approved vocabulary.
- Text required for names/titles must not be blank after normalization.
- User-provided text should have bounded lengths decided during implementation; the database must not accept unbounded accidental payloads.

### 3.2 User/Profile/Preferences

- One active Profile per User conceptually.
- One active User Preferences record per User conceptually.
- Locale must use an approved format when present.
- Time zone must be a valid supported IANA identifier; do not accept arbitrary display labels as the semantic value.
- Quiet hours and availability windows must have valid local start/end semantics.
- Preference changes must not rewrite historical instants or source timestamps.

### 3.3 Projects

- Project name is required and non-blank.
- Project lifecycle must be valid for the current product decision.
- Archive moment is present only when archived.
- A Task may reference at most one Project in the MVP logical model.
- Project progress must not be stored as a user-editable authoritative percentage.

### 3.4 Tasks

- Title is required and non-blank.
- Task status must be a canonical lifecycle value, not a combination of derived labels.
- Priority must use an approved value or null/none.
- Estimated duration, when present, is non-negative and bounded by a reasonable product maximum.
- Completion moment is required for Completed state and absent for active states unless a later history model explicitly permits otherwise.
- Archive moment is required for Archived state and absent for active states.
- A task cannot be its own parent.
- A task's parent must belong to the same User.
- MVP parent depth should be limited to one child level; deeper nesting requires a new product/data decision.
- A task cannot be both parent and child of itself through a cycle.
- Task deletion/soft-deletion must not silently create an active orphan with an invalid parent/project relation.
- Overdue cannot be persisted as a canonical status by default; it is validated at read time from status/deadline/time.
- Cancelled is not an allowed MVP canonical status until separately approved.

### 3.5 Tags and associations

- Tag name is required and normalized for comparison.
- A User cannot have two active Tags with the same normalized name.
- A Task-Tag association is unique per Task/Tag pair.
- Association owner must agree with both records.
- Removing an association must not delete the Task or Tag.

### 3.6 Schedule Blocks

- A Schedule Block must reference exactly one Task.
- Start must be before end.
- Duration must be positive and bounded by a sensible product maximum.
- The time-zone/local intent representation must be valid.
- A block cannot create a Task completion state.
- Multiple blocks for one Task are valid in the logical model.
- Whether active blocks may overlap one another for the same Task is a product/UX policy, not a referential constraint; the system should surface conflicts rather than assume they are invalid.
- Removing the last block must leave the Task valid and unscheduled.

### 3.7 Calendar Events

- Title is required for a user-created event unless the product explicitly supports untitled blocks.
- Start/end semantics must be valid for timed events.
- All-day events use a local date/range representation, not an arbitrary midnight instant.
- Event recurrence must be parseable under the supported rule vocabulary.
- Event time zone must be valid when local recurrence/intention depends on it.
- A Dayly Calendar Event and Task Schedule Block remain distinct even if their intervals overlap.
- A future linked Task relationship, if added, must be same-owner and optional.

### 3.8 Habits and Occurrences

- Habit name is required and non-blank.
- Recurrence rule must be valid for the supported MVP patterns.
- Habit time zone must be valid or explicitly inherit from User Preferences.
- An occurrence must belong to one Habit and one User ownership path.
- A Habit Occurrence key is unique per Habit/rule version/expected occurrence identity.
- Completed occurrence requires a completion moment.
- Missed occurrence must not be used for a paused/suppressed occurrence unless that behavior is explicitly defined.
- Occurrence state must use the supported vocabulary; do not add Skip/Backfill/Pause states without their product rules.
- Changing a Habit recurrence must not duplicate or silently rewrite historical occurrence facts.

### 3.9 Focus Sessions

- Session must belong to one User.
- Direct context is either one Task, one Project, or none in the recommended model.
- If a Task is present and a Project context is also stored, the relationship must be consistent; preferable MVP rule is to derive Project from Task and store only one direct context.
- Start is required and end is required for Completed/Terminated sessions.
- End must not precede start.
- Paused duration is non-negative and cannot exceed elapsed session duration.
- Actual duration is non-negative and cannot exceed elapsed time after pause treatment.
- An orphan session is valid; it must not be assigned to a placeholder Task.
- Focus status does not update Task status through a database constraint or trigger.

### 3.10 Reminders and Notifications

- Reminder Rule must have a supported source type and a valid source relationship.
- Trigger time/window must be valid in the relevant time zone.
- Notification must belong to one User and have a supported kind/state.
- Read/dismiss/snooze moments must be consistent with the corresponding state.
- A Notification must not become the only surviving representation of a deleted Task/Event/Habit without a deliberate display policy.
- Delivery attempt records are not required for MVP and should not be introduced without a channel contract.

## 4. Integration constraints

### 4.1 Connections

- Integration Connection belongs to exactly one User.
- Provider key and external account reference are required for a connected state.
- A User should not have duplicate active connections for the same provider/account unless a later provider use case justifies it.
- Consent/scope must be explicit before connected data is made visible.
- Disconnected/revoked connections cannot be used to claim current sync.

### 4.2 External calendar read models

- External Calendar belongs to one Integration Connection.
- External Event belongs to one External Calendar/connection.
- Provider event identity is unique within the required provider/account/calendar/occurrence scope.
- A failed synchronization must not mark a previously known event deleted.
- External Event cache must retain source/provenance and last synchronized moment.
- External event data must not be attached directly to a Dayly Task as its ownership source.

### 4.3 NutriTrack snapshots

- Snapshot belongs to one NutriTrack Integration Connection.
- Metric/category and source period are required for a summary.
- Freshness and source update information must be distinguishable from Dayly import time.
- Snapshot data is read-only in Dayly.
- The model must not accept arbitrary NutriTrack domain payloads without an approved scope/contract.

## 5. Timestamp and timezone consistency

- Use one agreed representation for instants in the physical database.
- Preserve the local time zone for recurring Habit and Event intent.
- Store or derive date-only deadline precision explicitly; never infer precision from a midnight value.
- A User preference time-zone change changes future interpretation of user preferences, not historical completion/focus/event instants.
- A recurring item must carry enough zone/rule context to avoid duplicate or missing occurrences around daylight-saving transitions.
- Sync timestamps refer to the synchronization operation, not the source event update time; both are distinct when available.
- Client-provided timestamps must not override server/source ordering without a conflict policy.

## 6. Indexing strategy

These are conceptual access patterns, not index creation instructions. Physical indexes should be added only during implementation and validated against query plans.

| Access pattern | Useful key/order concept | Why it matters |
|---|---|---|
| User's active Tasks | User ownership + lifecycle status + updated/created moment | Tasks and Today lists need fast user-scoped active retrieval. |
| Today's due/overdue Tasks | User + deadline/date precision + lifecycle | Supports deadline review without scanning another User's records. |
| Project Tasks | Project ownership + task lifecycle + ordering | Project detail needs ordered open/completed task groups. |
| Tasks by parent | Parent Task + ordering | Supports subtasks without loading every User Task. |
| Tasks by Tag | Task-Tag association + Tag/Task identifiers | Supports tag filters and uniqueness. |
| Scheduled Blocks by range | User + start/end range | Calendar/Today needs time-window retrieval. |
| Blocks by Task | Task + start | Task detail needs its planned intervals. |
| Calendar Events by range | User + start/end range + active state | Calendar day/week/month views query time ranges. |
| Recurring/event exceptions | Event + occurrence/date key | Prevents duplicate/missing occurrence overrides when supported. |
| Habit list | User + active state + next relevant date if materialized | Habits view and Today due section. |
| Habit Occurrences by date | Habit/User + expected date + status | Completion, missed history, streak, and consistency queries. |
| Focus by Task/Project | User + task/project + start | Actual-duration aggregates and history. |
| Focus by period | User + start/end | Daily/weekly/monthly focus analytics. |
| Notifications | User + available/read/handled + scheduled moment | Actionable notification list and reminders. |
| Reminders by trigger/source | User + enabled/next trigger + source | In-product reminder generation. |
| Integration state | User + provider + status | Settings and freshness status. |
| External Events by range | Connection/calendar + start/end + source state | Future Calendar read view. |
| External identity | Provider/account/calendar/event external IDs | Idempotent future synchronization. |
| Native MVP search | User-scoped text search over Task/Project fields | Avoids a separate search service/index until needed. |

A single large composite index should not be created speculatively for every Dashboard widget. Measure real queries during implementation.

## 7. Row-Level Security model

The future Supabase/PostgreSQL layer should apply RLS or an equivalent database-enforced isolation model to every client-accessible User-owned record.

### 7.1 User-owned records

A client may select, insert, update, archive, and delete only records whose owner resolves to the authenticated User principal. Child records must validate ownership through their parent or direct owner.

### 7.2 Derived/cached records

If analytics/search/cache records are persisted, access remains scoped to the User whose source data produced them. A derived record does not become public merely because it contains no direct source text.

### 7.3 Integration records

Only the owning User may see connection metadata, scopes, provider references, external event caches, or NutriTrack snapshots. Provider credentials should not be exposed through ordinary client reads.

### 7.4 Service operations

Future synchronization or scheduled jobs may need a controlled server/service role. Such operations must:

- be limited to the owning connection/User scope;
- validate provider identity and consent;
- avoid broad unrestricted client-like access;
- write provenance and sync status;
- record failures without exposing secrets.

### 7.5 Future shared/team records

No shared/team policy is required now. If added later, it must introduce explicit membership/role records and replace simple owner-only access with a reviewed membership policy. Existing personal data must not become shared by default.

## 8. Migration strategy

### 8.1 General rules

- Prefer additive changes: new nullable fields, new records, new relationships, or new derived projections.
- Use expand → backfill/dual-read if necessary → validate → switch → contract for changes that affect live data.
- Avoid destructive rename/drop changes in one step.
- Never remove a source field while an active reader or migration still depends on it.
- Every migration must have a rollback or recovery plan appropriate to the change.
- Keep application behavior and schema changes coordinated, but no application code is introduced in Phase 0C.

### 8.2 Reference and seed data

Reference data such as stable priority values, provider keys, or supported recurrence kinds should be versioned as explicit reference data or constrained values. Seed scripts must be idempotent and must not create fake user records or sample production data.

### 8.3 Historical and derived data migrations

- Rebuild derived projections from source records where possible.
- Preserve source timestamps and provenance during backfills.
- Version formulas for analytics/project progress caches.
- Do not backfill an unresolved status such as Cancelled, Habit Skip, or Project Completed merely to fill a column.

### 8.4 Destructive changes

Before a destructive migration, document affected users/records, export/backup strategy, dependent reads, data-loss implications, and rollback. Destructive changes require explicit review and are outside the automatic scope of a phase.

## 9. Constraint review checklist

Before physical implementation:

- Does every record have a clear owner?
- Can any relation cross Users?
- Are time and date-only values unambiguous?
- Can a Task be its own ancestor?
- Can a completed Task have an invalid completion timestamp?
- Can a Schedule Block accidentally complete a Task?
- Can an occurrence be generated twice?
- Can an orphan Focus Session be represented without a fake Task?
- Can an external failure delete a cached event?
- Can a disconnected integration expose stale data as current?
- Can RLS be explained for every client-readable record?
- Is the constraint enforcing a settled product rule rather than hiding an unresolved decision?

## 10. Phase boundary

No database table, SQL constraint, index, RLS policy, migration, trigger, or application code is implemented by this document.
