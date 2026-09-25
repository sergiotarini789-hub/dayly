# Dayly User Flows

**Phase:** 0B — UX Architecture & Information Architecture
**Status:** In progress
**Source:** [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md) and [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md)

> Flows describe intended user intent, navigation, and state transitions. They are not implementation specifications or visual mockups.

## 1. Flow notation and cross-flow rules

```text
Screen or state
      ↓ action
Next screen or state
```

- `[optional]` means the user may skip the step.
- `(future)` marks a post-MVP or conditional integration behavior.
- `↩` means return to the originating context while preserving useful context.
- `?` marks an unresolved product/technical rule that must be decided before implementation.

### Cross-flow rules

1. **Preserve context:** Opening a detail view from Today, a project, or a calendar date should return the user to that context rather than resetting the entire product.
2. **Capture before organization:** A task requires a title; project, date, tag, and recurrence details are optional and progressively disclosed.
3. **Explicit completion:** Scheduling, finishing a focus session, or reaching a deadline does not complete a task automatically.
4. **Separate time concepts:** Deadline, scheduled task block, calendar event, and focus session remain distinct in labels and behavior.
5. **Visible feedback:** Every create/edit/complete/reschedule action has a success, failure, or pending state. No silent mutation.
6. **Recoverable failure:** A failed save preserves entered values and offers retry or safe cancellation.
7. **No scope surprise:** Optional integrations are never required to complete the core flows.
8. **Mobile adaptation:** On mobile, focused forms and selectors may become full-screen views or bottom sheets; the information hierarchy remains the same but the navigation path is not a shrunken desktop layout.
9. **Source ownership:** A cross-module link opens the source-owned detail view. Derived views do not become alternate editing sources.
10. **Accessibility parity:** Every action available by drag, gesture, hover, or keyboard also has a visible, operable alternative.

## 2. Create task — MVP

**Goal:** Capture useful work with minimal friction and optionally organize it immediately.

```text
Today / Tasks / Projects / Calendar / command palette
      ↓ + Task or Create Task
Quick Add Task
      ↓ enter title
[optional] Expand details
      ↓ save
Task Created
      ↓
Return to source context with new task visible
      ↓ [optional]
Task Detail / Schedule / Start Focus
```

### Happy path

1. The user invokes `+ Task` from Today, Tasks, a project, Calendar, or the mobile quick-action button.
2. Dayly opens a focused Quick Add with title as the only required field.
3. The user enters an actionable title and saves.
4. Dayly confirms creation, adds the task to the originating context, and makes its project context clear if one was inherited.
5. The user may expand details before saving or open Task Detail after saving.

### Optional full details

```text
Quick Add
      ↓ Expand
Full task fields
      ↓ choose deadline, priority, estimate, project, tags, etc.
Save
      ↓
Task Detail or source context
```

Advanced fields remain optional. Due date/time and scheduled time are visually separate. Recurrence and reminders stay behind progressive disclosure and are not required for a simple task.

### Alternate paths

- **Cancel:** Return without creating a partial task.
- **Duplicate submission:** Disable repeated save while saving and show one result.
- **Validation error:** Keep the title and identify the field needing attention.
- **Offline:** Follow the eventual persistence policy; show pending/local state or block with an explanation. Never claim server persistence without a defined mechanism.
- **Create from a project:** Preselect the project, but allow the user to remove/change it.
- **Create from a calendar block:** Pre-fill the planned context without turning the task into a calendar event.

**Success condition:** A task exists, is visible in the source context, and the user understands what was saved.

## 3. Complete task — MVP

**Goal:** Mark a task done explicitly and see the relevant context update.

```text
Today / Tasks / Task Detail / Project Detail
      ↓ complete action
Completion confirmation or immediate completed state
      ↓
Today, list, project progress, and supported analytics update
      ↓ [optional]
Undo / reopen task
```

### Happy path

1. The user taps/clicks the completion control on a task row or Task Detail.
2. Dayly marks the task Completed and records the completion moment.
3. The task moves or changes presentation according to the current view.
4. Today updates completed work and remaining work; Project Detail updates its derived context; analytics becomes eligible for the new fact.
5. A brief confirmation and reversible undo/reopen action are available where appropriate.

