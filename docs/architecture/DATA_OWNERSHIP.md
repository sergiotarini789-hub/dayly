# Dayly Data Ownership and Integration Boundaries

**Phase:** 0C — Domain Model & Database Architecture
**Status:** Approved (historical)
**Related documents:** [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md), [`DATABASE_SCHEMA.md`](DATABASE_SCHEMA.md), [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)

> This document defines who owns a fact, who may consume it, and how provenance must remain visible. It does not define provider APIs, synchronization code, authentication, or physical storage.

## 1. Ownership principles

1. **A source of truth has one domain owner.** Displaying a fact in another module does not transfer ownership.
2. **User ownership is explicit.** Every Dayly-owned record belongs to one User principal in the personal MVP.
3. **Derived views are not second sources.** Today, Analytics, Streak, Project Progress, Search, and Daily Briefing read from source facts.
4. **External data carries provenance.** Imported records identify provider, external identity, source period, freshness, and sync state.
5. **Read access does not imply write access.** Dayly may consume NutriTrack or external calendar data without being allowed to edit it.
6. **Consent is part of the boundary.** A future integration must record what the user authorized, for which provider, and when it was last known.
7. **Disconnect is not silent deletion.** Disconnecting a provider stops future reads/sync; treatment of cached data is explicit and policy-driven.
8. **Health context is not productivity truth.** NutriTrack summaries must not be converted into medical or moral productivity judgments.
9. **No provider-specific logic in core domains.** Google, Apple, Outlook, and NutriTrack behavior belongs in an integration boundary.
10. **Future collaboration is not assumed.** Team/shared ownership is outside the personal MVP and must not weaken user isolation now.

## 2. Ownership matrix

| Data or concept | Dayly owns | External source owns | Derived | Read/write posture |
|---|---:|---:|---:|---|
| User principal | Yes | Authentication boundary may identify it | No | Dayly uses it as the ownership principal; auth implementation is later. |
| Account/provider identity link | Boundary metadata | Provider may own login identity | No | Dayly stores only the approved identity reference, not credentials. |
| Profile/display preferences | Yes | No | No | User-editable through Dayly settings. |
| Locale and default time zone | Yes | No | No | User-editable preference; does not rewrite historical facts. |
| Planning preferences | Yes | No | No | User-editable source for availability/planning defaults. |
| Working schedule rules | Yes | External calendars may provide context | No | Dayly remains the planning preference owner. |
| Dayly Project | Yes | No | No | User-editable in Dayly. |
| Dayly Task | Yes | No | No | User-editable in Dayly. |
| Task lifecycle status | Yes | No | No | Explicit user/domain action; not inferred from external data. |
| Task deadline | Yes | No | No | User-editable Dayly constraint. |
| Task description/title | Yes | No | No | User-editable Dayly content. |
| Task-Project membership | Yes | No | No | User-editable Dayly relationship. |
| Task-Tag association | Yes | No | No | User-editable Dayly relationship. |
| Tag definition | Yes | No | No | User-owned label; future shared tags require new ownership rules. |
| Task Schedule Block | Yes | No | No | Dayly-owned planning intent; not automatically exported. |
| Dayly Calendar Event | Yes | No | No | Dayly-owned event; Dayly controls its content. |
| Dayly Event recurrence | Yes | No | No | Dayly recurrence semantics; provider mapping is future. |
| Habit definition | Yes | No | No | Dayly-owned recurring behavior. |
| Habit Occurrence completion | Yes | No unless a future approved source is used | No | Explicit Dayly action in MVP. |
| Habit streak | No source ownership | No | Yes | Derived from recurrence and occurrence facts. |
| Habit consistency | No source ownership | No | Yes | Derived for a stated period. |
| Focus Session | Yes | No | No | Dayly-owned actual-effort record. |
| Focus actual duration | Yes as session facts | No | Aggregate | Derived from session timing; not a Task completion signal. |
| Task actual duration summary | No independent source | No | Yes | Aggregate of eligible Focus Sessions. |
| Reminder Rule | Yes | No | No | Dayly user intent; source record remains with its module. |
| In-product Notification | Yes | No | Partly | Dayly owns available/read/handled state; future delivery providers own delivery response. |
| Push/email delivery attempt | No in MVP | Delivery provider may own transport status | No | Future channel boundary; never core source truth. |
| Today view | No | No | Yes | Composition of current source records and preferences. |
| Overdue condition | No | No | Yes | Derived from incomplete Task, deadline, and relevant time. |
| Planned/Scheduled view membership | No | No | Yes | Derived from planning metadata and Schedule Blocks. |
| Daily/Weekly/Monthly Progress | No | No | Yes | Analytics read model with period and definitions. |
| Project Progress | No | No | Yes | Formula-dependent derived value; no final formula yet. |
| Search result | No | No | Yes | Derived retrieval over source records. |
| Search projection, if later cached | Dayly cache only | No | Yes | Rebuildable and never editable as the source. |
| Daily Briefing | No | No | Yes | Future presentation/notification derived from Today/context. |
| Integration connection metadata | Yes for connection/consent state | Provider owns provider account | No | Dayly controls scope/status metadata; secrets stay in secure boundary. |
| External calendar account reference | Dayly reference | Provider owns account | No | Provider-neutral identity metadata. |
| External Calendar | No source ownership | Yes | No | Dayly stores approved read metadata/cache only. |
| External Event | No source ownership | Yes | No | Dayly displays/caches read model; write behavior is future and explicit. |
| External event sync state | Yes as integration metadata | Provider returns responses | Partly | Dayly tracks last seen, stale/error/conflict state. |
| NutriTrack user reference | Dayly connection reference | NutriTrack owns account identity | No | Provider-neutral external reference. |
| Nutrition/health entry | No | NutriTrack | No | Never recreated as a Dayly nutrition source. |
| Nutrition calculation | No | NutriTrack | No within Dayly | Dayly consumes approved summary only. |
| NutriTrack summary cache | Dayly cache/read model | NutriTrack source owns value | Yes relative to source | Read-only, provenance/freshness required, retention unresolved. |
| AI suggestion (future) | No source record | Model/provider may generate output | Yes | Proposed action only; user confirmation and audit required. |

