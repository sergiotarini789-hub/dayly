# Dayly Data Lifecycle and Retention

**Phase:** 0C — Domain Model & Database Architecture
**Status:** Approved (historical)
**Related documents:** [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md), [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md), [`DATA_CONSTRAINTS.md`](DATA_CONSTRAINTS.md)

> This document defines conceptual lifecycle behavior and retention expectations. It does not implement deletion jobs, database triggers, migrations, or account controls.

## 1. Lifecycle principles

- A current lifecycle state describes the source record; a view condition such as Overdue or Scheduled is not automatically a state.
- Archive is the normal user-facing way to remove a record from active planning while retaining useful history.
- Deletion is more consequential than Archive and requires explicit product/data policy.
- Historical facts used for analytics should not disappear merely because a parent definition is archived.
- A failed save must not move a record into a new state in the UI without a durable persistence result.
- External disconnection changes future data flow; it does not silently mutate Dayly-owned records.
- Retention must support user review, future export, and account deletion without keeping an uncontrolled copy of external data.
- Derived views are recomputable. They should not receive independent lifecycle states unless a cache implementation needs operational states.

## 2. Task lifecycle

### 2.1 Canonical states

The MVP canonical Task lifecycle is:

```text
OPEN ───────────────→ IN_PROGRESS
 │  ↘                     │
 │   └────────────────────┘
 │                         │
 ├──────────────────────→ COMPLETED
 │                         │
 └──────────────────────→ ARCHIVED

COMPLETED ───────────→ OPEN        (explicit reopen)
IN_PROGRESS ─────────→ OPEN        (stop work without completion)
ARCHIVED ────────────→ OPEN        (explicit restore, if supported)
```

- **Open:** actionable and not completed or archived.
- **In Progress:** user has intentionally started work, if this state is exposed in the chosen UX.
- **Completed:** user explicitly declares the actionable work done.
- **Archived:** removed from active planning but retained according to policy.

### 2.2 Derived task conditions

| Condition | Rule | Persistence treatment |
|---|---|---|
| Inbox | Task is awaiting triage under a rule not yet finalized. | View/metadata decision, not a status. |
| Planned | Task has the planning context required by the eventual Planned view. | Derived/view condition; exact rule unresolved. |
| Scheduled | At least one active Task Schedule Block exists. | Derived from child records. |
| Overdue | Task is incomplete and its deadline has passed in the relevant time semantics. | Derived at query/read time; not a status. |
| Cancelled | Work intentionally stopped without completion. | Not an MVP state. Do not silently map it to Archive; future product decision required. |

A task can be Open, Scheduled, and Overdue at the same time.

### 2.3 Transitions

| From | Action | To | Required behavior |
|---|---|---|---|
| New | Save a title | Open | Create the task; optional planning data can be added later. |
| Open | Start work explicitly | In Progress | Preserve the action as user intent; a Focus Session does not have to infer it. |
| In Progress | Stop without completion | Open | Keep work open; focus facts remain separate. |
| Open/In Progress | Complete | Completed | Set completion moment and update derived views. |
| Completed | Reopen | Open or In Progress | Explicit action; clear/adjust current completion state according to the later history rule. |
| Open/In Progress/Completed | Archive | Archived | Remove from active views while retaining the record/history. |
| Archived | Restore | Open | Only if restore is supported; do not restore into an invalid scheduled context silently. |
| Any active state | Delete | Deleted/removed per policy | Not a normal MVP shortcut; explicit retention/account policy required. |

### 2.4 Completion and reopening

The current Task record needs a completion moment for MVP lists and analytics. Reopening should be explicit. A future implementation must decide whether to preserve a separate status-transition history for multiple completion/reopen cycles. A full event-sourced model is not required for MVP, but the model must not claim historical completion accuracy after reopening unless the history is preserved.

### 2.5 Cancellation

The approved product and UX specifications do not yet justify `Cancelled` as an MVP canonical state. Phase 0C therefore does not add it to the canonical status set. The future decision must address:

- whether cancellation differs from Archive;
- whether cancelled work appears in analytics;
- whether it can be reopened;
- whether its scheduled blocks/reminders are removed;
- whether the reason is user-visible/history-bearing.

Until decided, the UX should not offer a Cancelled action or store a misleading substitute.

## 3. Project lifecycle

### 3.1 MVP behavior

```text
ACTIVE ───────────→ ARCHIVED
ARCHIVED ─────────→ ACTIVE  (restore if supported)
```

