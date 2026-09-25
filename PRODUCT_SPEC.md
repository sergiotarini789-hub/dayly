# Dayly Product Specification

**Phase:** 0A — Product Foundation & Specification

**Status:** In progress

**Document role:** Product source of truth for future design and implementation

> This document defines product behavior, scope, responsibilities, and domain boundaries. It does not define a database schema, API contract, authentication implementation, integration implementation, or application UI.

## 1. Product Overview

### 1.1 What Dayly is

Dayly is a personal productivity platform for understanding a day, deciding what matters, allocating available time, executing work, and reviewing progress. It brings tasks, projects, planning, calendar information, habits, focus sessions, analytics, and selected information from NutriTrack into one coherent personal workflow.

Dayly is not intended to be a collection of disconnected feature pages. Its primary experience is a useful daily loop:

1. Understand the day and available time.
2. Choose the work and behaviors that matter.
3. Allocate work to realistic times.
4. Execute and record what actually happens.
5. Review progress and use the learning to plan better.

### 1.2 Problem to solve

People often spread their commitments across a task list, a calendar, habit trackers, timers, and health tools. A task list can say what needs doing, but it does not necessarily show whether the task fits in the day. A calendar shows fixed commitments, but not always the work needed around them. Timers record effort without necessarily connecting it to plans, and analytics can become disconnected from decisions.

Dayly should reduce this fragmentation without hiding important distinctions. It should make the relationship between intention, time, action, and reflection visible while keeping each type of information in the domain where it belongs.

### 1.3 Who Dayly is for

Dayly is for individuals who:

- want a dependable daily planning and execution workflow;
- manage several areas of personal work or life without needing enterprise project management;
- need both deadlines and realistic time allocation;
- want to build recurring habits without confusing them with one-off work;
- value lightweight evidence about how plans compare with actual time;
- already use, or may use, NutriTrack for nutrition and selected health-related tracking.

The initial product is personal. It is not optimized for teams, complex permissions, or large-scale portfolio management.

### 1.4 Product philosophy

Dayly should help a person answer, in order:

1. **What is happening today?**
2. **What matters most?**
3. **When can it realistically happen?**
4. **What should I do next?**
5. **What actually happened?**
6. **What should I learn for the next plan?**

The product favors clarity over exhaustive configuration. It should be quick for an ordinary day and still provide enough structure for a demanding one. Information should be progressively disclosed: the most important decisions are visible first, while advanced detail remains available when needed.

### 1.5 How Dayly differs from a basic todo application

A basic todo application primarily stores and displays tasks. Dayly treats a task as one part of a larger, explicitly separated system:

- projects provide an outcome-oriented container for related work;
- the Dayly calendar and scheduling layer connect work to available time;
- habits represent recurring behaviors and their consistency;
- focus sessions record actual effort rather than planned effort;
- analytics compare plans, actions, and outcomes;
- selected external data can provide context without transferring ownership of another product's domain.

Dayly therefore does not promise that every item becomes a task, that every task becomes a calendar event, or that every metric should be combined into a single score. It provides useful connections while preserving domain meaning.

---

## 2. Product Ecosystem

### 2.1 Ecosystem relationship

```text
                 +----------------------+
                 |      NutriTrack      |
                 | Nutrition and health |
                 +----------+-----------+
                            |
                  selected, governed data
                            |
+------------------+        v        +------------------------+
| External         | <-------------> |         Dayly          |
| calendar         | provider sync  | planning and execution |
| providers        |                 +-----------+------------+
+------------------+                             |
                                                |
                                  future integration adapters
                                                v
                                      Other future services
```

Dayly is the personal planning and productivity product. NutriTrack remains a separate product and domain owner for nutrition and health-related tracking. External calendar providers remain the owners of their provider calendars. Future integrations must connect through explicit adapters and contracts rather than making Dayly responsible for unrelated systems.

### 2.2 Ownership and data flow

| System | Owns | Dayly may consume | Dayly must not do |
|---|---|---|---|
| **Dayly** | Tasks, projects, Dayly events, schedules, time blocks, habits, focus sessions, product preferences, and Dayly analytics | Its own records and governed integration summaries | Treat external data as if Dayly were its source of truth without a defined policy |
| **NutriTrack** | Nutrition records, health-related records, nutrition calculations, and NutriTrack-specific business rules | A deliberately selected and documented subset of read-oriented data | Reimplement NutriTrack calculations, edit NutriTrack records without an explicit future contract, or provide medical conclusions |
| **External calendars** | Provider calendar events and provider-specific recurrence/sync behavior | Events, availability signals, and sync metadata allowed by the connection | Silently overwrite provider data or assume all provider events are Dayly-owned |
| **Future integrations** | Their own source domains | Contracted data needed for a user-approved Dayly use case | Expand Dayly scope merely because a connector is technically possible |

### 2.3 Integration principles

- Integrations are optional extensions to a useful Dayly core, not prerequisites for basic task management.
- Each integration has a clear source of truth, direction of data flow, identity model, sync status, and failure behavior.
- Dayly stores only the data needed for the user-facing experience and the agreed operational contract.
- Imported data retains provenance so users can distinguish Dayly-owned records from external information.
- Disconnecting an integration must not silently delete Dayly-owned data.
- Integration errors are visible and recoverable; they are not silently treated as successful synchronization.
- No integration may bypass the domain boundaries in this specification.

---

## 3. Core Modules

The modules below describe product responsibilities, not necessarily separate screens or deployable services. A future implementation may organize them differently as long as the responsibilities and boundaries remain clear.

### 3.1 Dashboard

**Purpose**

The Dashboard, especially the **Today** view, is Dayly's primary daily control surface. It turns information from the other modules into a focused answer to what is happening now and what should happen next.

