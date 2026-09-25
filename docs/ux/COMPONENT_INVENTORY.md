# Dayly Conceptual Component Inventory

**Phase:** 0B — UX Architecture & Information Architecture
**Status:** In progress
**Source:** [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md), [`SCREEN_MAP.md`](SCREEN_MAP.md), and [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md)

> This inventory describes reusable UX concepts and their responsibilities. It is not a component API, design-system specification, implementation plan, or production UI code.

## 1. Component principles

- A component should represent a meaningful user action or piece of information, not merely a visual box.
- Components must preserve source ownership and domain distinctions.
- Common states must be designed once and reused consistently.
- Every compact interaction needs an accessible full interaction alternative.
- Components should support progressive disclosure rather than forcing every field into the first view.
- Data-rich components must expose period, source, freshness, or calculation context where relevant.
- Visual hierarchy should communicate priority without relying on color alone.
- Component names describe product intent, not a final framework or implementation technology.

## 2. Navigation components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Application shell** | Holds global navigation, current destination, utilities, and content context. | All primary screens | Loading shell, offline indicator, mobile/desktop variants, current destination, collapsed sidebar, focus order. |
| **Desktop sidebar** | Provides persistent primary navigation. | Desktop/tablet landscape | Expanded/collapsed, active destination, hover/focus, accessible labels, utility links, narrow-width collapse. |
| **Mobile bottom navigation** | Provides fast access to the most frequent destinations. | Mobile Today/Tasks/Calendar/Focus | Active destination, More entry, keyboard/screen-reader alternative, safe-area spacing, overflow into More. |
| **More navigation drawer/sheet** | Holds lower-frequency destinations without overcrowding the mobile bar. | Mobile | Open/closed, active destination, back/dismiss, focus trap, Settings and utility links. |
| **Local navigation row** | Switches views inside a primary destination. | Tasks, Calendar, Habits, Analytics, Settings | Active tab, scrollable narrow layout, unavailable future view, keyboard navigation. |
| **Breadcrumb/context trail** | Shows relation to a project, task, or source context. | Detail and form screens | Full/condensed, truncation, back action, source label, mobile replacement with header back. |
| **Mobile header** | Provides title, back/menu, search, and contextual overflow. | Mobile screens | Root vs detail, scroll behavior, action availability, accessible title, offline/status indicator. |
| **Global search trigger** | Opens Search without requiring navigation away from current work. | App shell | Closed/open, keyboard shortcut hint, mobile icon/label, disabled/error state. |
| **Profile/settings trigger** | Opens utility access to Profile and Settings. | Desktop shell, More menu | Signed-in identity state when defined, unavailable account state, focus and keyboard access. |
| **Notification indicator** | Signals actionable reminders/system states without becoming primary nav. | Shell, Today | Unread count/badge, muted, loading, error, clear accessible label. |
| **Quick-add trigger** | Opens the minimal capture flow. | Shell, Today, Tasks, mobile | Default Task, Event/Habit alternatives, open/close, keyboard/touch, disabled save state. |
| **Command palette trigger** | Opens the future command/navigation layer. | Shell | Shortcut hint, focus entry, unavailable when modal is active, visible alternative commands. |
| **Connection/status indicator** | Shows stale/error state for optional external context. | Calendar, Today, Integrations | Connected, syncing, stale, error, disconnected, source label, actionable recovery. |