- Active projects appear in Project lists and can receive Tasks.
- Archive removes a Project from active planning but does not archive/delete its Tasks automatically.
- Task membership remains available for history and review.
- A project with no tasks is valid and remains in an explicit empty state.

### 3.2 Deferred states

Paused, closed, completed, and cancelled project states require a product decision because they affect task eligibility, progress, Analytics, and Today cues. Do not add them merely to mirror UI copy.

### 3.3 Deletion

Project deletion must define what happens to its Tasks. The safe MVP posture is Archive Project and keep Tasks, with a later explicit destructive flow if deletion is required.

## 4. Task Schedule Block lifecycle

```text
PLANNED ─────────→ RESCHEDULED (new current block or updated block)
PLANNED ─────────→ REMOVED
```

A Schedule Block is a plan, not completion evidence. Moving a block does not change a Task deadline. Removing the final active block makes the Task no longer Scheduled but does not delete or complete the Task.

The model should support zero-to-many blocks even if MVP UI initially exposes one simple block. Whether superseded block history is retained for planning-reliability analytics is unresolved.

## 5. Calendar Event lifecycle

### 5.1 Dayly-owned events

```text
ACTIVE ─────────→ UPDATED
ACTIVE ─────────→ CANCELLED/REMOVED
```

Recurring events require a recurrence definition and exception treatment. An individual occurrence must not be confused with the recurrence rule. Exact deletion/history behavior is deferred until recurrence UX is finalized.

### 5.2 External events

External Event lifecycle is a provider read-model state:

```text
IMPORTED/REFRESHED → STALE
IMPORTED/REFRESHED → CHANGED
IMPORTED/REFRESHED → DELETED_AT_SOURCE
ANY                → CONFLICT/ERROR
```

Dayly may update the cache based on provider sync. It must not mark a provider event deleted merely because a sync attempt failed.

## 6. Habit lifecycle

### 6.1 Habit definition

```text
ACTIVE ─────────→ PAUSED (future rule)
ACTIVE ─────────→ ARCHIVED
PAUSED ─────────→ ACTIVE (future rule)
PAUSED ─────────→ ARCHIVED
ARCHIVED ───────→ ACTIVE (restore if supported)
```

Archive preserves historical occurrences unless the user explicitly deletes data. Pause behavior is not yet final because it affects future occurrence generation, streaks, consistency, and reminders.

### 6.2 Habit Occurrence lifecycle

MVP occurrence facts conceptually follow:

```text
EXPECTED/DUE ───→ COMPLETED
EXPECTED/DUE ───→ MISSED   (after the supported completion window)
```

- A completed occurrence records the completion moment.
- A missed occurrence is not the same as a paused/suppressed occurrence.
- Skip, pause/suppressed, and backfill states remain unresolved.
- A recurrence change should affect future generation; existing historical occurrence facts should not be silently rewritten.
- The occurrence ledger must prevent duplicate materialization of one expected occurrence.

### 6.3 Streak and consistency

Streak and Consistency are recomputed from the recurrence and occurrence ledger:

- MVP intended rule: each completed due occurrence advances the current streak; a missed due occurrence breaks it unless a later-approved exception applies.
- Consistency is calculated over a stated period and denominator.
- No current-streak counter is the authoritative source.
- A cache may be rebuilt after occurrence or rule changes.

## 7. Focus Session lifecycle

```text
IDLE/NOT_CREATED
      ↓ start
ACTIVE ─────────→ PAUSED ─────────→ ACTIVE
  │                  │
  ├──────────────────┴────────────→ COMPLETED
  └────────────────────────────────→ ABANDONED/TERMINATED
```

- Active session has a start instant and optional Task/Project context.
- Paused time must not be counted as focused time if the product exposes pause semantics.
- Completed session records actual duration.
- Abandoned/terminated behavior and whether it remains in history are still subject to product decisions.
- An orphan session with no Task/Project is valid.
- Completing a session never transitions a Task to Completed automatically.

## 8. Reminder and Notification lifecycle

### 8.1 Reminder Rule

```text
ENABLED ───────→ DISABLED
ENABLED ───────→ EXPIRED
ENABLED ───────→ UPDATED
```

A rule is user intent. A due reminder may produce an in-product Notification but does not modify its source Task/Event/Habit.

### 8.2 Notification

```text
GENERATED → AVAILABLE → READ/HANDLED
                    ├→ SNOOZED → AVAILABLE
                    └→ DISMISSED/EXPIRED
```

