# Dayly Information Architecture

**Phase:** 0B — UX Architecture & Information Architecture
**Status:** Approved (historical)
**Source of truth:** [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md)

> This document defines the conceptual information architecture and navigation model. It does not define routes, implementation details, database structures, or production UI code.

## 1. IA goals

Dayly's information architecture should make the user's daily loop easy to follow:

```text
Understand the day
       ↓
Choose what matters
       ↓
Allocate time
       ↓
Execute
       ↓
Review
```

The architecture must:

- make **Today** the most direct path to daily action;
- keep the product's domain distinctions visible without forcing users to learn the internal model;
- support fast capture before detailed organization;
- expose planning and execution together without making one screen responsible for every piece of data;
- use progressive disclosure for advanced task, recurrence, scheduling, and analytics details;
- provide predictable cross-links between a source record and its contextual views;
- remain usable on a narrow mobile viewport without being a compressed desktop sidebar;
- make external and future integration content clearly contextual and source-labeled.

## 2. Primary information hierarchy

### 2.1 Top-level application tree

```text
Dayly
├── Today
├── Tasks
│   ├── Inbox (triage view, not a separate domain)
│   ├── All Tasks
│   ├── Planned / Scheduled
│   ├── Completed
│   └── Saved filters and tags (future)
├── Projects
│   ├── Active
│   └── Archived
├── Calendar
│   ├── Day
│   ├── Week (later view)
│   └── Month (later view)
├── Habits
│   ├── Today
│   ├── All Habits
│   └── History
├── Focus
│   ├── Timer
│   └── History
├── Analytics
│   ├── Today
│   ├── Week
│   └── Month
├── Search (global destination and overlay entry)
└── Settings
    ├── Profile
    ├── Appearance
    ├── Planning
    ├── Notifications
    ├── Calendar
    ├── Integrations (future connections)
    ├── Privacy
    ├── Data
    └── Account
```

### 2.2 Destinations that are deliberately not top-level

The product has more concepts than primary navigation items. The following remain contextual or utility destinations:

- **Inbox** is a task triage view under Tasks. It is not a separate object or top-level section.
- **Notifications** is a global utility surface and settings category. It can open from a header indicator or relevant reminder, but does not need permanent primary navigation.
- **Profile** is a Settings subsection and a utility-menu entry, not a daily destination.
- **Integrations** is a Settings subsection because connections are configuration and consent concerns. External calendar and NutriTrack content appears in its owning contextual views after connection.
- **Task Detail, Project Detail, Habit Detail, and Calendar Event Detail** are entity views reached from lists, Today, Search, or deep links. They are not primary nav items.
- **Create and Edit** experiences are contextual forms or focused screens, not permanent destinations.
- **Command Palette** is a global overlay that accelerates navigation and actions. It does not create a new hierarchy.
- **NutriTrack summary** is an optional, source-labeled contextual card on Today or a future health context area; it is not a Dayly health section.

This keeps the primary navigation small without hiding important actions.

## 3. Destination definitions

### 3.1 Today

**Purpose:** The primary daily control surface for understanding, prioritizing, planning, and executing the current day.

**Primary user intent:** Decide what to do next and keep the plan realistic.

**Secondary actions:** Add a task, create an event, schedule work, complete a task, record a habit, start focus, reschedule, inspect a project, and review relevant progress.

**Important information:** Current date/time context, next commitment, scheduled events and task blocks, important or overdue tasks, available time, habits due, active focus, completed work, and an explainable day-progress summary.

**Relationships:** Composes Tasks, Projects, Calendar, Habits, Focus, Notifications, and Analytics. It presents their information but does not own their records. A future NutriTrack card is optional and clearly contextual.

### 3.2 Tasks

**Purpose:** Capture, organize, retrieve, schedule, and complete actionable work.

**Primary user intent:** Find or change the next actionable task.