**Primary user actions**

- open the current day and understand its shape;
- review fixed events, scheduled tasks, time blocks, and available time;
- identify important or overdue work;
- complete, reschedule, reprioritize, or start a task;
- record a habit occurrence;
- start a focus session;
- inspect progress and what is coming next;
- replan when the day changes.

**Important data**

- current date, local time, and active time zone;
- Dayly events, external events when connected, scheduled task blocks, and availability;
- prioritized tasks, deadlines, estimates, completion state, and project context;
- habit occurrences and current streak context;
- active or recent focus sessions;
- day progress and relevant analytics summaries;
- notification and integration status where action is required.

**Dependencies**

Tasks, Projects, Calendar, Habits, Focus, Analytics, Notifications, and optional integration summaries.

**Outside this module's responsibility**

The Dashboard does not become the canonical owner of tasks, events, habit rules, focus records, or analytics calculations. It presents and coordinates actions against those domains; it does not duplicate their business logic.

### 3.2 Tasks

**Purpose**

Tasks represent actionable units of work that a person may complete, schedule, delegate conceptually in the future, or associate with a project.

**Primary user actions**

- create, edit, complete, reopen, archive, and delete or otherwise remove a task according to the eventual retention policy;
- set a title, details, priority, deadline, estimate, tags, and project;
- add subtasks or a parent task;
- schedule work into one or more planned time blocks;
- add reminders and recurrence when supported;
- link a task to a focus session;
- filter and search for work.

**Important data**

Title, description, status, priority, deadline, scheduled time or blocks, estimated and actual duration, project, parent/subtasks, tags, recurrence, reminders, and timestamps. The full product-level task model appears in Section 6.

**Dependencies**

Projects for context, Calendar for scheduling, Notifications for reminders, Focus for actual effort, Analytics for derived measures, Search for retrieval, and Dashboard for presentation.

**Outside this module's responsibility**

Tasks do not own project-level outcomes, calendar-provider synchronization, habit recurrence, or nutrition data. Completing a task does not automatically complete a habit or imply that a calendar event occurred.

### 3.3 Projects

**Purpose**

Projects group related tasks around an outcome or body of work that is larger than one actionable unit.

**Primary user actions**

- create, name, describe, prioritize, pause, archive, or close a project;
- define a desired outcome and, where useful, a target date;
- add, remove, and organize tasks;
- inspect progress, remaining work, and recent activity;
- identify projects that need attention.

**Important data**

Project name, outcome, description, lifecycle state, target date if any, task membership, project priority, and derived progress indicators.

**Dependencies**

Tasks provide the project work; Calendar and Dashboard expose timing; Analytics derives progress and trends; Search provides retrieval.

**Outside this module's responsibility**

Projects do not replace task details, schedule their own time without a task or explicit event, manage habit streaks, or own focus timing. A project may be useful without having every task scheduled.

### 3.4 Calendar

**Purpose**

The Calendar is Dayly's temporal planning layer. It represents commitments, events, scheduled work, time blocks, and availability so the user can judge whether a plan fits in time.

**Primary user actions**

- view a day or broader planning period;
- create and edit Dayly-owned events;
- schedule, split, move, or reschedule task work;
- create time blocks and compare them with availability;
- review recurring events and imported events;
- identify overlaps and conflicts;
- replan without changing a task's deadline by accident.

**Important data**

Events, scheduled task blocks, time blocks, start and end times, time zones, recurrence, source/provenance, availability windows, exceptions, and conflict/sync state.

**Dependencies**

Tasks for scheduled work, External Calendar Integrations for provider data, Notifications for reminders, Dashboard for daily presentation, Settings for time-zone and availability preferences.

**Outside this module's responsibility**

The Calendar does not decide whether a task is complete, define project progress, calculate habit streaks, or own external provider accounts. Provider synchronization is governed by the External Calendar Integrations module.

### 3.5 Habits

**Purpose**

Habits represent recurring behaviors that are evaluated by consistency across expected occurrences, rather than by the one-time completion of a task.

**Primary user actions**

- create and name a habit;
- choose a recurrence pattern, preferred time, and optional goal or description;
- complete, skip, or mark an occurrence according to the supported product rules;
- pause or archive a habit;
- review streaks, missed occurrences, and consistency.

**Important data**

Habit definition, recurrence, preferred time or context, occurrence state, completion timestamp, current and historical streaks, pause/exception information, and notes where supported.

**Dependencies**

Dashboard for daily action, Notifications for reminders, Analytics for consistency, Calendar only when a habit has a deliberate planning representation, and Settings for time-zone preferences.

**Outside this module's responsibility**

Habits do not become tasks merely because they recur. The module does not own nutrition or medical interpretations, and a habit completion does not automatically create a focus session or calendar event.

### 3.6 Focus

**Purpose**

Focus records intentional work sessions and actual elapsed effort, optionally connected to a task or project.

**Primary user actions**

- start, pause, resume, and finish a focus session;
- choose or change the associated task or project before or during a session according to product rules;
- record a useful note or interruption context;
- inspect actual duration and recent focus history.

**Important data**

Session start/end, paused time, actual duration, associated task or project, session state, user notes, and completion/termination reason.

**Dependencies**

Tasks and Projects for context, Dashboard for access, Notifications for timer-related prompts, Analytics for actual-time measures.

**Outside this module's responsibility**

Focus does not automatically mark a task complete, create an estimate, or reschedule a calendar block. A timer is evidence about actual effort, not proof that the intended work was fully done.

### 3.7 Analytics

**Purpose**

Analytics turns trustworthy Dayly activity into information that helps the user make better planning and execution decisions.