### Alternate paths

- **Task has open subtasks:** Show the defined product treatment once parent/subtask rules are decided; do not silently imply all subtasks are complete.
- **Task is overdue:** Completing it records completion without hiding that it was overdue in history/analytics.
- **Task is scheduled:** Completing it does not erase its historical scheduled block.
- **Task is in a project:** Project remains open unless the user explicitly closes it.
- **Offline/save failure:** Keep the prior state visible with a pending/error label; do not show success until persistence semantics are known.
- **Undo:** Reopen explicitly and update derived views.

## 4. Schedule task — MVP

**Goal:** Allocate planned work to a realistic time without changing the deadline accidentally.

```text
Task Detail / Today / Calendar
      ↓ Schedule
Choose date and time block
      ↓ review availability and conflicts
Confirm schedule
      ↓
Scheduled Task Block
      ↓
Calendar and Today show planned work
```

### Happy path

1. The user chooses Schedule from a task or an empty area in Calendar.
2. Dayly shows the task title, deadline if present, estimate, selected date/time, and known availability.
3. The user selects one time block or multiple blocks if splitting is supported in the current release.
4. Dayly shows overlaps with fixed events, existing scheduled work, and known capacity.
5. The user confirms the plan.
6. The task remains a task; the block is labeled Scheduled Task in Calendar and Today.

### Alternate paths

- **No deadline:** Allow scheduling; a task does not need a deadline to be planned.
- **No estimate:** Allow scheduling but state that capacity comparison is incomplete.
- **Conflict:** Explain the conflict and offer move, shorten, choose another time, or continue deliberately; do not silently overbook.
- **Deadline after block:** Allow the plan if valid, but keep deadline separate.
- **No availability configured:** Show available-time uncertainty and link to Planning settings.
- **Mobile:** Open a time selector/bottom sheet with a compact conflict summary, then return to the task/calendar context.
- **Save failure:** Keep the proposed block visible as unsaved or discard only after explicit choice.

## 5. Reschedule task — MVP

**Goal:** Change the plan when reality changes while preserving the distinction between plan and deadline.

```text
Today / Calendar / Task Detail
      ↓ Reschedule or drag/move scheduled task block
Choose new time
      ↓ review impact and conflicts
Confirm new plan
      ↓
Updated Scheduled Task Block
      ↓
Today and Calendar reflect new plan
```

### Happy path

1. The user selects a scheduled task block and chooses Reschedule, or uses an accessible move action.
2. Dayly shows the proposed new time, task deadline, event conflicts, and available capacity.
3. The user confirms the new block.
4. Dayly records the changed plan and updates Today/Calendar.
5. The task deadline remains unchanged unless the user separately edits it.

### Alternate paths

- **Drag not available:** Use a menu or edit control with the same result.
- **Move past deadline:** Warn and require an explicit decision; do not rewrite the deadline.
- **Move into conflict:** Explain the conflict; allow the user to choose another time or intentionally proceed if that policy is later approved.
- **Delete block:** Remove the scheduled plan but keep the task and deadline.
- **Day changed:** Confirm the date change; preserve time-zone context.
- **Multiple blocks:** Update only the selected block and show the task's remaining planned work.
- **Failure/offline:** Preserve the prior plan until the new plan is confirmed saved.

## 6. Create project — MVP

**Goal:** Create an outcome-oriented container for related tasks without turning it into a task.

```text
Projects / command palette / Task project selector
      ↓ Create Project
Project form
      ↓ name + outcome
[optional] description, target context, priority
      ↓ save
Project Created
      ↓
Project Detail
      ↓ [optional]
Add Task / link existing Task
```

### Happy path

1. The user opens Create Project.
2. Dayly requests a project name and outcome; optional fields remain secondary.
3. The user saves.
4. Dayly opens Project Detail or returns to the original selector with the project selected.
5. The user adds tasks or links existing tasks.

### Alternate paths

- **Create from a task:** The task's project selector inherits the new project and returns to the task form.
- **No tasks yet:** Project Detail explains the next action without showing misleading progress.
- **Duplicate name:** Do not block unless a later product rule requires it; show enough context to avoid accidental duplicates.
- **Archive:** Use explicit confirmation and reversible unarchive where supported.
- **Save failure:** Preserve form values.