**Secondary actions:** Triage Inbox items, filter by status or date, assign projects/tags, set priority and deadlines, add subtasks, schedule work, archive, and open analytics context.

**Important information:** Task title, status, priority, deadline, scheduled blocks, estimate, project, tags, and completion state.

**Relationships:** Links to Today for daily action, Projects for outcomes, Calendar for schedule, Focus for actual effort, Search for retrieval, and Analytics for derived measures.

### 3.3 Projects

**Purpose:** Organize tasks around an outcome or body of work larger than one action.

**Primary user intent:** Understand what work remains for an outcome and choose a task.

**Secondary actions:** Create and archive a project, add or remove tasks, filter tasks, set target context, inspect activity, and open project-related analytics.

**Important information:** Project outcome, lifecycle state, task groups, deadlines or target dates where present, and a clearly labeled progress presentation.

**Relationships:** Contains or references Tasks; links to Calendar for scheduled work and Today for attention cues. Progress remains derived and strategy-dependent.

### 3.4 Calendar

**Purpose:** Plan work and review time-bound commitments in Dayly's temporal layer.

**Calendar local views:** Day view is the MVP planning view. Week view and Month view are later views that extend orientation without changing source ownership.

**Primary user intent:** Understand how commitments and planned work fit into available time.

**Secondary actions:** Move between views, create an event, schedule a task block, reschedule, inspect a conflict, review availability, and later inspect source/sync details.

**Important information:** Dayly-owned events, scheduled task blocks, availability, recurring items, time-zone context, and future external events with source labels.

**Relationships:** Tasks provide scheduled work; external integrations provide optional provider events; Today summarizes the current day; Focus may be launched from a planned task block.

### 3.5 Habits

**Purpose:** Define recurring behaviors and review their occurrences and consistency.

**Primary user intent:** See what habit is due and record or understand consistency.

**Secondary actions:** Create/edit a habit, complete or review an occurrence, view streak/history, pause or archive where supported, and inspect analytics.

**Important information:** Habit name, recurrence, due occurrences, completion state, streak, consistency period, and missed occurrences.

**Relationships:** Today surfaces due habits; Notifications may remind; Analytics reads completion history. Habits remain separate from Tasks and Calendar Events.

### 3.6 Focus

**Purpose:** Start intentional work sessions and record actual effort.

**Primary user intent:** Work on a chosen task or project and capture trustworthy duration.

**Secondary actions:** Select context, choose a duration, pause/resume, finish, record an interruption note, and review history.

**Important information:** Active timer state, task/project context, elapsed and actual duration, interruption state, and session history.

**Relationships:** May be launched from Today, Tasks, Projects, or Calendar. Actual duration contributes to Analytics but does not complete a Task automatically.

### 3.7 Analytics

**Purpose:** Help the user learn from plans, actions, time, projects, and habits.

**Primary user intent:** Answer a planning or review question with understandable evidence.

**Secondary actions:** Change period, inspect a metric, drill to source records, compare trends, and identify items needing attention.

**Important information:** Task completion, overdue work, planned versus actual duration where valid, focus time, project progress, habit consistency, and data completeness/provenance.

**Relationships:** Reads from other domains and links back to them. It does not become a second editing surface or a universal productivity score.

### 3.8 Search

**Purpose:** Retrieve Dayly information quickly across the domains the user can access.

**Primary user intent:** Find a task, project, habit, event, or future content item.

**Secondary actions:** Filter by type/status/date/source, open a result in context, repeat a recent query, and use the keyboard shortcut or mobile entry.

**Important information:** Query, grouped result types, matching text, dates, project/source labels, and no-result guidance.

**Relationships:** Opens source-owned detail screens. Search can index domains without owning or editing their records.

### 3.9 Settings

**Purpose:** Manage personal preferences, planning defaults, notification behavior, privacy, data, and future connections away from daily execution.

**Primary user intent:** Change how Dayly behaves or review account/data controls.

**Secondary actions:** Change appearance, time zone, availability, notification rules, calendar preferences, integrations, privacy, data, and account settings.