**Primary user actions**

- review daily, weekly, and monthly summaries;
- compare planned and actual time where the data supports comparison;
- inspect completion, overdue work, project progress, focus time, and habit consistency;
- identify trends and drill into the records behind a metric;
- use findings to adjust future plans.

**Important data**

Completed and incomplete tasks, deadlines, schedule and estimate data, focus sessions, project states, habit occurrences, calendar context, and metric provenance/time range.

**Dependencies**

Tasks, Projects, Calendar, Focus, Habits, and optionally governed integration summaries. Analytics should consume domain facts rather than own them.

**Outside this module's responsibility**

Analytics does not edit source records, produce medical or psychological diagnoses, award a universal productivity score, or optimize for visually impressive charts without a decision use case.

### 3.8 Notifications

**Purpose**

Notifications provide timely, user-controlled prompts for tasks, events, habits, focus sessions, and important system or integration states.

**Primary user actions**

- receive a reminder;
- open the relevant item;
- snooze, dismiss, or mark a reminder handled where supported;
- configure notification preferences and quiet periods.

**Important data**

Trigger source, intended delivery time, channel, delivery/handling state, snooze information, user preferences, and quiet-period rules.

**Dependencies**

Tasks, Calendar, Habits, Focus, Settings, and integration sync status.

**Outside this module's responsibility**

Notifications do not own the deadline, event, habit, or task that triggered them. They must not become an unbounded messaging inbox or send reminders the user cannot control.

### 3.9 Search

**Purpose**

Search provides fast retrieval across the Dayly information a person owns or is allowed to see.

**Primary user actions**

- search by words or phrases;
- filter by type, project, status, date, tag, or source where supported;
- open a result in its owning module;
- find incomplete, overdue, or recently changed items.

**Important data**

Searchable titles, descriptions, project context, tags, dates, statuses, source labels, and result ranking metadata.

**Dependencies**

Tasks, Projects, Calendar, Habits, Focus, and integration provenance. Search may index these domains but does not replace them.

**Outside this module's responsibility**

Search does not create an alternate source of truth, decide priorities, infer sensitive health conclusions, or silently mutate a result.

### 3.10 Settings

**Purpose**

Settings centralizes personal preferences, behavior choices, privacy controls, time-zone and availability configuration, and connection management.

**Primary user actions**

- manage profile and workspace preferences when those concepts exist;
- set time zone, working availability, week/day display preferences, and defaults;
- configure notification and privacy preferences;
- manage connected providers and data permissions;
- export or delete data when supported by the eventual retention policy.

**Important data**

User preferences, locale and time zone, availability rules, notification settings, privacy/consent state, integration connection state, and product defaults.

**Dependencies**

All modules consume relevant settings; external and NutriTrack integrations depend on connection and consent controls.

**Outside this module's responsibility**

Settings does not edit the domain objects that preferences affect, implement provider-specific business rules, or act as a substitute for a dedicated privacy policy and retention design.

### 3.11 NutriTrack Integration

**Purpose**

The NutriTrack Integration makes a limited, governed subset of NutriTrack information available in Dayly for context, without transferring ownership of nutrition or health logic to Dayly.

**Primary user actions**

- connect or disconnect NutriTrack;
- review and approve the categories of data Dayly may use;
- view connection and last-sync state;
- view relevant summaries in the agreed Dayly contexts;
- recover from a failed or stale sync.

**Important data**

External connection identity, consent and selected scopes, sync status and timestamps, provenance, normalized read-oriented summaries, and the source period represented by a summary.

**Dependencies**

Settings for consent and connection controls, Dashboard for contextual display, Analytics only when a metric is explicitly defined, and an integration/application layer that uses an agreed NutriTrack contract.

**Outside this module's responsibility**

Dayly does not edit NutriTrack records, recreate NutriTrack's nutrition calculations, store an uncontrolled copy of the NutriTrack domain, provide medical advice, or treat a health signal as a productivity judgment.

### 3.12 External Calendar Integrations

**Purpose**

This module connects external calendar providers to Dayly's planning layer while preserving provider ownership and synchronization provenance.

**Primary user actions**

- connect a supported provider, initially targeted at Google Calendar;
- choose calendars or categories to include;
- view sync status and last successful synchronization;
- request or await synchronization;
- review conflicts, duplicates, permission failures, and stale data;
- disconnect without losing unrelated Dayly records.

**Important data**

Provider identity, selected calendars, external event identity, source and ownership, sync cursor/status, time-zone information, conflict state, and connection permissions.

**Dependencies**

Calendar for presentation and planning, Settings for connection controls, Dashboard for daily context, Notifications for actionable failures, and an integration/application layer for provider-specific behavior.

**Outside this module's responsibility**

It does not redefine the Dayly task model, convert every external event into a task, silently overwrite provider events, or make Dayly events indistinguishable from imported events.

### 3.13 Future AI Assistant

**Purpose**

The future AI Assistant may help a user create, organize, plan, summarize, and learn from structured Dayly information.

**Primary user actions in a future release**

- create a proposed task from natural language;
- decompose a task into suggested subtasks;
- propose a daily plan using deadlines, availability, and estimates;
- summarize progress or identify planning patterns;
- suggest schedule changes or useful follow-up questions.

**Important data**

A controlled context of structured Dayly records, user instructions, proposed changes, explanations, confidence or uncertainty where useful, consent state, and an audit trail of accepted actions.

**Dependencies**

Application services owned by the relevant Dayly domains, Search/Analytics for retrieval and context, and explicit user confirmation for changes. If external or NutriTrack data is included, its permissions and provenance must remain visible.

**Outside this module's responsibility**