## 3. Dayly-owned domain boundaries

### 3.1 Tasks and Projects

Dayly owns task content, lifecycle, task/project membership, priorities, deadlines, tags, schedule blocks, and user completion decisions. A provider event or NutriTrack signal cannot mutate those records without a separately approved Dayly application action. Future AI must use application services and explicit confirmation.

### 3.2 Dayly Calendar

Dayly owns its own Calendar Events and planning blocks. A Calendar Event is not a provider event mirror and a Schedule Block is not automatically an event. A future export/write integration must explicitly define which Dayly-owned objects are eligible and how conflicts are resolved.

### 3.3 Habits and Focus

Dayly owns Habit definitions, occurrence actions, and Focus Sessions. The completion of a Task, the end of an Event, or the presence of a NutriTrack value cannot silently create a Habit completion or Focus Session.

### 3.4 Analytics and Today

Dayly owns the definitions and presentation of its derived analytics, but not an additional copy of source facts. Metric calculations must state period, source data, missing-data treatment, and formula/version where relevant.

## 4. NutriTrack boundary

### 4.1 What Dayly may eventually consume

Subject to a future contract, explicit consent, and privacy review, Dayly may consume narrowly scoped read-oriented summaries such as:

- a daily nutrition summary;
- energy/calorie context if it is supplied and meaningful for the agreed Dayly use case;
- broad macro or meal-completeness context;
- freshness/source period and sync status;
- other explicitly approved non-medical signals that help contextualize the user's day.

These are candidate categories, not a committed API or metric list. Dayly must not replicate NutriTrack's internal meal, nutrition, health, or calculation model.

### 4.2 Conceptual connection data

A future NutriTrack connection may include:

- Dayly User owner;
- provider key and external user reference;
- connection state;
- consent version and selected scopes/categories;
- last successful and attempted synchronization moments;
- freshness/stale/error state;
- source period for each cached summary;
- deletion/disconnect treatment.

Provider credentials/tokens are not ordinary Dayly domain data and must be handled by a future secure integration boundary.

### 4.3 Read model rules

- Store only the approved summary needed for the Dayly experience.
- Preserve source period and freshness next to the summary.
- Make the source label visible in UX wherever the value is shown.
- Treat stale or missing data as a known state, not a current zero.
- Do not allow the cached summary to edit NutriTrack.
- Do not expose medical claims, diagnoses, or unsupported productivity conclusions.
- Disconnecting stops new data and follows an explicit retention policy for existing cache data.

## 5. External calendar boundary

### 5.1 Provider-neutral concepts

The future integration architecture should use provider-neutral concepts:

```text
Integration Connection
       ├── External Calendar
       │       └── External Event
       └── Sync State / Conflict Metadata
```

A connection can target Google Calendar, Apple Calendar, Outlook, or another approved provider without placing provider-specific identifiers on Task or Dayly Calendar Event records.

### 5.2 External calendar data

A future External Calendar read model may include:

- provider and external account reference;
- external calendar identifier and display name;
- selected/enabled state;
- provider time zone;
- last synchronized moment;
- event read models with external event and occurrence identifiers;
- provider revision/etag where needed;
- source lifecycle (active, deleted, stale);
- sync/conflict status.

### 5.3 Source and write rules

- External Events remain provider-owned by default.
- Imported events are source-labeled in Calendar and Today.
- External Events do not automatically create Tasks.
- Dayly Schedule Blocks remain Dayly-owned even when external events affect availability.
- Provider write-back is not assumed. If introduced, the allowed object types, permissions, source precedence, conflict resolution, retry, and deletion behavior must be documented first.
- A provider disconnect must stop synchronization and preserve Dayly-owned records.

## 6. Derived data ownership

Derived values have no independent user ownership even though access is scoped to a User:

- Today is derived from the User's time zone, source records, and preferences.
- Overdue is derived from Task deadline/status and current time.
- Streak and Consistency are derived from Habit and Occurrence facts.
- Project Progress is derived from Project/Task facts under a formula that is not final.
- Daily Progress and analytics are derived read models with explicit periods.
- Search results are derived retrieval output.

A cache of any of these values is owned by Dayly as an implementation artifact, not as a new user-editable source.

## 7. Future shared/team boundary

The current model assumes one User owner and no team collaboration. If shared Projects or Tasks are introduced later:

- membership/role must be a new explicit relationship;
- ownership and edit permission must be distinguished;
- RLS must move from only `user_id` to a controlled membership policy;
- existing personal records must not become shared by default;
- integrations and health context must not become visible to other members without separate consent.

No shared/team entity is justified in the current scope.

## 8. Ownership review checklist

Before a future entity or field is added, ask:

1. Which domain owns this fact?
2. Is it user-editable or derived?
3. Does it have an external source of truth?
4. What provenance and freshness must be visible?
5. Can the same fact be represented by an existing relationship instead of duplicated?
6. What happens when the external connection is disconnected?
7. Can a User access another User's record through every query path?
8. Is the feature part of the MVP or explicitly deferred?

## 9. Phase boundary

This boundary document does not define or implement:

- NutriTrack API contracts;
- Google/Apple/Outlook authorization or sync;
- provider tokens;
- authentication;
- RLS policies;
- database tables or migrations;
- application code;
- PHASE 0D Integrations Architecture.