MVP needs in-product state; delivery attempts for push/email/provider channels are future records. A failed delivery channel must not erase the Notification or source reminder.

## 9. Integration and cache lifecycle

### 9.1 Connection

```text
DISCONNECTED → AUTHORIZATION_PENDING → CONNECTED
CONNECTED ─────────→ STALE/ERROR
CONNECTED ─────────→ REVOKED/DISCONNECTED
STALE/ERROR ───────→ CONNECTED (recovery)
```

Connection state is distinct from whether the latest data sync succeeded. Disconnect prevents new synchronization but does not silently delete Dayly data.

### 9.2 Cached external data

External calendar and NutriTrack read models may be:

- current/last synchronized;
- stale;
- source-deleted;
- conflicted;
- unavailable because permission was denied;
- removed after the future retention decision.

Cached external values are not editable Dayly source facts.

## 10. Archive, soft delete, and hard delete

### 10.1 Archive

Archive is the preferred MVP action for Tasks, Projects, Habits, and other user records that should leave active planning but remain useful for history. Archived records remain owned, access-controlled, and exportable.

### 10.2 Soft delete

A physical implementation may need an internal deletion marker for safe undo, referential integrity, synchronization, or account deletion. If used, it must:

- be hidden from normal active views;
- remain subject to RLS;
- not be treated as Archive in user-facing analytics;
- have a documented purge rule;
- preserve or deliberately remove dependent records according to this lifecycle.

Soft delete is an implementation strategy, not automatically a new product state.

### 10.3 Hard delete

Hard deletion should be limited to:

- an explicit user data-deletion flow;
- provider cache purge required by consent/retention policy;
- an approved cleanup after a retention period;
- correction of never-valid operational records.

Hard deleting a source record must define its dependent Schedule Blocks, Reminders, Notifications, Focus Sessions, occurrence history, and analytics treatment before implementation.

## 11. Retention expectations by domain

| Domain | Active record | Historical record | Default lifecycle posture |
|---|---|---|---|
| Tasks | Keep while active | Keep completed/archived for review | Archive first; hard delete only explicit policy. |
| Projects | Keep active | Keep archived with task relationships | Archive does not delete tasks. |
| Tags | Keep while used/retained | Associations can be removed | Do not auto-delete without a user/data policy. |
| Schedule Blocks | Keep current plan | History optional and unresolved | Remove/reschedule without completing task. |
| Dayly Events | Keep active/future | Retention/history unresolved | Preserve enough for calendar review; explicit delete. |
| Habits | Keep active/archived | Keep occurrence history | Archive definition without deleting history by default. |
| Habit Occurrences | Expected/current | Preserve completed/missed facts | Retention window unresolved; needed for analytics/export. |
| Focus Sessions | Active/completed | Preserve completed sessions | Actual-time analytics depends on history. |
| Reminder Rules | Enabled | Expired rules bounded | Keep active rules; prune obsolete instances later. |
| Notifications | Available/unread | Handled items bounded | Avoid unbounded inbox; exact period unresolved. |
| External Events | Current cache | Provider-deleted/stale cache policy unresolved | Retain only governed cache with provenance. |
| NutriTrack snapshots | Current approved summary | Source period/cache history limited | Do not retain uncontrolled health copy. |
| Search projections | Rebuildable | No independent retention | Delete/rebuild with source records. |
| Analytics caches | Rebuildable | No independent source status | Keep only if performance requires and version it. |

## 12. User export and account deletion

A future account/data flow must define:

1. which Dayly-owned records are exportable;
2. how derived analytics and search projections are regenerated rather than exported as primary facts;
3. how provider connection metadata and cached external data are handled;
4. whether NutriTrack deletion must be requested from NutriTrack separately;
5. whether soft-deleted records are included during a grace period;
6. when hard purge is complete and how failures are surfaced.

This phase does not implement account deletion or export.

## 13. Lifecycle open questions

- Should Task status transitions be retained in an append-only history for reopen/analytics?
- Is Cancelled a real Task state or only a future user action with separate semantics?
- Should superseded Schedule Blocks be retained for planning-reliability analytics?
- What is the exact Event recurrence/exception retention behavior?
- How do pause, skip, and backfill affect Habit Occurrences, streaks, and consistency?
- How long should Focus Sessions marked Abandoned remain?
- What retention window applies to handled Notifications?
- What external cache survives integration disconnect?
- What is the user-visible data-deletion promise?

## 14. Phase boundary

No deletion job, trigger, retention worker, database policy, migration, or application lifecycle handler is implemented by this document.
