# Dayly Screen Map

**Phase:** 0B — UX Architecture & Information Architecture
**Status:** Approved (historical)
**Source:** [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md) and [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md)

> This is a conceptual screen inventory. It describes responsibilities, entry/exit paths, and states without creating visual mockups or production UI.

## 1. Screen status legend

- **MVP:** Required for the first usable Dayly release.
- **Post-MVP:** A planned extension that is not required for the first release.
- **Future / conditional:** A reserved experience that depends on a later product or integration decision.
- A screen may be a full destination, a focused form, a drawer, or a bottom sheet depending on viewport and context. That presentation choice does not create a new domain.

## 2. Global screen behavior

Every screen should:

- identify its current destination and preserve a meaningful back path;
- show loading without replacing already-known content unnecessarily;
- retain entered values after a recoverable save error;
- distinguish no data from an error and from a permission restriction;
- provide an intentional first-use explanation rather than a blank canvas;
- remain useful when external data is offline or stale;
- expose success as a brief, understandable confirmation and update the source context;
- keep destructive actions reversible where possible.

The screen definitions below use the following state vocabulary:

- **Loading:** Data or a save action is in progress.
- **Empty:** The feature has no records or the current filter has no records.
- **Populated:** Normal content with the relevant actions.
- **Error:** The requested data or action failed.
- **Offline:** The user cannot reach a required service; locally known information remains distinguishable from unsaved changes.
- **Success:** The screen confirms a completed action where confirmation matters.
- **Permission denied:** The user or provider has not granted required access.
- **No results:** A query or filter found nothing; this is distinct from an empty domain.
- **First use:** The user has not yet established the feature's first meaningful record.

## 3. Onboarding — MVP

**Purpose**

Introduce Dayly's daily planning loop and collect only the minimum preferences needed to make Today useful.

**Entry points**

- First launch for a new personal workspace.
- A deliberate “restart or review setup” entry from Settings, if later supported.

**Exit and navigation paths**

- Completion exits to Today with the first-use task prompt.
- Back returns to the previous onboarding step.
- Skip is allowed for optional preferences and integrations; it never skips the minimum product context without an explicit user choice.
- A user who leaves mid-flow returns to the last saved step or a safe restart state.

**Primary action**

Complete the minimum setup and create or defer the first task.

**Secondary actions**

Back, skip an optional step, adjust planning preferences, and choose “do this later” for integrations.

**Critical information**

What Dayly does, local time zone, basic availability/planning preferences, what information is optional, and the next useful action.

**States**

- **Loading:** Load or save the current onboarding step; preserve entered values.
- **Empty:** No prior setup exists; show a short welcome and one clear next action.
- **Populated:** Show the current step and a small progress cue.
- **Error:** Explain which preference could not be saved and allow retry.
- **Offline:** Allow locally safe entry only if later persistence is defined; otherwise explain that setup cannot be completed and preserve values.
- **Success:** Confirm preferences and move to the next step; on completion, show the new Today context.
- **Permission denied:** Not required for core onboarding. Optional future integration permissions are deferred and skippable.
- **No results:** Not applicable to the core flow.
- **First use:** This is the first-use experience; avoid feature tours and dense configuration.

## 4. Today — MVP

**Purpose**

Provide the primary daily orientation, planning, and execution surface.

**Entry points**

- Default destination after onboarding and normal app launch.
- Primary navigation, mobile bottom navigation, command palette, and relevant reminders.
- Links from Analytics, Search, or a completed action that returns to the day.

**Exit and navigation paths**

- Task rows open Task Detail; scheduled blocks open the task or event detail according to source.
- “See calendar” opens Calendar focused on the selected day/time.
- Habit actions open the occurrence or Habit Detail.
- Start Focus opens Focus with optional task context.
- Project and analytics cues open their source context.

**Primary action**

Choose and execute the next useful action: complete, start, schedule, or reschedule work.

**Secondary actions**

Quick Add task/event/habit, review timeline, record a habit, start focus, inspect completed work, open tomorrow/upcoming items, and adjust planning preferences.

**Critical information**

Date and local context, next commitment, focus recommendation, important/overdue tasks, scheduled blocks, available time, habits due, completed work, and explainable day progress.

**States**