**Success condition:** The project has a meaningful outcome and can contain tasks independently of the project record.

## 7. Create habit — MVP core

**Goal:** Define a recurring behavior with a comprehensible next occurrence.

```text
Habits / Today / command palette
      ↓ + Habit
Habit form
      ↓ name + supported recurrence
Preview next occurrence
      ↓ save
Habit Created
      ↓
Habit Detail / Habits list / Today due section
```

### Happy path

1. The user opens Create Habit.
2. Dayly asks for a habit name and a simple recurrence.
3. The user optionally adds a preferred time/context and supported reminder.
4. Dayly previews the next due occurrence using the relevant time zone.
5. The user saves and sees the habit in Habits and, when due, Today.

### Alternate paths and unresolved behavior

- **Invalid recurrence:** Explain in plain language and keep the form values.
- **Change recurrence after history:** The UX must show that future occurrences change; the exact treatment of prior history is unresolved.
- **Pause/skip/backfill:** Provide only after the corresponding product rules are approved. Do not imply that a skipped occurrence is completed.
- **Offline:** Do not claim a new recurrence was saved without a defined persistence policy.

## 8. Complete habit — MVP core

**Goal:** Record one due occurrence and show the consistency result without confusing it with task completion.

```text
Today habit card / Habit Detail / Habits
      ↓ Complete occurrence
Occurrence recorded
      ↓
Streak and consistency update
      ↓
Today and Habit Detail show completed state
```

### Happy path

1. The user sees a due occurrence in Today or Habits.
2. The user chooses Complete.
3. Dayly records the occurrence and completion time.
4. The current streak and consistency view update using the MVP rule: completing each due occurrence advances the current streak; a missed due occurrence breaks it unless a later-approved exception applies.
5. The user can undo/reopen only if that correction behavior is supported and clearly labeled.

### Alternate paths

- **Not due today:** Do not offer a misleading “complete today” action unless backfill is explicitly supported.
- **Missed occurrence:** Show missed state separately from incomplete/currently due.
- **Pause:** A paused period must not be silently treated as missed; rules remain unresolved.
- **Offline/save failure:** Show pending/error status rather than a false streak update.
- **Habit completion vs task completion:** No task is created or completed implicitly.

## 9. Start focus session — MVP

**Goal:** Work intentionally with optional task/project context and record actual duration.

```text
Today / Task Detail / Project Detail / Calendar / Focus
      ↓ Start Focus
Select task or project (optional)
      ↓ choose duration
Focus Session
      ↓ work
Pause / resume / interruption note
      ↓ finish
Session Review
      ↓ confirm actual duration
Focus History / source task or project
```

### Happy path

1. The user starts Focus from a source context or the Focus screen.
2. Dayly preselects the task/project when one is available; the user can change or leave it unlinked according to product rules.
3. The user chooses a target duration or starts without one.
4. The active timer shows elapsed time, context, pause/resume, and finish actions.
5. The user finishes the session.
6. Dayly calculates/records actual duration according to the approved interruption model.
7. Session Review confirms actual duration and offers a link to the task/project.
8. The task remains open unless the user explicitly completes it.

### Alternate paths

- **Pause/resume:** Paused time must be distinguishable from focused time if the product can record it.
- **Interruption:** Offer a lightweight note or interruption marker; do not force a lengthy form.
- **App/background interruption:** Preserve or explain timer state according to the later technical decision.
- **Finish with no task:** Record an unlinked focus session if that is supported; do not invent a task.
- **Finish early/late:** Record actual duration; target duration remains a plan.
- **Save failure/offline:** Show last-known timer state and persistence status; never pretend a completed session is durable without a defined rule.
- **Accidental finish:** Provide a limited undo/edit path if approved.

## 10. Review day — MVP

**Goal:** Understand what happened today and make the next decision.

```text
Today
      ↓ orient: date, next commitment, available time
Review scheduled work and important tasks
      ↓ execute / complete / reschedule
Review completed work, habits, focus, and remaining plan
      ↓
Choose next action: continue, replan, or finish day
```