The AI Assistant must not directly manipulate the database, bypass domain rules, silently change schedules or completion state, provide medical advice, or replace the primary Dayly product with a generic chatbot. AI is not part of the initial implementation.

---

## 4. MVP Definition

The MVP is the smallest coherent version that lets a person plan and execute an ordinary day, then learn something useful from it. It should not require external integrations or AI to be valuable.

### 4.1 MVP scope

#### Personal foundation and onboarding

- Create or enter a personal Dayly workspace through the eventual identity flow. Authentication implementation is an enabling platform concern and is not being designed or built in Phase 0A.
- Complete lightweight onboarding for time zone, basic availability, and preferred planning defaults.
- Land in a useful Today view after onboarding.

#### Tasks and projects

- Create, edit, view, complete, reopen, and archive tasks.
- Capture title, description, status, priority, deadline, estimate, tags, timestamps, and a project association where relevant.
- Create and manage projects with an outcome, lifecycle state, and task membership.
- Show clear project progress based on a documented, understandable MVP rule.
- Support simple subtasks if they do not compromise the clarity of the main task workflow.

#### Dayly planning and calendar

- View a day with Dayly-owned events, scheduled task blocks, and availability.
- Create and edit Dayly-owned events.
- Schedule task work without confusing a planned time with a deadline.
- Move or reschedule planned work when the day changes.
- Show conflicts and insufficient available time rather than silently overbooking the day.
- Respect the user's configured time zone.

#### Today dashboard

- Show the current date and relevant time context.
- Present today's events and scheduled work in a useful order.
- Surface important, due, and overdue tasks.
- Show completed work, remaining planned work, and a simple day-progress summary.
- Provide direct paths to complete a task, record a habit, start focus, and replan.

#### Habits

- Create a habit with a simple recurrence pattern.
- Record an occurrence as completed or missed according to clear MVP rules.
- Show current streak and basic consistency history.
- Keep habits conceptually and operationally separate from tasks.

#### Focus

- Start, pause, resume, and finish a focus session.
- Associate a session with a task or project optionally.
- Record actual duration and make it available for review.
- Do not infer task completion solely from a focus session.

#### Notifications and search

- Provide essential in-product reminders for supported task, event, habit, and focus cases.
- Let users configure or disable the reminders that MVP supports.
- Provide basic search across tasks and projects, with dates/status filters where practical.

#### Basic analytics

- Show useful daily/weekly summaries for task completion, overdue work, focus time, project progress, and habit consistency where sufficient data exists.
- Distinguish planned duration, estimated duration, and actual focus duration.
- Link metrics back to the underlying records or explain when data is incomplete.

### 4.2 Explicitly not in MVP

The following are intentionally excluded from the first usable release:

- Google Calendar or other external calendar synchronization;
- NutriTrack connectivity and health/nutrition summaries;
- AI planning, natural-language creation, or autonomous actions;
- team collaboration, sharing, roles, and enterprise permissions;
- complex task recurrence and advanced dependency management;
- advanced time optimization, automatic overbooking repair, or predictive planning;
- a universal productivity score or health-based productivity judgment;
- multi-provider integration marketplace functionality;
- complex exports, data portability formats, and retention automation before their policies are defined;
- native mobile applications or a separate wearable experience.

The target integration journeys in Section 5 describe the intended product behavior after the relevant post-MVP capabilities exist. They do not expand the MVP.

### 4.3 Post-MVP

- Google Calendar synchronization, beginning with a deliberately narrow read-oriented or explicitly configured synchronization policy.
- Read-oriented NutriTrack connection with selected summaries, provenance, consent, and stale/error states.
- More complete recurring tasks, advanced subtasks, task dependencies, and richer project views.
- More calendar views, recurring Dayly events, availability exceptions, and improved conflict resolution.
- Push, email, or other notification channels after preference and privacy rules are established.
- More powerful search, saved views, filters, and cross-module retrieval.
- Expanded analytics, trend comparisons, planned-versus-actual analysis, and data export.
- Richer habit scheduling, pauses, skips, exceptions, and historical corrections.
- Additional integrations only after their ownership and sync contracts are documented.

### 4.4 Future / Experimental

- AI-assisted decomposition, daily planning, summaries, and schedule optimization with confirmation.
- Natural-language interaction across structured Dayly data.
- Predictive estimates based on the user's history, with transparent uncertainty.
- Cross-application ecosystem features and automation.
- Optional collaboration experiments that do not compromise the personal-product foundation.
- More complex health-context experiences only after product, privacy, and safety review.

### 4.5 MVP scope rule

If a proposed MVP feature does not help the user understand the day, decide what matters, allocate time, execute, or review progress, it should be deferred unless it is required for reliability, privacy, or basic operability. Integrations and AI must not enter the MVP merely because later journeys mention them.

---

## 5. Core User Journeys

These journeys describe intended product behavior. A journey marked **post-MVP** is a product direction, not a requirement to build it in Phase 0A or the MVP.

### Journey A — First launch → onboarding → first task → first completed task

**Goal:** A new user experiences value without needing a complex setup.

1. The user opens Dayly for the first time and is told that Dayly helps them understand and plan a day.
2. Dayly asks only for the minimum initial choices: personal planning context, time zone, and basic availability/defaults. Optional connections are clearly skippable.
3. The user reaches an empty or guided Today dashboard that explains the next useful action.
4. The user creates a first task with a clear title. Dayly may suggest an estimate or priority field, but must not block creation on advanced metadata.
5. The task appears in the appropriate task and Today views. If the user gives it a deadline or scheduled time, those are shown as distinct concepts.
6. The user completes the task from the task view or Today dashboard.
7. Dayly records completion time and updates the day's completed work and relevant project/analytics summaries.
8. The user can understand what changed without being forced into a tutorial or a celebration flow.