- **Loading:** Show orientation and stable shell first, then fill agenda/task sections independently where possible.
- **Empty:** Display date and availability plus one clear task/event/habit action; do not show a wall of empty cards.
- **Populated:** Use primary, secondary, and contextual hierarchy from the IA document.
- **Error:** Identify the unavailable section and keep unaffected Dayly-owned sections usable.
- **Offline:** Show cached context as possibly stale; keep unsaved changes visibly pending and do not claim external sync succeeded.
- **Success:** After completion, scheduling, or rescheduling, update the affected section and show a short confirmation/undo where appropriate.
- **Permission denied:** Only applies to optional external context; hide or label that context while keeping Today usable.
- **No results:** Applies to a filtered task/upcoming list; offer clear filter reset rather than an empty-day message.
- **First use:** Explain the daily loop and guide the user to create the first task.

## 5. Inbox — MVP task triage view

**Purpose**

Give captured tasks a low-friction place for review and organization. Inbox is a view, not a new domain object or necessarily a canonical lifecycle status.

**Entry points**

- Tasks local navigation.
- Quick Add success when the user chooses to defer organization.
- Command palette and a Today capture cue.

**Exit and navigation paths**

- Open a task in Task Detail or Edit Task.
- Assign a project, priority, deadline, tag, or schedule directly where the interaction is simple.
- Return to Tasks, Today, or the prior context after triage.

**Primary action**

Triage an item by making it actionable or intentionally leaving it for later.

**Secondary actions**

Bulk selection if later justified, complete, archive, set deadline, assign project, schedule, filter, and search.

**Critical information**

Task title, age/created time if useful, missing planning context, priority, deadline, and a clear indication of whether the task still needs triage.

**States**

- **Loading:** Show task-row placeholders and retain the Tasks heading.
- **Empty:** Explain that captured ideas appear here and offer Quick Add or a link to All Tasks.
- **Populated:** Group or sort by useful triage cues without presenting Inbox as a separate task type.
- **Error:** Keep retry and link to another Tasks view if available.
- **Offline:** Allow review of cached items; label edits that cannot be saved.
- **Success:** Confirm triage action and preserve the list position where possible.
- **Permission denied:** Use the normal personal-task permission state; no separate provider permission is expected.
- **No results:** State that the current Inbox filter found no items and offer reset.
- **First use:** Use a short explanation of capture versus organization, not a tutorial carousel.

## 6. Tasks — MVP

**Purpose**

Provide the main collection and management view for actionable work.

**Entry points**

- Primary navigation, mobile Tasks tab, Search, Today, Projects, Calendar, Focus history, and command palette.

**Exit and navigation paths**

- Task rows open Task Detail.
- Create Task can open from the page header, Quick Add, or command palette.
- Local navigation switches Inbox, All, Planned, Scheduled, and Completed views.
- Filters remain visible or restorable when returning from a detail view.

**Primary action**

Find or create the next actionable task.

**Secondary actions**

Filter, sort, search within tasks, complete/reopen, schedule, assign project/tag, archive, and start focus.

**Critical information**

Title, completion state, priority, deadline, scheduled block, project, estimate, and indicators for overdue or missing planning context.

**States**

- **Loading:** Use list skeletons without implying tasks are missing.
- **Empty:** Explain the selected view and provide the most relevant creation action.
- **Populated:** Support scanning and fast completion without forcing detail-screen navigation.
- **Error:** Show a recoverable list error and preserve filters.
- **Offline:** Show known tasks and label changes that have not synchronized/persisted.
- **Success:** Confirm creates, completions, or archive actions inline and update counts.
- **Permission denied:** Explain that the task collection is unavailable and provide an account/settings path only if relevant.
- **No results:** State that the query/filter found no matches and offer to clear constraints.
- **First use:** Offer one prominent Create Task action and a brief explanation of Inbox/All Tasks.

## 7. Task Detail — MVP

**Purpose**

Show and manage one task as the canonical user-facing task context.

**Entry points**

Today, Tasks, Inbox, Projects, Calendar scheduled task block, Focus, Analytics, Search, and notifications.

**Exit and navigation paths**

- Back returns to the originating list and context.
- Links open the associated Project, Calendar planning context, or Focus history.
- Edit opens Edit Task; completion returns to the source context with confirmation.

**Primary action**

Complete or reopen the task, depending on its state.

**Secondary actions**

Edit title/details, set priority/deadline/estimate, schedule, assign project/tags, manage subtasks, reminders, recurrence when supported, archive, and start focus.

**Critical information**