### Review behavior

1. The user opens Today and sees date/time context.
2. Dayly places the next event or task block in context.
3. The user sees important, due, overdue, and scheduled work in an intentional hierarchy.
4. The user executes a task, records a habit, or starts focus without leaving the daily loop unnecessarily.
5. If reality diverges from the plan, the user reschedules remaining work or changes priorities explicitly.
6. The user reviews completed work and a modest day-progress summary.
7. The user may open Analytics for deeper evidence, but the main Today view remains actionable.

### Empty/behind-plan branches

- Empty day → offer one clear task/event/habit action.
- No availability → say capacity is unknown and link to Planning.
- Behind plan → state remaining work and provide replan actions without shame.
- External context unavailable → keep Dayly-owned plan intact and label the missing context.

## 11. Review week — MVP basic analytics / expanded later

**Goal:** Learn whether the user's planning and execution were useful enough to inform the next week.

```text
Analytics
      ↓ choose Week
Weekly summary
      ↓ inspect completion, overdue work, focus, habits, projects
Metric/source detail
      ↓
Open source records or adjust next plan
```

### Happy path

1. The user opens Analytics and selects Week.
2. Dayly states the date range and shows a small set of metrics with definitions.
3. The user reviews task completion, overdue work, focus time, project attention, and habit consistency where data exists.
4. The user selects a metric to drill into its source records.
5. The user returns to Tasks, Projects, Habits, or Today to make a planning change.

### Rules

- Do not present missing data as zero.
- Do not compare estimates and actuals where one side is missing.
- Do not imply that a single score captures productivity.
- Weekly/monthly formulas and project-progress calculation remain subject to later product/data decisions.

## 12. Search — MVP basic, future scope expansion

**Goal:** Find a Dayly record quickly and return to its canonical context.

```text
Global Search / mobile search / shortcut
      ↓ enter query
Search Results
      ↓ choose type/filter
Grouped results
      ↓ open result
Source Detail
      ↓
↩ return preserves query and filters
```

### Happy path

1. The user opens Search from the shell or keyboard shortcut.
2. The user enters a phrase.
3. Dayly groups matching tasks and projects in the MVP; habits/calendar can be included as the search scope expands.
4. The user applies a filter or opens a result.
5. The result opens the source-owned detail view with source labels.
6. Returning to Search preserves the query and useful filters.

### Alternate paths

- Empty query → show examples and optional recent searches only if retention/privacy is approved.
- No results → suggest clearing filters, changing terms, or creating a task only when appropriate.
- Offline → search locally available content and label incomplete scope.
- Permission-limited → exclude inaccessible records without leaking content.
- Search Notes/future content → add only when the content domain exists; do not imply it is currently supported.

## 13. First launch — MVP

**Goal:** Reach a useful Today experience and first completed task quickly.

```text
First launch
      ↓ welcome: understand your day and choose what matters
Planning preferences
      ↓ time zone + basic availability/defaults
[optional] profile/display name
      ↓
First task
      ↓ create or skip
Today first-use state
      ↓ create/complete task
First completed task
```

### Happy path

1. The user sees a concise welcome.
2. Dayly collects time zone and basic planning preferences; it does not require integrations.
3. The user may enter a display name if supported, but the product does not require a social profile.
4. Dayly asks for a first task or offers a clear “do this later” path.
5. The new task appears in Today.
6. The user completes it and sees Dayly update the day context.

### Alternate paths

- Skip optional profile/preferences → use clearly labeled defaults and invite later setup.
- Leave onboarding → resume safely or return to a minimal Today state.
- Integration suggestion → defer to Settings; never block task creation.
- Save error → preserve values and explain the next step.

## 14. Future calendar connection — Post-MVP

**Goal:** Connect Google Calendar while preserving provider ownership and clear sync state.

```text
Settings → Integrations
      ↓ Connect Google Calendar
Explain scope and ownership
      ↓ provider authorization
Select calendars / permissions
      ↓ confirm
Connection pending
      ↓ initial sync
Connected + sync status
      ↓
Calendar / Today shows labeled External Events
```

### Happy path