## 3. Task components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Task row** | Scannable representation of one actionable task. | Today, Tasks, Inbox, Projects, Search | Open, in progress, completed, overdue, scheduled, selected, keyboard actions, compact/mobile layout. |
| **Task completion control** | Explicitly completes or reopens a task. | Task row, Task Detail, Today | Unchecked, checked, pending, error, undo, accessible label that includes task title. |
| **Quick Add Task form** | Captures a title with minimal friction. | Today, Tasks, shell, mobile sheet | Empty, typing, validation, saving, save error, offline/pending, success, cancel. |
| **Task detail header** | Places title, completion, status, and primary actions first. | Task Detail | Open/completed, overdue, archived, edit mode, action menu, loading. |
| **Task property summary** | Shows priority, deadline, schedule, project, estimate, and tags in a readable hierarchy. | Task Detail, Today, Task row variants | Missing value, populated, overdue, conflict, source link, responsive collapse. |
| **Task editor** | Edits task properties with progressive disclosure. | Create/Edit Task | Required/optional fields, unsaved changes, validation, save error, read-only/permission, advanced sections. |
| **Priority control** | Sets and displays relative importance. | Task editor, row/detail, filters | None/levels, selected, keyboard menu, accessible text, not conflated with deadline. |
| **Deadline control** | Sets the latest intended completion point. | Task editor, scheduling flow | Date only/date-time support, cleared, past/overdue, time-zone context, validation. |
| **Schedule block control** | Adds or edits planned work time. | Calendar, Task Detail, scheduling flow | Proposed, saved, conflict, unavailable capacity, moved, deleted, multi-block when supported. |
| **Estimate/actual duration display** | Differentiates forecast from recorded effort. | Task Detail, Analytics, Project Detail | Estimate only, actual only, both, missing, invalid comparison, source focus link. |
| **Project selector** | Associates a task with a project without leaving the form. | Task editor, Quick Add, filters | Empty, search, selected, no results, create project option, loading/error. |
| **Tag selector** | Applies lightweight retrieval labels. | Task editor, filters, Search | Empty, selected chips, create/choose behavior, overflow, no results. |
| **Subtask list** | Shows smaller actionable units under a task. | Task Detail, editor | No subtasks, open/completed, parent relationship, add/edit, unresolved parent-completion rule. |
| **Reminder control** | Configures supported task prompts. | Task editor, settings | None, scheduled, invalid time, quiet-hours conflict, future channel availability. |
| **Recurrence control** | Configures repeated task work when supported. | Task editor, future | Hidden by default, simple recurrence, preview, unsupported/invalid, unresolved advanced rules. |
| **Task filter bar** | Narrows task views by status, project, priority, tag, or date. | Tasks, Inbox, Search | Applied filters, clear all, mobile sheet, no results, persistent return context. |
| **Task bulk/action menu** | Groups non-destructive list actions if bulk behavior is later approved. | Tasks/Inbox | Selection, disabled action, confirmation, partial error, undo; not required for MVP. |

## 4. Calendar components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Calendar view switcher** | Changes Day/Week/Month temporal view. | Calendar | Day MVP, future Week/Month, active view, keyboard/mobile selection. |
| **Date navigator** | Moves to a date/range while preserving time-zone context. | Calendar, Today upcoming | Previous/next/today, date picker, loading, disabled invalid range, mobile compact mode. |
| **Day agenda** | Presents chronological events and scheduled tasks. | Calendar, Today | Empty, populated, current time, conflict, scroll position, accessible chronological order. |
| **Week grid** | Provides broader planning context. | Calendar post-MVP | Planned future view, dense events, keyboard alternative, responsive collapse. |
| **Month grid** | Provides high-level date orientation. | Calendar post-MVP | Planned future view, event density, selected date, no-detail shorthand, responsive alternative. |
| **Timeline** | Shows time allocation, availability, events, and blocks. | Today, Calendar | Current time, availability, overlaps, zoom/density, mobile vertical scroll. |
| **Dayly Event card** | Represents a Dayly-owned Calendar Event. | Calendar, Today, Search | Source label, recurring, selected, edit/delete, conflict if linked. |
| **Scheduled Task block** | Represents planned work linked to a task. | Calendar, Today | Task title, estimate, planned duration, moved, conflict, completed task, source link. |
| **External Event card** | Represents a future provider-owned event without confusing ownership. | Calendar/Today post-MVP | External source badge, read-only, stale, sync error, selected, permission issue. |
| **Focus Session marker** | Shows a recorded/active focus session in temporal context when useful. | Calendar/Today/history | Active, completed, paused, linked/unlinked, must not look like a Calendar Event. |
| **Availability band** | Shows known working/free planning capacity. | Calendar, Today | Configured, unavailable/unknown, exception, conflict, visually secondary to commitments. |
| **Current-time marker** | Orients the user in a day timeline. | Calendar/Today | Current, past/future date, time-zone label, accessible text alternative. |
| **Conflict marker** | Explains overlap or insufficient capacity. | Calendar, scheduling flow | Warning, acknowledged, resolved, external sync conflict, text explanation not color-only. |
| **Schedule editor** | Chooses/moves task blocks with deadline and capacity context. | Task Detail, Calendar | Proposed, conflict, saved, save error, mobile bottom sheet, keyboard alternative to drag. |
| **Event editor** | Creates/edits Dayly-owned events. | Calendar, Quick Add | Title/time required, recurrence progressive, save/cancel, validation, source ownership. |
| **Calendar source legend** | Makes Event/Scheduled Task/Focus/External Event distinguishable. | Calendar, Today | Visible/compact, accessible text, source unavailable, no reliance on color only. |