Title, status, priority, deadline versus scheduled blocks, project, description, subtasks, estimate/actual time, reminders, and relevant history.

**States**

- **Loading:** Show task identity placeholder and avoid a destructive action before the record is known.
- **Empty:** Not a normal state; if the task no longer exists, explain that it was removed/archived and provide return navigation.
- **Populated:** Present core task facts first and advanced properties progressively.
- **Error:** Explain whether read or save failed; retain prior known values.
- **Offline:** Allow clearly labeled local-safe interactions only if later persistence is defined; never imply saved completion.
- **Success:** Confirm completion/edit/scheduling and expose undo where reversible.
- **Permission denied:** Explain unavailable task access without exposing private content.
- **No results:** Not applicable after a task is loaded; Search handles no-result queries.
- **First use:** A newly created task can show a minimal detail state with optional next steps, not a required checklist.

## 8. Create Task — MVP

**Purpose**

Capture a task quickly, with optional expansion to full properties.

**Entry points**

Quick Add from Today or the global shell, Tasks page, Inbox, Projects, Calendar, command palette, and mobile quick-action button.

**Exit and navigation paths**

- Successful creation returns to the originating context or opens the new Task Detail when the user requests more setup.
- Cancel returns without creating a partial task.
- Expand opens the full task fields in the same conceptual flow.

**Primary action**

Create a task using a title as the minimum required information.

**Secondary actions**

Add description, priority, deadline, scheduled block, estimate, project, tags, subtasks, recurrence, reminders, and create-and-start-focus where supported.

**Critical information**

Title, optional deadline and schedule distinction, save/cancel controls, and where the task will appear after creation.

**States**

- **Loading:** Show save progress and prevent accidental duplicate submission while retaining the title.
- **Empty:** Show a focused title input and useful optional prompts without requiring them.
- **Populated:** Show the minimum form first; reveal advanced fields progressively.
- **Error:** Identify field or save error, keep all input, and offer retry.
- **Offline:** Clearly label whether the task is saved locally or cannot be created until connected; never show false success.
- **Success:** Confirm creation and show the task in its owning context.
- **Permission denied:** Explain that creation is unavailable and provide a non-destructive exit.
- **No results:** Not applicable to creation; autocomplete fields may show “no matches” without blocking manual entry.
- **First use:** Use a single “What needs to be done?” prompt and a light explanation of optional details.

## 9. Edit Task — MVP

**Purpose**

Change a task's properties without obscuring its current state or history.

**Entry points**

Task Detail, task row overflow, Project Detail, Calendar block, or a command action.

**Exit and navigation paths**

Save returns to the prior detail/list context; cancel returns without mutation; archive/complete use their own confirmation/undo behavior.

**Primary action**

Save an intentional task change.

**Secondary actions**

Change status, priority, deadline, schedule, project, tags, estimate, details, recurrence/reminders where supported, and archive.

**Critical information**

Current values, unsaved-change indication, deadline versus schedule fields, and consequences of changing recurrence or completion state.

**States**

- **Loading:** Load current values before presenting an editable form.
- **Empty:** If the task cannot be loaded, use the Task Detail unavailable state.
- **Populated:** Show current values and only relevant advanced sections.
- **Error:** Keep edits and identify conflict or save failure.
- **Offline:** State whether editing is unavailable or pending; do not silently overwrite later changes.
- **Success:** Confirm what changed and return to the source context.
- **Permission denied:** Make fields read-only or explain why editing is unavailable.
- **No results:** Not applicable; related selectors can show no matches.
- **First use:** Avoid a different form model from Create Task; teach through consistent labels.

## 10. Projects — MVP

**Purpose**

Show active and archived projects as outcome-oriented containers for work.

**Entry points**

Primary navigation, project link from a task, Today attention cue, Search, and command palette.

**Exit and navigation paths**

- Project rows open Project Detail.
- Create Project opens the focused creation flow.
- Filters switch active/archived and other supported views.

**Primary action**

Choose a project to understand its remaining work or create a project for a meaningful outcome.

**Secondary actions**

Filter, search, archive/unarchive, sort by attention/target date, and open recent tasks.

**Critical information**

Project name/outcome, lifecycle state, task count, incomplete/overdue cues, target context, and a labeled progress representation.

**States**