**Success condition:** The user can create and complete a useful task in a short flow and can tell that Dayly recorded it.

**Failure/edge behavior:** Onboarding can be revisited; skipped integrations do not block the first task; an interrupted create flow must not create a misleading partial task.

### Journey B — Create project → add tasks → complete tasks → project progress

**Goal:** The user can manage a body of work without treating the project as a task.

1. The user creates a project with a name and outcome, optionally adding a target date and priority.
2. The user adds existing tasks to the project or creates new tasks in its context.
3. Tasks remain independently actionable, schedulable, and completable.
4. The user completes some tasks, leaves others open, and optionally adds subtasks.
5. The project view shows remaining work and a clearly labeled progress measure based on the supported rule.
6. The Dashboard and Analytics can surface the project when it needs attention.
7. When all intended work is complete, the user closes or archives the project explicitly; Dayly does not close it merely because a single task is complete.

**Success condition:** The user can see both the actionable task state and the broader project state without confusing the two.

### Journey C — Create task → assign deadline → schedule task

**Goal:** The user understands and uses the difference between a deadline and planned time.

1. The user creates a task with a title and optional description.
2. The user sets a deadline, meaning the latest intended completion point or due date according to the product's eventual precision rules.
3. The user reviews available time and schedules one or more planned blocks for the work.
4. Dayly warns when the plan overlaps a fixed event, exceeds known availability, or leaves insufficient time before the deadline.
5. The user confirms, adjusts, or leaves the task unscheduled. Leaving it unscheduled does not remove its deadline.
6. A reschedule changes the plan, not automatically the deadline. A deadline change requires an explicit task edit.
7. Once a block is completed or a focus session records effort, Dayly can compare the plan with actual activity without claiming the task is complete unless the user completes it.

**Success condition:** The user can distinguish “when it must be done” from “when I intend to work on it.”

### Journey D — Open Today dashboard → understand the day → execute tasks

**Goal:** The Today dashboard supports a real decision, not just a summary.

1. The user opens Today and sees the current local date and time context.
2. The dashboard presents fixed events, scheduled task blocks, available time, and notable constraints in a coherent sequence.
3. It highlights the tasks that matter, including due or overdue work, without showing every item with equal visual weight.
4. The user chooses the next action, starts a task or focus session, and can complete the task from the active context.
5. The user records a habit occurrence if one is due.
6. If an event runs late or a task takes longer than expected, the user can reschedule remaining work. Dayly should make the impact visible rather than pretending the original plan is still valid.
7. The dashboard updates completed work, remaining work, what is next, and an understandable day-progress signal.

**Success condition:** The user can answer the seven dashboard questions in Section 8 and take the next action without navigating through unrelated configuration.

### Journey E — Connect Google Calendar → synchronize events (**post-MVP**)

**Goal:** The user can bring provider calendar context into Dayly without losing ownership clarity.

1. From Settings or Calendar, the user chooses to connect Google Calendar and sees what Dayly will read or write.
2. The user grants provider permission and selects the calendars to include.
3. Dayly confirms the connection, selected scope, time zone, and initial sync status.
4. Imported events appear in the Dayly calendar with an unmistakable external source label. They are not silently converted into Dayly tasks.
5. A changed, deleted, duplicate, or conflicting event is handled according to the documented sync policy and shows a recoverable status when needed.
6. The user can request a refresh, review the last successful sync, and disconnect the provider.
7. Disconnecting stops future synchronization while preserving Dayly-owned planning records and making the treatment of imported data explicit.

**Success condition:** The user can rely on synchronized context and knows which system owns each event.

**Open dependency:** Exact sync direction, provider permissions, conflict policy, and imported-event retention require a later integration decision.

### Journey F — Connect NutriTrack → display relevant nutrition information (**post-MVP**)

**Goal:** The user can use selected NutriTrack context in Dayly without turning Dayly into a nutrition tracker.

1. From Settings, the user chooses NutriTrack and sees the categories of information Dayly may use.
2. The user consents to the selected read-oriented data and completes the connection.
3. Dayly shows connection, permission, source period, and last-sync state.
4. A small, clearly labeled summary appears only in the agreed Dayly context, such as a Dashboard context area. The summary includes provenance and does not claim to be a medical interpretation.
5. If data is missing or stale, Dayly says so and provides a recovery path rather than displaying a false current value.
6. The user can change permissions or disconnect. Dayly stops receiving new data, and the treatment of already imported summaries follows the future retention policy.

**Success condition:** Relevant context is available while NutriTrack remains the owner of nutrition and health data and logic.

**Open dependency:** The NutriTrack contract, allowed metrics, consent language, freshness requirements, and data retention are not yet decided.

### Journey G — Create habit → complete habit → view streak

**Goal:** The user tracks a recurring behavior without converting it into a task.

1. The user creates a habit with a name, recurrence, and optional preferred time or context.
2. Dayly presents the next due occurrence in the Dashboard and habit view.
3. The user marks the occurrence complete; Dayly records the occurrence and completion time.
4. The streak advances according to the habit's recurrence and the documented rule, not according to task completion.
5. If the user misses an occurrence, Dayly shows it as missed and updates current streak/consistency according to the product rule.
6. The user can inspect a history of completed and missed occurrences and can pause/archive the habit as supported.

**Success condition:** The user knows what is due, what was completed, and how the streak was calculated.

### Journey H — Start focus session → work → finish → record actual duration

**Goal:** The user captures actual effort without creating false completion.