## 5. Project components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Project row/card** | Summarizes an outcome and attention state. | Projects, Search, Today cue | Active, archived, overdue task cue, no tasks, selected, keyboard open. |
| **Project creation form** | Creates an outcome-oriented project with low setup cost. | Projects, command palette | Name/outcome required, optional fields, validation, save error, success. |
| **Project header** | Places outcome, lifecycle, and primary actions first. | Project Detail | Active, paused/archived, edit, archive confirmation, loading. |
| **Project progress indicator** | Communicates derived progress without locking a final formula. | Project Detail, Projects, Analytics | Count/time/strategy label, missing data, no tasks, stale, unresolved calculation. |
| **Project task group** | Organizes tasks by useful execution context. | Project Detail | Open/completed/scheduled/overdue groups, empty group, filter, collapse. |
| **Project filter bar** | Filters tasks or projects by lifecycle/attention. | Projects, Project Detail | Active/archived, date/status, clear filters, no results. |
| **Project archive control** | Archives/unarchives a project deliberately. | Project Detail, Projects | Confirmation, reversible undo, success, error, permission. |
| **Project activity summary** | Shows recent task/progress change when supported. | Project Detail | No activity, populated, source link, loading, privacy scope. |

## 6. Habit components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Habit row/card** | Shows recurrence, due state, and quick completion. | Today, Habits, Search | Due, completed, missed, paused, archived, selected, compact mobile. |
| **Habit completion control** | Records one explicit occurrence. | Habit row, Today, Habit Detail | Due, completed, pending, error, undo/backfill only when approved. |
| **Habit creation/editor** | Defines name and supported recurrence. | Habits, Habit Detail | Simple cadence, next occurrence preview, advanced rules hidden, validation, save error. |
| **Recurrence selector** | Chooses a repeat pattern in understandable language. | Habit editor | Daily/selected days/interval as approved, preview, time zone, unsupported state. |
| **Occurrence status** | Distinguishes due, completed, missed, paused, and not-applicable. | Habits, Today, history | Text + visual distinction, no automatic inference from tasks/events. |
| **Streak display** | Shows current run with an understandable rule. | Today, Habit Detail, Analytics | First occurrence, active streak, broken streak, paused/exception unresolved, definition link. |
| **Consistency summary** | Shows completion against expected occurrences for a stated period. | Habit Detail, Analytics | Period/denominator, incomplete data, no occurrences, source history. |
| **Habit history** | Lets the user inspect occurrences over time. | Habit Detail, Habits | Completed/missed/paused, date range, no history, loading, future correction rules. |
| **Pause/skip/backfill controls** | Reserved for explicit exception behaviors. | Habit Detail/editor future or approved subset | Confirmation, explanation of streak effect, unresolved behavior must not be implied. |

## 7. Focus components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Focus start panel** | Selects optional task/project and target duration. | Focus, Today, Task/Project Detail | No context, selected context, duration, validation, start pending. |
| **Focus timer** | Makes active elapsed state central and legible. | Focus, Today compact state | Idle, active, paused, finishing, persistence error, background/visibility handling. |
| **Focus context selector** | Associates a session without requiring a task. | Focus start/review | Search/select, selected task/project, no results, clear, permission. |
| **Timer control group** | Provides start/pause/resume/finish actions. | Focus | Action availability by state, keyboard/touch, accidental finish protection. |
| **Interruption note/control** | Records meaningful interruption context without adding friction. | Active Focus, finish review | Optional, collapsed, saved, error, not counted as task completion. |
| **Focus session review** | Confirms actual duration and source context after finish. | Focus | Actual duration, target comparison, linked task, edit/undo if approved, save error. |
| **Focus history row** | Lists past sessions with duration and context. | Focus, Analytics, Task/Project Detail | Linked/unlinked, date, duration, no history, filter, source navigation. |

## 8. Analytics components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Analytics period selector** | Chooses Today/Week/Month and date range. | Analytics | Current range, custom/future option, loading, time-zone label, mobile sheet. |
| **Metric summary card** | Answers one decision-support question. | Analytics, Today, Project/Habit context | Value, definition, period, incomplete data, source link, no data. |
| **Completion summary** | Shows task completion under an explicit definition. | Analytics, Today | Completed/open/overdue context, denominator, drill-down. |
| **Focus time summary** | Shows actual focus duration. | Analytics, Focus, Today | Linked/unlinked, period, missing sessions, drill-down. |
| **Planned-versus-actual summary** | Compares supported planning and focus data. | Analytics, Task/Project context | Both sides present, missing estimate/actual, explanation, no false precision. |
| **Project progress summary** | Shows project state using a labeled strategy. | Analytics, Project Detail | Strategy label, no tasks, incomplete data, unresolved formula. |
| **Habit consistency summary** | Shows expected versus completed occurrences. | Analytics, Habit Detail | Period/denominator, streak context, no occurrences, missed state. |
| **Trend visualization** | Shows a useful change over time. | Analytics post-MVP/expanded | Empty, populated, accessible data table alternative, no decorative score. |
| **Analytics source link** | Connects a metric to source records. | All analytics views | Click/focus, filtered source list, unavailable source, preserved period. |
| **Data freshness/completeness notice** | Explains stale, missing, or partial data. | Analytics, integrations | Current, partial, stale, error, source/provenance, dismissal if safe. |