- **Loading:** Show project list structure.
- **Empty:** Explain what a project is and offer Create Project; distinguish no active projects from no search results.
- **Populated:** Make outcomes and attention cues scannable.
- **Error:** Provide retry without losing the selected filter.
- **Offline:** Show known projects and label unsaved archive/create changes.
- **Success:** Confirm create/archive/unarchive and update the list.
- **Permission denied:** Explain unavailable project access without exposing task content.
- **No results:** Offer to clear filters or create a project only if that matches the user's intent.
- **First use:** Explain that projects contain work and are not oversized tasks.

## 11. Create Project — MVP

**Purpose**

Create a project with enough outcome context to organize tasks without a long setup.

**Entry points**

Projects header, command palette, a task's project selector, or an onboarding/Today cue where relevant.

**Exit and navigation paths**

Success opens Project Detail or returns to the source with the project selected. Cancel returns without a partial project.

**Primary action**

Save a project name and outcome.

**Secondary actions**

Add description, target date/context, priority, initial tasks, and optional tags.

**Critical information**

Name, outcome, optional target, and explanation that tasks remain independently actionable.

**States**

- **Loading:** Show save state and prevent duplicate creation.
- **Empty:** Present only the required name/outcome fields.
- **Populated:** Show optional context progressively.
- **Error:** Retain values and identify the issue.
- **Offline:** Do not claim successful creation without a defined persistence path.
- **Success:** Open or link the created project and confirm it.
- **Permission denied:** Explain inability to create and return safely.
- **No results:** Related task selection may show no results without preventing project creation.
- **First use:** Use plain language about outcomes rather than project-management jargon.

## 12. Project Detail — MVP

**Purpose**

Provide the outcome context, task grouping, and actionable remaining work for one project.

**Entry points**

Projects, Task Detail, Today, Search, and Analytics.

**Exit and navigation paths**

- Task rows open Task Detail while preserving project context.
- Add Task creates a task associated with the project.
- Calendar opens planned work for the project.
- Archive returns to the appropriate project list with confirmation/undo.

**Primary action**

Choose or create the next task that advances the project.

**Secondary actions**

Edit project context, filter/group tasks, schedule a task, inspect progress/history, archive/unarchive, and review analytics.

**Critical information**

Outcome, lifecycle state, open/completed tasks, overdue work, scheduled work, target context if any, and progress with its strategy clearly labeled or marked unresolved.

**States**

- **Loading:** Load project context before showing progress claims.
- **Empty:** Project exists with no tasks; explain and offer Add Task.
- **Populated:** Group tasks by useful execution state without making the project itself a task.
- **Error:** Separate project-load failure from one failed task section where possible.
- **Offline:** Show known project/task state and label unavailable updates.
- **Success:** Confirm added task, changed project, or archive action.
- **Permission denied:** Explain unavailable project access.
- **No results:** A filter with no matching tasks offers reset and keeps project context visible.
- **First use:** Explain project outcome and task membership.

## 13. Calendar — MVP core / Post-MVP expanded views

**Purpose**

Show Dayly-owned events, scheduled task blocks, availability, and later external events in time context.

**Entry points**

Primary navigation, Today timeline, Task Detail schedule action, command palette, and future integration context.

**Exit and navigation paths**

- Scheduled task block opens Task Detail; Dayly Event opens Calendar Event Detail; future external event opens source-aware detail.
- Create Event opens the event editor.
- Day/Week/Month controls change the temporal view without changing source records.
- Return preserves the previously selected date and view where possible.

**Primary action**

Understand or adjust the plan for a period without confusing events and task work.

**View hierarchy:** Day view is the MVP planning view. Week view and Month view are later extensions that provide broader orientation without changing the underlying event/task ownership.

**Secondary actions**

Create event, schedule task, move/reschedule a block, change view, inspect availability, and review conflicts/source information.

**Critical information**

Date/time zone, fixed events, scheduled task blocks, focus context where relevant, availability, conflict markers, and source labels.

**States**

- **Loading:** Show date/view controls and a timeline skeleton.
- **Empty:** Show the selected period with a clear “no events or scheduled work” state plus Create Event/Schedule Task.
- **Populated:** Visually distinguish all item types and preserve readable time relationships.
- **Error:** Identify which source failed; keep Dayly-owned records visible if external data fails.
- **Offline:** Show cached calendar context and mark stale or unsaved changes.
- **Success:** Confirm event creation or rescheduling and update the time view.
- **Permission denied:** Future external calendars show connection/permission guidance; Dayly-owned calendar remains usable.
- **No results:** A filter or source selection with no items offers reset.
- **First use:** Explain Event versus Scheduled Task and show a simple day view.