1. The user starts Focus from a task, project, or the Dashboard and optionally selects the work context.
2. Dayly records the active session state and start time.
3. The user pauses, resumes, or ends the session when work stops. Interruptions are not silently counted as focused work if the product can distinguish them.
4. On finish, Dayly records actual duration and makes the session visible in the task/project context and analytics.
5. The user separately completes the task if the actionable work is done, or leaves it open with an updated understanding of effort.
6. The user can compare the actual duration with the estimate where both are present.

**Success condition:** Focus history is trustworthy enough to inform future estimates while remaining separate from completion state.

---

## 6. Task Model — Product Level

A **task** is a discrete, actionable unit of work that can be intentionally completed by a person or can remain open until a decision is made. A task should be expressible as an action or a bounded piece of work, not merely as a broad area of responsibility.

This is a conceptual model. It is not a database schema, migration plan, or API definition.

### 6.1 Conceptual properties

| Property | Product meaning |
|---|---|
| **Title** | The short, actionable description of the work. Required for a useful task. |
| **Description** | Optional context, acceptance notes, links, or instructions. |
| **Status** | Lifecycle state such as open, in progress, completed, archived, or another documented state. Status must not be inferred solely from a timer. |
| **Priority** | Relative importance or urgency used to support decisions. Priority is not the same as deadline. |
| **Deadline** | The point by which the task should be complete, with the product's supported date/time precision. A deadline is not a planned work block. |
| **Scheduled time** | The time the user intends to work on the task. A task may need one or more planned blocks. Scheduling does not complete the task. |
| **Estimated duration** | The user's or product's current expectation of required work. Estimates are assumptions, not facts. |
| **Actual duration** | Recorded effort, usually informed by focus sessions or an explicit product action. Missing actual duration must remain distinguishable from zero. |
| **Project** | Optional association with a larger outcome. One task's project membership does not make the task identical to the project. |
| **Parent task** | Optional relationship used when a task is part of a larger task. |
| **Subtasks** | More granular actionable units under a parent task. Completion rules for a parent must be explicit and must not be surprising. |
| **Tags** | Optional labels for retrieval and lightweight classification. Tags do not replace projects or priorities. |
| **Recurrence** | An optional rule for producing repeated task work when supported. Recurring tasks remain tasks; they are not automatically habits. Complex recurrence is post-MVP. |
| **Reminders** | Optional user-controlled prompts related to the task's deadline, scheduled work, or another supported trigger. |
| **Timestamps** | Creation, update, completion, archive, scheduling, and other relevant moments needed for history and analytics. |

### 6.2 Task lifecycle concepts

The product should distinguish at least:

- **Open:** actionable but not currently being worked;
- **In progress:** the user has intentionally started work, if this state is useful in the chosen UX;
- **Completed:** the user has declared the actionable work done;
- **Archived:** no longer part of active planning but retained according to the eventual retention policy.

The implementation may refine these states, but it must not use a single ambiguous boolean to represent all lifecycle meaning. Reopening a completed task should be an explicit action with an understandable history.

### 6.3 Task and time rules

- A deadline is a constraint; a scheduled block is a plan.
- An estimate is a forecast; focus duration is an observation.
- A task can be unscheduled and still be valid.
- A task can have more than one planned block when work is split, provided the UX makes the relationship clear.
- A calendar conflict should prompt a planning decision, not silently move the deadline or mark the task complete.
- Focus time may inform actual duration, but the user owns the completion decision.

---

## 7. Important Domain Rules and Boundaries

These rules are non-negotiable product boundaries for future development.

### 7.1 Task ≠ Calendar Event

A task is actionable work; a calendar event is a time-bound occurrence or commitment. A task may be scheduled into a time block, but it does not become an event merely because it has a date. An event may exist without a task. The product must preserve the distinction in behavior, labels, and ownership.

### 7.2 Task ≠ Habit

A task is usually a bounded action with a completion decision. A habit is a recurring behavior evaluated over expected occurrences and consistency. A recurring task and a habit may look similar, but they have different histories, metrics, and user intent. Completing one must not silently complete the other.

### 7.3 Project ≠ Task

A project contains work toward an outcome; a task is an actionable unit within or outside that outcome. A project can contain many tasks, and a task can exist without a project. Project progress is derived from its work and project state, not from treating the project itself as one oversized task.

### 7.4 NutriTrack ≠ Dayly

NutriTrack remains responsible for nutrition and health data and its domain logic. Dayly may consume selected, governed information through an integration layer. Dayly must not duplicate NutriTrack internals, provide medical advice, or use health data to make unsupported productivity judgments.

### 7.5 External Calendar ≠ Dayly Calendar

Dayly owns its planning layer. External calendar providers own their calendars and events. Synchronization may make external events visible in Dayly, but provenance and source ownership must remain clear. Dayly must define sync direction and conflict behavior before writing to an external provider.

### 7.6 Completion is explicit

A scheduled time passing, a focus session ending, a project becoming quiet, or an external event ending does not automatically mean a task is complete. Automatic suggestions may be considered later, but the MVP should favor an explicit completion action.

### 7.7 Derived information is not source truth

Dashboards, streaks, project progress, analytics, imported summaries, and AI suggestions are derived or contextual views. They must not silently become a second editable source of truth for the domain records that produced them.

---

## 8. Dashboard Philosophy

The **Today dashboard** is the primary Dayly experience. It should be useful at a glance and actionable at the next interaction, rather than a warehouse of every possible metric.

### 8.1 Questions Today must help answer