1. The user chooses Google Calendar from Settings or a contextual Calendar prompt.
2. Dayly explains what it will read/write, which system owns events, and what disconnecting means.
3. The user grants provider permission.
4. The user selects calendars or scope where supported.
5. Dayly displays connection and initial sync status separately; authorization success does not imply event sync success.
6. Imported events appear in Calendar and Today with external source labels.
7. The user can inspect last sync and return to daily planning.

### Alternate paths

- Provider denial → show permission guidance and leave Dayly calendar usable.
- Initial sync error → show retry/stale state; do not show an empty external calendar as successful.
- Conflict/duplicate → follow the future sync policy; never silently overwrite.
- Disconnect → stop future sync and explain treatment of already imported data.
- Offline → preserve last-known state and do not fake a fresh sync.

**Unresolved:** Sync direction, write permissions, recurrence mapping, conflict resolution, and retention are not defined in Phase 0B.

## 15. Future NutriTrack connection — Post-MVP

**Goal:** Show selected NutriTrack context without duplicating nutrition/health ownership.

```text
Settings → Integrations
      ↓ Connect NutriTrack
Explain selected read-oriented categories
      ↓ consent
Connection + sync status
      ↓ approved summary available
Today contextual Nutrition summary
      ↓ inspect source/freshness or manage connection
NutriTrack settings
```

### Happy path

1. The user opens NutriTrack connection from Settings or an optional Today card.
2. Dayly explains the selected categories, source ownership, freshness, and that the feature is not medical advice.
3. The user consents and connects.
4. Dayly reports permission and sync status.
5. A small source-labeled summary appears in the agreed Today context only when relevant and current enough.
6. The user can inspect source period/freshness or manage/disconnect the connection.

### Alternate paths

- No consent → no summary; core Dayly remains fully usable.
- Stale/error data → show stale/unavailable state, not a false current value.
- Disconnect → stop new data and follow the later retention policy.
- Unsupported metric → do not invent a summary or calculate NutriTrack logic in Dayly.

**Unresolved:** Contract, allowed metrics, consent copy, freshness, and retention are future decisions.

## 16. Quick actions

### Quick Add Task

```text
Today / any primary screen
      ↓ + Task
Title
      ↓ save
Task Created
```

Task is the default because capture speed is central. The user can switch to Event or Habit explicitly before entering details.

### Quick Add Event

```text
Today / Calendar
      ↓ + Event
Event title + time
      ↓ save
Dayly Event Created
      ↓
Calendar / Today
```

The flow clearly labels the result as a Calendar Event, not a Scheduled Task.

### Quick Add Habit

```text
Today / Habits / More
      ↓ + Habit
Name + recurrence
      ↓ save
Habit Created
```

### Start Focus

```text
Today / Task / Project / Calendar / Focus
      ↓ Start Focus
Optional task/project + duration
      ↓ start
Active Focus
```

Quick actions should be available from the current context but must not become a floating list of every possible feature.

## 17. Command palette — future interaction, early UX concept

**Goal:** Provide a keyboard- and search-friendly command layer for frequent navigation/actions without replacing normal navigation.

```text
Keyboard shortcut or command affordance
      ↓ open palette
Search commands and destinations
      ↓ choose command
Action form or destination
      ↓ complete/dismiss
Return to source context
```

Initial command candidates:

```text
Create task
Create project
Start focus
Open calendar
Search
Complete task
Go to Today
Create event
Create habit
Open settings
```

Rules:

- Commands require understandable confirmation for destructive or consequential actions.
- Search results and commands are visually distinguishable.
- The palette is optional; every important action remains available through visible UI.
- It must respect permissions, source ownership, and the same progressive-disclosure rules as normal flows.

## 18. Flow quality checklist

Before implementation, each flow should be checked for:

- clear entry point and next action;
- no required advanced fields for a simple task;
- explicit distinction between task, event, scheduled block, habit, and focus session;
- success, save failure, offline, and permission treatment;
- preserved context on return;
- keyboard and touch accessibility;
- reversible or confirmed destructive actions;
- no dependency on future integrations for the MVP;
- no accidental automatic task completion;
- a source-owned detail view after cross-module navigation.