## 14. Calendar Event Detail — MVP for Dayly events / Future for external detail

**Purpose**

View and manage one calendar event while retaining its ownership and source.

**Entry points**

Calendar, Today next-event area, Search, and future notifications.

**Exit and navigation paths**

Back returns to the selected calendar context. Edit opens the event editor for Dayly-owned events. External events open read-oriented/source-aware detail until sync write behavior is decided.

**Primary action**

Review the event and, for a Dayly-owned event, edit or reschedule it.

**Secondary actions**

Edit, delete/cancel a Dayly event, open related task if explicitly linked, inspect source/sync status, and return to Calendar.

**Critical information**

Title, start/end, time zone, recurrence, source/ownership, conflict/sync state, and linked task only when an intentional relationship exists.

**States**

- **Loading:** Show event identity and time skeleton.
- **Empty:** If removed, explain that the event is no longer available.
- **Populated:** Make source and ownership prominent.
- **Error:** Provide retry and return to Calendar.
- **Offline:** Show last-known event and mark any unsaved edit.
- **Success:** Confirm event edit/reschedule/delete and update Calendar.
- **Permission denied:** Explain external provider restriction without suggesting Dayly owns the event.
- **No results:** Not applicable to loaded detail; source search can show no results.
- **First use:** A Dayly event can explain Event versus Scheduled Task through labels, not a tutorial.

## 15. Calendar Event Editor — MVP for Dayly events

**Purpose**

Create or edit a Dayly-owned event with deliberate time and recurrence fields.

**Entry points**

Calendar quick action, calendar empty state, command palette, or Event Detail.

**Exit and navigation paths**

Save returns to Calendar/Event Detail; cancel returns without mutation. External event editing is unavailable until a future sync contract permits it.

**Primary action**

Create or save a Dayly event.

**Secondary actions**

Set title, start/end, time zone, recurrence, notes, reminders, and optional task link if later supported.

**Critical information**

Ownership, start/end, recurrence and exception context, time zone, and unsaved changes.

**States**

- **Loading:** Load existing values before editing.
- **Empty:** New event form begins with title and time fields.
- **Populated:** Keep advanced recurrence/reminder fields progressive.
- **Error:** Retain values and offer retry.
- **Offline:** Clearly state unavailable or pending save behavior.
- **Success:** Confirm the event and return to the originating calendar date.
- **Permission denied:** Only future provider permission applies; Dayly event permissions are handled by the account model later.
- **No results:** Related task selector may have no matches without blocking event creation.
- **First use:** Explain ownership and time zone in plain language.

## 16. Habits — MVP core

**Purpose**

Show habits due today, active habits, and consistency history.

**Entry points**

Primary/More navigation, Today habit section, Search, and Analytics.

**Exit and navigation paths**

Habit rows open Habit Detail. Create Habit opens the habit form. History/analytics controls change context without changing the habit definition.

**Primary action**

Record a due occurrence or create a habit.

**Secondary actions**

Filter active/archived, review history, inspect streak/consistency, pause, skip, backfill, or archive where those behaviors are supported.

**Critical information**

Due occurrence, recurrence summary, completion state, current streak, consistency period, missed occurrences, and pause/exception status.

**States**

- **Loading:** Show due/history structure.
- **Empty:** Explain habits and offer Create Habit; distinguish no habits from no habits due today.
- **Populated:** Make today's due action and streak understandable.
- **Error:** Keep retry and preserve selected period/filter.
- **Offline:** Show known history and clearly label an occurrence that cannot be saved.
- **Success:** Confirm completion/undo and update the MVP streak/consistency rule: completing each due occurrence advances the current streak; a missed due occurrence breaks it unless a later-approved exception applies.
- **Permission denied:** Explain unavailable habit access.
- **No results:** A date/filter with no occurrences offers reset; it is not automatically a missed occurrence.
- **First use:** Use one short habit example and prioritize creation.

## 17. Habit Detail — MVP core / some controls unresolved

**Purpose**

Define one habit and inspect its occurrence history, streak, and consistency.

**Entry points**

Habits, Today, Search, and Analytics.

**Exit and navigation paths**