## 9. Form components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Text input** | Captures short required/optional text. | Tasks, projects, habits, events, settings | Empty, focused, filled, invalid, disabled/read-only, character guidance. |
| **Text area** | Captures descriptions/notes without crowding quick capture. | Task/project/event detail | Collapsed/expanded, autosize or explicit expand, validation, unsaved changes. |
| **Date picker** | Selects a date with time-zone context. | Deadlines, events, scheduling, analytics | Today, selected, past/overdue, invalid, keyboard alternative, mobile full-screen. |
| **Time picker** | Selects a local start/end time. | Events, task blocks, habits | Start/end validation, conflict context, time zone, keyboard entry, mobile sheet. |
| **Duration input** | Captures estimate, target, or time range. | Tasks, Focus, scheduling | Empty, invalid, unit clarity, estimate vs actual label. |
| **Select/combobox** | Chooses project, priority, source, period, or preference. | Forms and filters | Search, selected, no results, create option, loading/error, keyboard navigation. |
| **Multi-select/tag input** | Applies tags or selected calendars/categories. | Tasks, Search, Integrations | Chips, overflow, clear, no results, permission scope. |
| **Toggle/switch** | Changes a bounded preference or option. | Settings, reminders, forms | On/off, disabled with reason, unsaved, accessible label. |
| **Checkbox/radio control** | Chooses completion/selection options. | Forms, selectors, filters | Checked/unchecked, indeterminate where valid, disabled, keyboard. |
| **Recurrence editor** | Defines recurring event/task/habit behavior. | Event/habit/task future | Simple default, preview, exceptions, unresolved rule notice, validation. |
| **Reminder editor** | Defines supported prompts. | Task/habit/event/settings | None/scheduled, quiet-hours warning, channel unavailable, save error. |
| **Unsaved changes indicator** | Prevents accidental loss of edits. | All full editors | Clean, dirty, save pending, leave confirmation, save error. |

## 10. Feedback components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Inline validation** | Explains a field issue next to its source. | Forms | Error, warning, resolved, accessible association, plain-language fix. |
| **Toast/brief confirmation** | Confirms a non-blocking action. | Create, complete, schedule, settings | Success, undo, error, timeout, accessible announcement; not sole feedback for critical errors. |
| **Inline error banner** | Explains a section-level failure with retry. | Today, lists, analytics, integrations | Retry, partial failure, source label, dismiss only if safe. |
| **Empty state** | Guides the first useful action for a blank feature. | All lists/screens | First use, no current records, no filtered records distinction, primary action. |
| **No-results state** | Explains a query/filter with no matches. | Search, Tasks, Projects, Habits | Clear filters, change query, no false “empty product” language. |
| **Skeleton/loading state** | Shows that content is being retrieved. | Lists/detail/analytics | Stable layout, no invented values, reduced motion alternative. |
| **Progress indicator** | Shows a bounded save/sync/onboarding operation. | Forms, onboarding, integrations | Determinate/indeterminate, label, cancellation if safe, error. |
| **Offline/stale banner** | Makes connectivity/freshness visible. | Calendar, Today, settings, analytics | Offline, reconnecting, stale external data, pending local change. |
| **Permission explanation** | Explains denied account/provider access and recovery. | Integrations, settings, source views | Denied, request/retry, alternative path, no sensitive detail leak. |
| **Confirmation dialog** | Confirms destructive or consequential action. | Archive, delete, disconnect, recurrence changes | Impact, cancel/default focus, confirm pending, error, undo alternative. |