1. **What day is it?** — date, local time, and relevant time-zone context.
2. **What do I have scheduled?** — events, planned task blocks, and the next commitments.
3. **What tasks matter?** — priorities, deadlines, project context, and overdue work with an understandable hierarchy.
4. **How much time do I have?** — known availability, occupied time, remaining planned capacity, and uncertainty where availability is incomplete.
5. **What have I already completed?** — completed tasks, habit occurrences, and finished focus work in the current day.
6. **What is coming next?** — the next event, planned block, reminder, or decision that needs attention.
7. **What is my overall day progress?** — a modest, explainable summary of planned versus completed work, never a misleading universal score.

### 8.2 Possible widgets

Widgets are product concepts, not an implemented UI requirement. A future design may include:

- date, local time, and a short day context;
- next event and day timeline;
- available-time summary;
- prioritized task queue;
- overdue and due-soon section;
- scheduled task blocks;
- quick-add task and event actions;
- habits due today;
- active or recent focus session;
- completed-today summary;
- project attention cues;
- basic day-progress summary;
- notification or sync health state;
- an optional, clearly labeled NutriTrack context widget after the integration exists.

The widget set should be tested against the seven questions, not expanded merely to fill space. A user should be able to hide or defer secondary information in future UX work.

---

## 9. Productivity Model

Dayly connects several systems without collapsing them into one record type:

```text
Tasks
   ↓
Projects

Tasks
   ↓
Schedule

Schedule
   ↓
Calendar

Habits
   ↓
Consistency

Focus Sessions
   ↓
Actual Time

All of the above
   ↓
Analytics
```

### 9.1 How the systems interact

- Tasks provide actionable work. Projects give related tasks an outcome-oriented context.
- Tasks may be allocated into scheduled blocks. The Calendar provides the temporal view and reveals conflicts with events and availability.
- Habits produce expected occurrences and completion history. Their consistency is measured independently from task completion.
- Focus sessions record actual effort and may reference tasks or projects. They inform learning but do not decide completion.
- Analytics reads facts and derives measures across these systems. It should expose assumptions and incomplete data.
- The Dashboard composes these views for daily decisions but does not own their underlying rules.
- Notifications prompt actions at appropriate times, while each source module remains responsible for its own records.

This relationship should be implemented through explicit domain/application boundaries in later phases. A convenient dashboard response or analytics view must not become a reason to tightly couple all modules.

---

## 10. Calendar Philosophy

### 10.1 Events

An event is a time-bound occurrence or commitment with a start and end, title/context, source, and optional recurrence. Dayly-owned events and imported events must be distinguishable. Events do not automatically represent actionable work.

### 10.2 Scheduled tasks

A scheduled task is a plan to work on a task during a particular period. It may be represented by one or more time blocks while retaining the task as the source of truth. A scheduled task block can move without changing the task deadline, and a task can remain unscheduled.

### 10.3 Time blocks

A time block is an allocation of time for a task, focus activity, planning activity, or another deliberate use. A block is not necessarily a provider calendar event. The eventual product should make clear whether a block is a private Dayly plan, an external event mirror, or a provider-synchronized item.

### 10.4 Availability

Availability represents when the user generally expects to have time, plus exceptions where supported. It is a planning constraint, not a guarantee that the user is free or able to work. Unknown availability should not be presented as unlimited availability.

### 10.5 Recurring events

Recurring events are provider or Dayly rules that create repeated occurrences with exceptions. The product must distinguish the recurrence rule from an individual occurrence and must not flatten a provider's recurrence semantics without a deliberate mapping.

### 10.6 External calendar events

External events are displayed with source and sync state. The initial external-calendar design should favor a clear read-oriented experience unless a later decision explicitly defines write behavior, permissions, and conflict resolution.

### 10.7 Synchronization conflicts

A conflict can occur when the same conceptual event changes in Dayly and an external provider, when an event is deleted on one side, or when time-zone/recurrence mappings differ. Dayly must not silently choose a destructive outcome. A later sync contract must define source precedence, user resolution, duplicate handling, retry behavior, and the treatment of stale data.

### 10.8 Time zones

Dates and times must be interpreted in the relevant user, event, or provider time zone. The product must preserve enough context to distinguish an instant from a local wall-clock intention, especially for recurring events and travel. Changing the user's default time zone must not silently rewrite historical facts or create misleading task deadlines.

---

## 11. Habit Philosophy

### 11.1 Habit

A habit is a named behavior a user intends to repeat according to a cadence. It is about maintaining a pattern, not completing a one-time deliverable.

### 11.2 Recurrence

A recurrence defines when an occurrence is expected: for example, particular days or a regular interval. The product should present the resulting due occurrences clearly and handle the user's time zone consistently.

### 11.3 Completion

A habit occurrence is completed by an explicit user action or a future, documented source integration. Task completion, a focus session, or a calendar event must not silently count as habit completion.

### 11.4 Streak

A streak is a derived run of expected occurrences completed according to the habit's recurrence. The rule must be visible enough that a user can understand why a streak advanced or ended. For MVP, the intended simple rule is: completing each due occurrence advances the current streak; a missed due occurrence breaks the current streak unless a documented exception applies.

### 11.5 Consistency

Consistency is broader than the current streak. It may describe the proportion or count of expected occurrences completed over a chosen period. Analytics should show the period and denominator so the number is not decorative.

### 11.6 Missed occurrence

A missed occurrence is an expected occurrence not completed within its supported window. It should be distinguishable from a habit that was paused, not yet due, or deleted. Backfilling and exception rules require a later product decision; they must not be implied accidentally by the interface.

---

## 12. Analytics Philosophy

Analytics should support decisions such as “Should I reduce today's plan?”, “Which project needs attention?”, or “Are my estimates realistic?” It should not exist only to make the product look data-rich.

### 12.1 Measures Dayly should eventually support