Back preserves the habit list/date context. Edit opens the habit editor. Today action returns to the current occurrence. Analytics opens the relevant trend.

**Primary action**

Complete the due occurrence or understand the habit's current state.

**Secondary actions**

Edit recurrence, preferred time/context, pause, skip, backfill, archive, and inspect history where supported.

**Critical information**

Definition, next due occurrence, recurrence, current streak, consistency, completed/missed history, and unresolved-rule notices where necessary.

**States**

- **Loading:** Load definition and history separately when possible.
- **Empty:** A newly created habit has no completed history; explain the next due occurrence.
- **Populated:** Show current action before historical detail.
- **Error:** Identify whether definition or history failed.
- **Offline:** Preserve known history and do not claim an occurrence was recorded.
- **Success:** Confirm completion or saved definition changes.
- **Permission denied:** Explain unavailable habit access.
- **No results:** Date-range history can have no occurrences without implying failure.
- **First use:** Explain recurrence, occurrence, and streak in a compact helper. The MVP rule is explicit: completing each due occurrence advances the current streak; a missed due occurrence breaks it unless a later-approved exception applies.

## 18. Habit Editor — MVP core / unresolved advanced rules

**Purpose**

Create or edit a habit recurrence and basic context without pretending that all exception rules are final.

**Entry points**

Habits/Create Habit, Habit Detail/Edit, Today empty state, and command palette.

**Exit and navigation paths**

Save returns to Habit Detail or the originating list; cancel discards changes. Pause/Archive use explicit confirmation.

**Primary action**

Save a name and supported recurrence.

**Secondary actions**

Set preferred time/context, reminder, pause, archive, and advanced skip/backfill options only when approved.

**Critical information**

Name, cadence, time zone context, next occurrence preview, and the effect of changing recurrence on future occurrences.

**States**

- **Loading:** Load current definition before editing.
- **Empty:** New form begins with name and simple recurrence.
- **Populated:** Show a preview of due occurrences and keep exceptions progressive.
- **Error:** Retain values and explain invalid/unsupported recurrence.
- **Offline:** State whether the definition can be saved; do not claim a changed recurrence succeeded.
- **Success:** Confirm save and show the next due occurrence. The MVP streak rule remains explicit; pause/skip/backfill effects stay unavailable until defined.
- **Permission denied:** Explain inability to edit.
- **No results:** Recurrence preview can state no occurrence in the selected preview range without treating it as an error.
- **First use:** Avoid introducing streak edge cases before they are decided.

## 19. Focus — MVP

**Purpose**

Start and review intentional work sessions with optional task/project context.

**Entry points**

Primary/mobile navigation, Today, Task Detail, Project Detail, Calendar scheduled task, and command palette.

**Exit and navigation paths**

- Active session remains accessible from the shell and Today.
- Finish leads to a review/confirmation state, then Focus history or the originating task.
- Cancel/back from an idle Focus screen returns to the prior context.

**Primary action**

Start, pause/resume, or finish the current focus session.

**Secondary actions**

Select task/project, choose duration, record interruption note, review history, and open the associated task.

**Critical information**

Timer state, task/project context, elapsed/actual duration, pause/interruption status, and explicit completion reminder.

**States**

- **Loading:** Load active session and context before showing a start action that could duplicate it.
- **Empty:** Show Start Focus and optional task/project selection.
- **Populated:** Make the active timer and context dominant.
- **Error:** Explain timer/session save failure and show last-known duration.
- **Offline:** Keep timer state visible; explain whether actual duration can be recorded later, without false persistence.
- **Success:** Finish leads to recorded actual duration and a clear “task still open unless completed” choice.
- **Permission denied:** Explain inability to record a session if account access is unavailable.
- **No results:** History/filter no-result state offers reset.
- **First use:** Explain select task → choose duration → focus → finish → review.

## 20. Analytics — MVP basic / Post-MVP expanded

**Purpose**

Answer planning and review questions with small, understandable summaries.

**Entry points**

Primary navigation, Today summary, Project Detail, Habit Detail, Focus history, and command palette.

**Exit and navigation paths**

Metric drill-down opens the source domain; period controls switch Today/Week/Month; back returns to the originating context.

**Primary action**

Choose a period and learn one actionable thing about planning or execution.

**Secondary actions**

Inspect metric definitions, filter by project/task/habit, compare periods, and open source records.

**Critical information**