## 11. Overlay and focused interaction components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Modal dialog** | Focuses a bounded decision or form. | Confirmations, desktop Quick Add | Open/closed, focus trap, escape behavior, validation, mobile adaptation. |
| **Side drawer** | Shows detail or local context without losing the list. | Desktop task/event/project detail where useful | Open/closed, resize/close, deep link, focus, full-screen fallback. |
| **Bottom sheet** | Presents selectors/actions on mobile. | Mobile Quick Add, filters, date/time, More | Snap/scroll, dismiss, focus, keyboard alternative, unsaved warning. |
| **Full-screen mobile form** | Gives complex create/edit flows enough space on narrow screens. | Task/event/habit/project forms | Step/back/save, keyboard handling, unsaved changes, success return. |
| **Popover/menu** | Provides local, non-destructive actions. | Row overflow, sort, profile utility | Open/close, keyboard navigation, click-away, action confirmation. |
| **Command palette** | Searches commands/destinations and executes permitted actions. | Global shell, future | Query, command/result distinction, keyboard, no results, destructive confirmation. |
| **Quick Add sheet** | Gives a unified capture entry with Task default. | Today and global shell | Task/Event/Habit choice, minimal fields, save/error, mobile/desktop variants. |
| **Filter sheet** | Moves dense filters off a narrow list. | Tasks, Projects, Search, Analytics | Applied count, reset, apply/cancel, no results. |

## 12. Data visualization components

| Component | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Day timeline** | Shows chronological events, task blocks, and availability. | Today, Calendar | Text alternative, current time, conflict, scroll/keyboard, source distinction. |
| **Progress bar/ring** | Shows a bounded progress measure when its denominator is clear. | Day/project summaries | Labeled strategy, no data, partial data, not a universal productivity score, text value. |
| **Trend line/bar chart** | Shows a meaningful change over a defined period. | Analytics future/expanded | Accessible table/summary, axis labels, missing data, no decorative zero. |
| **Calendar occurrence grid** | Shows habit consistency across dates. | Habit Detail/Analytics | Completed/missed/paused distinction, date labels, text summary, sparse data. |
| **Comparison block** | Compares estimate/plan with actual only when both exist. | Analytics/task/project | Missing side, units, period, explanation of interpretation. |
| **Metric definition disclosure** | Explains how a derived value was calculated. | Analytics/project/habit | Expanded/collapsed, source link, unresolved formula label. |
| **Legend/source key** | Explains color, pattern, label, and ownership meaning. | Calendar, analytics, Today | Visible text, high contrast, no color-only meaning. |

## 13. Mobile-specific patterns

| Pattern | Purpose | Used in | Important states and interactions |
|---|---|---|---|
| **Bottom navigation** | Frequent destination switching. | Mobile shell | Four primary items plus More, active state, accessibility alternative. |
| **Floating/anchored quick action** | Fast task/event/habit capture. | Today, Tasks, Calendar | Avoids content obstruction, expands to named actions, keyboard alternative. |
| **Bottom sheet** | Contextual action or selection without full navigation. | Filters, dates, selectors, More | Scrollable, dismissible, focus managed, safe-area aware. |
| **Full-screen editor** | Supports multi-field forms on narrow screens. | Task/project/event/habit | Sticky or reachable save, back/unsaved warning, validation summary. |
| **Sticky action bar** | Keeps primary action reachable while scrolling. | Forms, Focus, detail | Save/complete/start availability, does not hide content, screen-reader order. |
| **Swipe-safe row actions** | Optional shortcut for non-destructive list actions. | Task/habit lists | Visible menu alternative, no destructive action by accidental swipe, undo. |
| **Compact timeline** | Preserves temporal context without desktop columns. | Today/Calendar | Vertical order, current time, source labels, accessible list alternative. |
| **Pull/refresh or explicit refresh** | Requests current data when appropriate. | Future integrations, lists | Loading, last-updated label, error, no false freshness. |
| **Mobile filter summary** | Shows active constraints without exposing the full filter UI. | Tasks/Search/Analytics | Count/chips, clear all, open sheet, no results guidance. |

## 14. Shared accessibility and state requirements

Every reusable component should define:

- keyboard/focus behavior where relevant;
- an accessible name and state announcement;
- text or structural alternatives for color, icon, drag, timer, and chart cues;
- loading and error semantics that do not move focus unexpectedly;
- sufficient target size and spacing for touch;
- reduced-motion behavior for timers, transitions, and charts;
- handling for long titles, large text, localization, and narrow widths;
- permission and privacy behavior for data the user cannot access;
- a clear source label for imported or derived information.

## 15. Inventory boundaries

- No component in this inventory creates a database entity or API contract.
- No component makes NutriTrack calculations or owns external calendar events.
- No analytics component should imply a final productivity score.
- No focus component marks a task complete automatically.
- No visual component substitutes for the product decisions still listed as unresolved in the UX decision log.