- **Task completion:** completed tasks over a stated period, with the chosen denominator and status rules.
- **Overdue tasks:** incomplete tasks whose deadlines have passed, separated from tasks without deadlines.
- **Planned versus actual duration:** comparison of scheduled/estimated work with recorded actual focus time, shown only where the data supports it.
- **Focus time:** actual focus duration by day, week, project, or task where association exists.
- **Project progress:** remaining/completed work using a visible progress method rather than an unexplained percentage.
- **Habit consistency:** completed versus expected occurrences over a stated period, plus streak context.
- **Daily, weekly, and monthly trends:** changes in the above measures that can inform future planning.
- **Planning reliability:** future consideration of plan changes, unfinished scheduled blocks, and estimates, provided definitions are fair and transparent.

### 12.2 Analytics rules

- Every metric needs a definition, time range, source data, and treatment of missing values.
- Counts of items and amounts of time must not be presented as interchangeable productivity.
- Imported health or nutrition information is contextual and must not be used to create medical or moral judgments.
- Analytics should allow a user to reach the records behind a surprising number.
- A metric must be removable or revisable if it encourages harmful optimization or proves misleading.
- MVP analytics should be small, understandable, and actionable.

---

## 13. AI Philosophy

AI is **not part of the initial implementation**. Dayly's core workflows must be useful and trustworthy without it.

Future capabilities may include:

- natural-language task creation;
- task decomposition into proposed subtasks;
- daily planning based on deadlines, estimates, availability, and events;
- schedule optimization with explicit trade-offs;
- summaries of completed work and open commitments;
- productivity insights grounded in the user's own structured history.

When AI is introduced:

- it must operate on structured Dayly data through controlled application services;
- it must not directly manipulate the database;
- proposed changes must be reviewable and, where they change user records, confirmed by the user;
- source provenance, uncertainty, and relevant assumptions should be visible;
- external and NutriTrack data must remain governed by their existing permissions and domain rules;
- AI must not provide medical advice or disguise a generic chat experience as the Dayly product.

---

## 14. Non-Goals

Dayly is explicitly **not**:

- a social network or public activity feed;
- a large-enterprise project-management suite with complex team hierarchies and portfolio governance;
- a nutrition tracker or replacement for NutriTrack;
- a medical application, diagnostic tool, or health treatment service;
- initially, a team collaboration platform;
- an AI chatbot disguised as a productivity application;
- a universal life score that reduces work, habits, health, and time to one judgment;
- a provider calendar replacement;
- a system that silently schedules every task or assumes infinite availability;
- a marketplace for every possible integration in the initial product;
- a promise that more tracking automatically creates more productivity.

---

## 15. Product Principles

1. **Clarity over complexity** — The user should understand what an item means and what action is available without learning an elaborate system.
2. **Action over decoration** — Every primary view should help the user decide or do something useful.
3. **Information hierarchy** — Important commitments, decisions, and next actions should not have the same weight as background detail.
4. **Progressive disclosure** — Start with the minimum needed for a good decision; reveal advanced options when they are relevant.
5. **Fast interaction** — Common actions such as adding a task, completing work, scheduling, and starting focus should have low friction.
6. **Mobile-first thinking** — Workflows should remain understandable and usable in constrained contexts, even before a native mobile product exists.
7. **Reliable synchronization** — Integration status, provenance, failure, and conflict must be visible; silent data loss is unacceptable.
8. **Explicit data ownership** — Dayly, NutriTrack, and external providers must remain distinct owners of their domains.
9. **Privacy by design** — Collect and expose only what is needed, provide meaningful controls, and treat health and integration data with additional care.
10. **Explainable progress** — Streaks, project progress, day summaries, and analytics must have understandable rules.
11. **Extensibility without premature scope** — Boundaries should support future modules and integrations without forcing experimental functionality into the MVP.

---

## 16. Open Decisions Before Implementation

These are intentionally unresolved product or platform decisions. They should be decided in a later phase before the affected behavior is implemented.

- The authentication, account, workspace, and recovery model.
- The exact task status vocabulary, deletion/retention behavior, and parent/subtask completion rules.
- The precise project-progress formula and handling of unestimated or partially completed work.
- Whether Dayly time blocks are ever synchronized as provider calendar events, and in which direction.
- Google Calendar sync scope, provider permissions, write behavior, conflict resolution, recurring-event mapping, and imported-event retention.
- NutriTrack integration contract, allowed metrics, consent language, refresh/freshness rules, and retention.
- Notification channels, quiet hours, default reminder behavior, and delivery guarantees.
- Habit pause, skip, backfill, exception, and time-zone rules beyond the MVP's simple model.
- The definition of “available time” when the user has not configured working hours or when external calendars are not connected.
- Analytics formulas, missing-data treatment, and the minimum useful metric set for the first release.
- Data export, deletion, privacy, and audit requirements across Dayly-owned and imported data.
- The initial localization, accessibility, and cross-device expectations.

Recording these decisions later should not weaken the domain boundaries in this specification.

---

## 17. Definition of Done for PHASE 0A

PHASE 0A is complete when:

- `PRODUCT_SPEC.md` exists and is reviewed as the product source of truth;
- the project documentation structure exists;
- MVP scope is clearly separated from Post-MVP and Future / Experimental work;
- core modules and their boundaries are documented;
- task, project, calendar, habit, focus, analytics, and integration concepts are defined at product level;
- core user journeys are documented;
- future AI direction and its safety boundary are documented;
- non-goals and product principles are documented;
- open decisions are visible rather than hidden as assumptions;
- no application code, database schema, authentication, integration, or unnecessary dependency has been implemented.

After review, the project may proceed to PHASE 0B — UX Architecture only with explicit approval. This specification does not authorize that phase automatically.