Task completion, overdue work, focus time, project progress, habit consistency, planned-versus-actual data where supported, period, and completeness/provenance.

**States**

- **Loading:** Show metric labels and period selection without invented zero values.
- **Empty:** Explain what data would make the metric useful and link to the relevant action.
- **Populated:** Present a small hierarchy of decision-support metrics and source links.
- **Error:** Identify unavailable calculations and keep unaffected metrics visible if possible.
- **Offline:** Show last-known analytics with period/freshness label; do not imply current completeness.
- **Success:** After source actions, offer refresh/update confirmation where relevant.
- **Permission denied:** Explain unavailable records without revealing them through aggregates.
- **No results:** A selected period/filter with no data explains the range and offers reset.
- **First use:** Use plain-language examples, not a chart wall or universal score.

## 21. Search — MVP basic / Post-MVP expanded

**Purpose**

Provide global retrieval across supported Dayly records.

**Entry points**

Global header, keyboard shortcut, mobile header, primary navigation, command palette, and contextual “find” actions.

**Exit and navigation paths**

Results open source-owned detail screens and preserve the query for return. Filters can be changed without losing the query.

**Primary action**

Enter a query and open the relevant result.

**Secondary actions**

Filter/group by Tasks, Projects, Habits, Calendar, and future Notes; search recent queries; clear query; open command actions.

**Critical information**

Query, grouped result type, matching title/content, date/status, project/source label, and keyboard/mobile affordance.

**States**

- **Loading:** Show query context and grouped placeholders.
- **Empty:** Before a query, show examples and recent searches only if retained by the privacy decision.
- **Populated:** Group results by source and make type clear.
- **Error:** Explain search failure and allow retry without clearing the query.
- **Offline:** Search locally available content and label its scope; do not imply complete results.
- **Success:** Opening a result preserves query context on return.
- **Permission denied:** Exclude unavailable records and explain limited scope only when useful.
- **No results:** Suggest spelling/filter changes and clear filters; do not imply the user has no records.
- **First use:** Show the global shortcut and a simple example query.

## 22. Notifications — MVP in-product utility / Post-MVP channels

**Purpose**

Show actionable reminders and system/integration states without becoming a second task inbox.

**Entry points**

Header indicator, reminder action, Settings, Today status, and command palette.

**Exit and navigation paths**

Each notification opens its source context. Dismiss/snooze returns to the notification surface; Settings opens notification preferences.

**Primary action**

Open and act on the relevant task, event, habit, focus session, or sync status.

**Secondary actions**

Dismiss, snooze, mark handled, clear supported items, and change preferences.

**Critical information**

Trigger source, timing, action required, delivery/handled state, and quiet-period treatment.

**States**

- **Loading:** Show notification shell and preserve read state.
- **Empty:** Say there are no current notifications; provide a path to preferences.
- **Populated:** Group by actionable/current versus informational without overwhelming the user.
- **Error:** Explain if notification state cannot be loaded and keep source actions available where possible.
- **Offline:** Show cached notifications and do not claim a reminder was delivered.
- **Success:** Confirm dismissal/snooze/preference changes.
- **Permission denied:** Explain unavailable notification channel without blocking in-product source views.
- **No results:** Filtered notification view offers reset.
- **First use:** Explain what in-product reminders mean and how to control them.

## 23. Settings — MVP foundation

**Purpose**

Provide a stable home for preferences, privacy/data controls, and future connections.

**Entry points**

Sidebar, mobile More/drawer, profile menu, command palette, and contextual permission links.

**Exit and navigation paths**

Category selection opens a focused settings section; save returns to the section with confirmation. Back returns to the prior settings context or originating screen.

**Primary action**

Find and change a personal Dayly preference safely.

**Secondary actions**

Open Profile, Appearance, Planning, Notifications, Calendar, Integrations, Privacy, Data, and Account categories.

**Critical information**

Current values, scope/effect of a setting, unsaved changes, connection/consent status, and destructive consequences.

**States**

- **Loading:** Show categories and load values without defaulting to misleading values.
- **Empty:** A category with no configured values explains the defaults and offers setup.
- **Populated:** Keep categories discoverable and forms concise.
- **Error:** Retain values and show retry; avoid silently reverting to defaults.
- **Offline:** Clearly mark settings that cannot be saved.
- **Success:** Confirm saved changes and identify affected behavior.
- **Permission denied:** Make unavailable account/provider controls explicit.
- **No results:** Settings search, if added later, offers reset.
- **First use:** Keep optional configuration out of onboarding unless it affects the next decision.