**Important information:** Current preferences, permission/consent state, connection health, and destructive-action warnings.

**Relationships:** Settings affect other modules through explicit preferences. Profile and Integrations are subsections, not competing primary destinations.

## 4. Navigation architecture

### 4.1 Desktop shell

Desktop uses a persistent application shell with three zones:

```text
┌─────────────────────────────────────────────────────────────┐
│ Brand / workspace context       Search   Quick Add   Profile │
├───────────────┬─────────────────────────────────────────────┤
│ Primary nav   │                                             │
│ Today         │                                             │
│ Tasks         │              Current destination             │
│ Projects      │                                             │
│ Calendar      │                                             │
│ Habits        │                                             │
│ Focus         │                                             │
│ Analytics     │                                             │
│ Search        │                                             │
│               │                                             │
│ Settings      │                                             │
│               │                                             │
│ Help/status   │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

**Primary navigation:** Today, Tasks, Projects, Calendar, Habits, Focus, Analytics, Search, Settings.

**Secondary navigation:** Appears inside the destination header or a local navigation row. Examples include Tasks → Inbox/All/Planned/Completed, Calendar → Day/Week/Month, and Analytics → Today/Week/Month. Secondary navigation should not duplicate the global sidebar.

**Workspace/project context:** Dayly is initially personal. A compact product/workspace label may exist for orientation, but the UX must not imply team/workspace switching before that model is defined.

**Global utilities:** Search entry, command palette shortcut, quick-add, notification indicator if needed, profile/settings access, connection status, and help/status. Utilities should not compete visually with Today and primary navigation.

**Sidebar behavior:** The sidebar may collapse to an icon rail on wide screens, but icons must retain accessible labels and the current destination must remain obvious. Collapsing is a preference, not a requirement for understanding the product.

### 4.2 Mobile shell

Mobile uses a task-oriented shell rather than a reduced desktop sidebar:

```text
┌───────────────────────────┐
│ Menu / title   Search ⋯   │
├───────────────────────────┤
│                           │
│       Current content     │
│                           │
│                    +      │  Quick action button or equivalent
├───────────────────────────┤
│ Today Tasks Calendar Focus│
│                 More      │
└───────────────────────────┘
```

**Persistent mobile destinations:** Today, Tasks, Calendar, and Focus are the most frequent action paths. The fifth position is **More**, which opens Projects, Habits, Analytics, Search, Settings, and future utilities. If testing shows Habits or Projects needs persistent access, the set can be revisited; it must not become a crowded six- or seven-item bar.

**Mobile header:** Provides back/menu context, current section title, search access, and a contextual overflow menu. It does not carry every desktop utility at once.

**Quick-add:** A prominent but non-obstructive action opens a bottom sheet or focused full-screen flow with Task as the default and Event/Habit available as explicit alternatives. Start Focus remains available from Today, Tasks, Calendar, and Focus.

**Contextual actions:** Row actions move into swipe-safe menus, bottom sheets, or a detail header. Destructive actions require an explicit confirmation or reversible undo.

**Navigation drawer:** The More surface may be a full-height drawer or sheet containing lower-frequency destinations and Settings. It is not the main path for Today, Tasks, Calendar, or active Focus.

### 4.3 Tablet shell

Tablet uses a hybrid shell:

- persistent compact sidebar or navigation rail in landscape;
- top-level destination title and local navigation remain visible;
- detail views can use a list-plus-detail split when width permits;
- in portrait, the mobile bottom navigation and drawer model may apply;
- forms and detail panels should not be forced into a desktop multi-column layout when the available width is limited.

### 4.4 Global navigation behavior

- Every destination has a clear current-state indicator.
- Back returns to the previous meaningful context, not always to the top-level destination.
- Opening a detail view from Today preserves a path back to the same day and relevant position.
- A deep link to an entity opens its owning detail screen and exposes links to related records.
- Creating an item returns the user to the context from which creation began, with a visible success state and the new item available.
- A failed save keeps entered values and offers a retry path.
- Search and command palette results open the source-owned destination, not a detached duplicate.

## 5. Today information hierarchy

Today is not a dashboard of equal-weight cards. It is a daily decision surface with explicit layers.

### 5.1 Primary layer: immediate orientation and action

Visible early and usable without scrolling where the viewport allows:

1. **Date and local context** — day, date, current time, and a short greeting or context line when helpful.
2. **Next commitment** — the next event or scheduled block, with time and source/ownership.
3. **Focus decision** — the task or small set of important tasks that should receive attention next.
4. **Day progress** — a concise, explainable summary of completed versus remaining planned work, not a universal score.

The primary layer should support quick completion, start focus, and rescheduling.

### 5.2 Secondary layer: execution context

Visible after orientation or alongside it depending on viewport:

- today's timeline or agenda;
- prioritized task list with due/overdue distinctions;
- scheduled task blocks;
- available versus occupied time;
- habits due today;
- active focus session and recent completion;
- upcoming items that affect the plan.

The ordering may adapt to the day. A day with a current active focus session should show that session before an empty-state project card.

### 5.3 Contextual layer: review and optional information

Shown when relevant, available, or requested:

- completed-today details;
- project attention cues;
- relevant day analytics;
- notification or integration health;
- NutriTrack summary after a future connection;
- upcoming week preview;
- empty or educational guidance for a new user.

Contextual content should not push the next useful action below decorative or low-priority information.

### 5.4 Widget visibility rules

| Widget | MVP default | Visibility rule |
|---|---|---|
| Date and local context | Always | Primary orientation |
| Day progress | Usually | Show when there is meaningful data; use a calm first-use state otherwise |
| Next calendar event | When available | Primary if a commitment is imminent; otherwise compact |
| Focus/task summary | Always actionable | Show the next recommended action or current session |
| Important task list | Always when tasks exist | Prioritize due, overdue, high-priority, and explicitly scheduled work |
| Timeline | Day view default | Show enough context to plan; allow collapse on mobile |
| Habits | When due or recently acted on | Do not crowd an empty habit state into the primary layer |
| Focus session | When active or recently used | Active session is prominent; idle state is a quick action |
| Analytics | Contextual | Use one or two actionable signals, not a chart wall |
| NutriTrack summary | Future and optional | Only after connection, with source/freshness label and user relevance |
| Upcoming items | Contextual | Show when the next day or week affects current decisions |

### 5.5 Today states

- **First use:** Explain the daily loop and offer one clear action: create the first task. Do not show a grid of empty cards.
- **Empty day:** Show the date and availability, then offer quick actions for task/event/habit. A completely empty day is not an error.
- **Busy day:** Group and prioritize; avoid presenting every item as equally urgent.
- **Active focus:** Keep timer state visible and preserve access to the associated task.
- **Behind plan:** State what is unfinished and offer reschedule/reprioritize actions without judgment.
- **No availability configured:** Say that remaining capacity is unknown and link to Planning settings; do not claim unlimited time.
- **Integration stale/error:** Keep Dayly-owned planning usable and label external context as stale or unavailable.

## 6. Task information architecture

### 6.1 Task views

Tasks has a local navigation model:

```text
Tasks
├── Inbox       captured items awaiting triage; a view, not a canonical status
├── All Tasks   all active task records
├── Planned     tasks with planning metadata or a chosen plan
├── Scheduled   tasks with one or more scheduled blocks
├── Completed   completed task history
└── Filters     priority, project, tag, date, and status filters
```

**Inbox definition:** Inbox is a capture/triage view for tasks not yet fully organized. It should not be treated as a separate domain object or automatically equated with `Open`. A task can be open and organized while no longer needing Inbox triage. The exact domain flag or derived rule is unresolved for the data-model phase.

**Planned versus Scheduled:** Planned can mean a task has been intentionally prepared with relevant planning information; Scheduled means it has a concrete time block. The UI must not imply that an unscheduled task is unplanned unless the product later adopts that rule.

### 6.2 Task detail hierarchy

1. title and completion action;
2. current status and priority;
3. deadline and scheduled blocks;
4. project and tags;
5. estimate/actual time;
6. description and notes;
7. subtasks;
8. reminders and recurrence;
9. activity/history and related focus sessions.

Advanced sections remain collapsed or secondary until relevant.

### 6.3 Task states and user-visible conditions

The requested task labels do not all represent the same kind of concept. The UX must distinguish lifecycle states from derived conditions and list views:

| Label | UX treatment | Domain status or derived condition |
|---|---|---|
| **Inbox** | Triage view for captured tasks that still need organization. | View/triage condition; not a canonical lifecycle state. Exact rule is unresolved. |
| **Planned** | Tasks that have intentional planning context or appear in the Planned view. | Planning view/condition; not necessarily a lifecycle state. Exact rule is unresolved. |
| **Scheduled** | Task has one or more concrete scheduled blocks. | Derived planning condition; not a replacement for task status. |
| **In Progress** | User has intentionally started work when this status is supported. | Candidate lifecycle state; focus starting does not infer it automatically. |
| **Completed** | User explicitly declares the actionable work done. | Canonical lifecycle state from the product model. |
| **Overdue** | An incomplete task's deadline has passed. | Derived condition; it should remain visible alongside its lifecycle state. |
| **Cancelled** | Reserved for work intentionally stopped without completion. | Not currently justified as an independent state in the approved product specification; exclude from MVP until a product decision defines its history and relationship to Archive. |
| **Archived** | Task is removed from active planning but retained under the future retention policy. | Canonical lifecycle state from the product model. |
| **Open** | Task is actionable and not completed/archived. | Baseline lifecycle state, even though it is not in the prompt's label list. |

A single task can therefore be **Open**, **Scheduled**, and **Overdue** at the same time. The interface should not force these conditions into one mutually exclusive status field. This preserves the product rule that a deadline, schedule, focus session, and completion decision have different meanings.

## 7. Cross-module relationships

| From | To | UX relationship |
|---|---|---|
| Today | Task Detail | Opens task without losing the selected day context |
| Today | Calendar | Opens the day at the relevant time or item |
| Today | Habit Detail | Opens the due occurrence context |
| Today | Focus | Starts or resumes focus with optional task context |
| Task Detail | Project Detail | Opens the containing project with the task visible |
| Task Detail | Calendar | Schedules or reviews the task's blocks |
| Task Detail | Focus | Starts focus pre-associated with the task |
| Project Detail | Task Detail | Opens a task in its project context |
| Calendar | Task Detail | Scheduled Task opens task; Calendar Event opens event detail |
| Calendar | Focus | Starts focus for a scheduled task, never for an unrelated external event without confirmation |
| Habit Detail | Analytics | Opens consistency history for the habit |
| Focus History | Task/Project Detail | Opens the associated source when present |
| Analytics | Source record | Drill-down returns to the owning module |
| Search | Any source | Results preserve source labels and open canonical detail |
| Settings | Integrations | Opens connection and consent management; does not replace contextual display |

## 8. Scope and phase alignment

- The architecture supports the MVP in `PRODUCT_SPEC.md` without adding a new product domain.
- Google Calendar and NutriTrack destinations are represented as future settings/context flows, not MVP navigation requirements.
- Week/month calendar views, advanced filters, rich recurrence, and expanded analytics are available as later local views without changing the top-level hierarchy.
- The UX prompt requests Inbox, Notifications, Profile, and Integrations in the screen inventory. The product specification does not require them as top-level destinations; this IA places them contextually as described above.
- No contradiction with the product scope was found. The only intentionally unresolved behavior is marked in this document and the UX decision log rather than silently fixed.