## 24. Profile — Settings utility / account model unresolved

**Purpose**

Show and edit personal identity details that Dayly deliberately supports.

**Entry points**

Profile menu, Settings → Profile, onboarding continuation, and command palette.

**Exit and navigation paths**

Save returns to Profile with confirmation; back returns to Settings or the originating context.

**Primary action**

Review or save supported personal profile preferences.

**Secondary actions**

Change display name/avatar if supported, review account status, and reach Account/privacy controls.

**Critical information**

Display identity, account/workspace context when defined, and privacy implications of profile fields.

**States**

- **Loading:** Show profile placeholders.
- **Empty:** Explain which profile information is optional.
- **Populated:** Show only supported, user-controlled fields.
- **Error:** Preserve edits and retry.
- **Offline:** Label unsaved profile changes.
- **Success:** Confirm saved changes.
- **Permission denied:** Explain unavailable account/profile access.
- **No results:** Not applicable except future profile search.
- **First use:** Use onboarding values consistently; do not require a social profile.

**Unresolved:** Authentication, account recovery, avatar storage, and workspace identity are not defined in Phase 0B.

## 25. Integrations — Future / conditional

**Purpose**

Manage optional provider connections, consent, selected scope, and sync health without replacing contextual product experiences.

**Entry points**

Settings → Integrations, Calendar connection prompt, Today integration prompt, and future command actions.

**Exit and navigation paths**

Connect/disconnect returns to the integration list with explicit status. A connected provider may open a provider-specific settings detail. Calendar/NutriTrack context returns to its owning Dayly view.

**Primary action**

Connect or manage a provider after reviewing what Dayly will read or write.

**Secondary actions**

Select scope, refresh, inspect last sync, resolve supported errors, change consent, and disconnect.

**Critical information**

Provider, ownership, permissions, selected scope, last successful sync, stale/error state, and treatment of imported data on disconnect.

**States**

- **Loading:** Show connection status without claiming a sync completed.
- **Empty:** Explain optional integrations and list only supported future providers.
- **Populated:** Separate connected, disconnected, and action-required states.
- **Error:** Explain authorization/sync failure and offer recovery.
- **Offline:** Show last-known status and avoid initiating a false connection.
- **Success:** Confirm connection, scope, and initial sync state separately.
- **Permission denied:** Explain what cannot be shown and how to retry/change provider permission.
- **No results:** A selected scope with no imported items says no items were returned, not that sync failed.
- **First use:** Show why an integration is optional and what ownership remains external.

**Unresolved:** Provider contracts, sync direction, conflicts, and retention remain outside Phase 0B.

## 26. Supporting screens and overlays

These are not additional top-level destinations but are required interaction surfaces:

| Surface | Purpose | Entry points | Exit |
|---|---|---|---|
| Quick Add | Capture Task/Event/Habit with minimal friction | Today, shell, mobile action | Return to source with item or cancel |
| Command Palette | Navigate and execute common commands | Keyboard shortcut, shell utility | Execute command, open source, or dismiss |
| Task/Project/Habit selectors | Choose related context without leaving a form | Create/Edit forms, Focus | Selection returns to form |
| Confirmation | Confirm destructive or ambiguous actions | Archive, delete, disconnect, pause | Confirm or cancel with context preserved |
| Filter/Sort sheet | Adjust a list on mobile or constrained width | Tasks, Projects, Habits, Search, Analytics | Apply/reset and return |
| Sync/permission explanation | Explain future provider state | Integrations, Calendar, Today card | Retry, Settings, or dismiss |

## 27. Screen coverage checklist

- [x] Onboarding
- [x] Today
- [x] Inbox
- [x] Tasks
- [x] Task Detail
- [x] Create Task
- [x] Edit Task
- [x] Projects
- [x] Project Detail
- [x] Create Project
- [x] Calendar
- [x] Calendar Event Detail
- [x] Calendar Event Editor
- [x] Habits
- [x] Habit Detail
- [x] Habit Editor
- [x] Focus
- [x] Analytics
- [x] Search
- [x] Notifications
- [x] Settings
- [x] Profile
- [x] Integrations
- [x] Supporting quick actions and overlays

The screen map does not authorize implementation. It is the UX inventory to be validated before Phase 0C.
