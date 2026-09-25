# Dayly UX Principles and Decision Log

**Phase:** 0B — UX Architecture & Information Architecture
**Status:** Approved (historical)
**Source:** [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md), [`INFORMATION_ARCHITECTURE.md`](INFORMATION_ARCHITECTURE.md), and [`SCREEN_MAP.md`](SCREEN_MAP.md)

> These principles guide future UX design and validation. They do not lock final colors, typography, component APIs, or production implementation.

## 1. UX direction

Dayly should feel:

- modern and premium without being showy;
- calm rather than anxious or gamified;
- information-rich without becoming a dense CRUD dashboard;
- fast for capture and common actions;
- highly legible at a glance and during focused work;
- mobile-first in interaction thinking;
- responsive across narrow and wide viewports;
- accessible to different input methods, abilities, and display settings;
- closer to a considered productivity product than to a generic administrative interface.

The design direction should be expressed through hierarchy, spacing, interaction quality, feedback, and restraint before final visual tokens are selected. Final colors, typography, elevation, iconography, motion tokens, and branding belong primarily to a later Design System phase.

## 2. Core UX principles

### 2.1 Today is the decision surface

Today is the primary Dayly experience. It should help the user understand the current day and choose the next useful action. Other sections provide depth and ownership; they should not make Today redundant.

### 2.2 Clarity before configuration

A simple task should be created with a title. A user should not need to understand projects, tags, recurrence, estimates, or integrations before capturing an idea.

### 2.3 Progressive disclosure

Show the smallest useful set of fields and information first. Reveal advanced recurrence, reminders, subtasks, history, and analytics definitions when relevant. Progressive disclosure must not hide an important consequence such as changing a deadline or disconnecting a provider.

### 2.4 Preserve the user's mental model

Use product language consistently:

- **Task:** actionable work;
- **Project:** outcome-oriented container;
- **Calendar Event:** time-bound commitment;
- **Scheduled Task:** planned work block;
- **Habit:** recurring behavior;
- **Focus Session:** actual effort record;
- **Analytics:** derived evidence for decisions.

Avoid using one visual treatment or one generic “item” action when the domain meaning changes.

### 2.5 Separate deadline from planned time

A deadline is a constraint. A scheduled block is an intention. The interface must keep them side-by-side when useful but not merge them into one date field or silently change one when the other changes.

### 2.6 Capture quickly, organize deliberately

Quick Add should take seconds and require only a title for tasks. Organization can happen immediately or later in Inbox/Tasks. A user should never lose an idea because the product demanded a complete project plan first.

### 2.7 Explicit completion

A task is complete because the user or an explicitly approved product action says so. A timer finishing, a scheduled time passing, or an event ending does not silently complete the task.

### 2.8 Context follows the user

When the user opens a task from Today, returns to Today. When the user opens a task from a project, preserve project context. Back navigation should reduce orientation work rather than reset the user's place.

### 2.9 Design for the next action

Every primary view should make its main next action visible. Empty states should teach the first useful step. Analytics should point toward a planning decision. Error states should offer recovery rather than merely report failure.

### 2.10 Calm information hierarchy

Not every metric, card, badge, and alert deserves equal emphasis. Use urgency, relevance, recency, and user intent to order information. Avoid red for normal overdue work as a moral judgment; use clear language and appropriate emphasis instead.

### 2.11 Trustworthy feedback

The interface must distinguish saved, saving, pending, failed, stale, and unavailable. A successful authorization is not necessarily a successful synchronization. A displayed number must not look current when its source is stale.

### 2.12 Reversible where possible

Completion, archive, reschedule, dismiss, and preference changes should be reversible or confirmed according to their consequences. Destructive actions must not be hidden behind accidental gestures.

### 2.13 Source and ownership remain visible

External calendar events and NutriTrack summaries are contextual and source-labeled. Derived analytics and streaks explain their period and basis. Dayly must not make imported information look like a Dayly-owned record.

### 2.14 Mobile is a different composition

Mobile prioritizes Today, Tasks, Calendar, and active Focus. It uses bottom navigation, focused sheets, full-screen forms, and contextual actions rather than shrinking a desktop sidebar and multi-column layout.

### 2.15 Accessibility is structural

Keyboard navigation, screen-reader names, visible focus, text alternatives to color and charts, reduced motion, large text, touch targets, and readable contrast are part of the information architecture rather than a final polish step.

### 2.16 Explain derived information

Progress, streaks, consistency, planned-versus-actual comparisons, and day summaries need understandable definitions. If a formula is unresolved, the interface should not present a precise-looking result as settled truth.

### 2.17 Privacy and restraint

Do not show more health, account, or integration information than the user needs in the current context. Do not require integrations for the core experience. Keep profile and account features personal rather than social.

### 2.18 Extend without inflating navigation

New features should first earn a contextual entry point. A feature does not automatically deserve a top-level destination. The top-level navigation should remain stable while detail grows inside its owning domain.

## 3. Information hierarchy rules

### 3.1 Page hierarchy

For most destination screens:

1. orientation: where the user is and the relevant period/source;
2. primary task: the action or decision the screen supports;
3. essential records: the information needed for that decision;
4. secondary controls: filters, sorting, and organization;
5. contextual detail: history, explanations, optional integrations, and advanced settings.

### 3.2 Row hierarchy

For a task, project, habit, or event row:

1. recognizable title/name;
2. action state or key time constraint;
3. relevant context such as project/source;
4. secondary metadata such as estimate, tags, or history;
5. overflow actions that do not hide the primary action.

### 3.3 Form hierarchy

1. explain what is being created/edited;
2. ask for the smallest required information;
3. keep primary action reachable;
4. reveal optional fields by relevance;
5. explain consequences before save for recurrence, deletion, disconnect, or deadline changes;
6. preserve entered values after failure.

### 3.4 Analytics hierarchy

1. state the question or decision the period supports;
2. state the period and data completeness;
3. show a small number of useful measures;
4. show definition/source access;
5. offer a path to the records or next planning action.

### 3.5 Analytics by period

**Daily — What should I learn now?**

- What did I complete today?
- What is overdue or still important?
- How much planned time remains and what is coming next?
- Did actual focus time diverge enough from the plan to replan?

Daily learning belongs primarily in Today, with a deeper Analytics view available when the user asks for it. It should lead to an immediate action such as complete, focus, or reschedule.

**Weekly — What should I adjust for the next week?**

- Which tasks and projects moved forward?
- How much work was completed versus left overdue or rescheduled?
- How did estimated/planned time compare with recorded focus time where data exists?
- Which habits were consistent, and where did expected occurrences go missed?

Weekly learning belongs in Analytics and should link back to source records and the next planning decision. Basic weekly summaries are compatible with the MVP; expanded comparisons are later.

**Monthly — What pattern or direction is worth noticing?**

- Are completion, overdue work, focus time, project progress, and habit consistency changing over time?
- Which recurring planning assumptions appear unreliable?
- Which projects or routines need a deliberate change rather than another reminder?

Monthly learning is a post-MVP/expanded experience until definitions, retention, and data completeness are mature. It should emphasize trends and decisions, not a decorative productivity score.

## 4. Responsive behavior

The breakpoints below are planning bands, not a final CSS contract.

### 4.1 Mobile — approximately 320–767px

- Use Today, Tasks, Calendar, and Focus as the persistent high-frequency destinations.
- Place Projects, Habits, Analytics, Search, Settings, and lower-frequency utilities behind More without making them unreachable.
- Use a compact header with back/menu, title, search, and contextual action.
- Use Quick Add as an anchored action or equivalent that does not cover important content.
- Convert multi-column lists/detail layouts into stacked content or a list-to-detail transition.
- Use bottom sheets for short selection/filter actions.
- Use full-screen views for multi-field task, project, event, and habit editing.
- Replace drag-and-drop with a move/reschedule action that exposes the same result.
- Keep action controls reachable during long forms or Focus sessions.
- Collapse secondary Today widgets behind sections or “show more”; keep the next action visible.
- Support large text and landscape orientation without clipping time or completion controls.

### 4.2 Tablet — approximately 768–1023px

- Use a compact sidebar/rail in landscape and the mobile drawer/bottom model in narrower portrait layouts.
- Permit list-plus-detail only when both sides remain readable.
- Keep Calendar's timeline readable; switch to a focused day view before shrinking text.
- Use side panels for selectors/forms when space allows, otherwise bottom sheets/full-screen forms.
- Preserve the same primary navigation and action labels as desktop/mobile.

### 4.3 Desktop — 1024px and above

- Use a persistent sidebar with primary navigation and local secondary navigation.
- Permit list-plus-detail layouts for Tasks, Projects, and source records where they improve context.
- Use Calendar timeline/grid views with clear source differentiation and keyboard-accessible move alternatives.
- Keep the main content column readable rather than stretching cards across the full viewport.
- Allow sidebar collapse only when labels remain available and current location stays clear.
- Keep global Search, Quick Add, command palette, profile, and notification utility controls consistent across destinations.

### 4.4 Responsive invariants

Across every size:

- Today remains the primary daily control surface.
- Completion, scheduling, and source ownership remain explicit.
- No action is available only through hover, drag, swipe, or a desktop shortcut.
- The same data hierarchy is preserved even when the composition changes.
- Status is communicated through text/structure as well as color or motion.
- Long titles, large text, localization, and reduced motion must be considered.

## 5. General UX state matrix

The state treatment below applies across major features. The screen map adds feature-specific behavior.

| State | User meaning | UX behavior |
|---|---|---|
| **Loading** | The product is retrieving or saving information. | Preserve orientation and stable labels; show skeleton/progress without invented zeros; prevent duplicate destructive actions. |
| **Empty** | The domain/filter has no records. | Explain what belongs here and offer the first useful action; distinguish first use from an intentionally empty day. |
| **Populated** | Normal usable content exists. | Apply hierarchy, scanning, source labels, and direct primary action. |
| **Error** | A request or action failed. | State what failed, preserve input/known content, offer retry or safe exit, and avoid silently reverting. |
| **Offline** | Required connectivity is unavailable or uncertain. | Show cached scope and freshness; label pending changes; never claim a sync/save succeeded without a defined offline policy. |
| **Success** | A requested action completed. | Confirm the outcome, update the source context, and offer undo/review where appropriate. |
| **Permission denied** | The user/provider has not granted access. | Explain the affected data and recovery path; keep unrelated Dayly functionality usable. |
| **No results** | A query/filter has no matches. | Preserve query/filter controls, suggest clear/change actions, and do not describe the whole domain as empty. |
| **First use** | The user has not yet formed a feature's first mental model. | Give one short explanation and one primary action; avoid tours, charts, and configuration walls. |
| **Stale** | Data is known but may not be current. | Label source and last-known time; provide refresh/recovery when applicable; avoid current-tense certainty. |
| **Partial** | Some sections/data are available while others fail or are incomplete. | Keep usable content visible and identify the affected section rather than replacing the whole screen with an error. |

## 6. Feedback and interaction standards

### 6.1 Creation and save

- A save control has a clear label and pending state.
- A successful save identifies what was created/changed and where it can be found.
- Save errors preserve values and name the next recovery action.
- A user is not required to infer status from a spinner alone.

### 6.2 Completion

- Completion is an explicit action with a clear state change.
- The action is available by keyboard, touch, and assistive technology.
- A completed task can be reopened through a visible action.
- Habit completion says “occurrence” or equivalent where needed so it is not confused with a task.

### 6.3 Scheduling

- Calendar Event, Scheduled Task, Focus Session, and External Event have different labels and treatments.
- Moving a scheduled block does not silently edit a task deadline.
- Drag interactions have a menu/editor alternative.
- Conflicts are explained in words and not communicated by color alone.

### 6.4 Destructive actions

- Archive, delete, disconnect, and significant recurrence changes state their impact.
- Default focus is on the safe/cancel action when appropriate.
- Undo is preferred to a confirmation dialog for low-risk reversible actions.
- Destructive actions are not triggered by accidental swipe or keyboard proximity.

### 6.5 Timing and motion

- Timers remain legible under reduced motion and screen-reader use.
- Progress animation never implies a result that has not been saved.
- Transitions preserve context and do not delay frequent actions.
- No animation is required to understand completion, conflict, or source ownership.

## 7. Design direction boundaries

### In scope for UX architecture

- hierarchy, navigation, content grouping, progressive disclosure;
- responsive compositions and interaction patterns;
- source/state/ownership communication;
- accessibility expectations and feedback behavior;
- conceptual component inventory and flows.

### Deferred to a later Design System phase

- final color palette and semantic color tokens;
- final typography scale and font selection;
- icon library and exact icon shapes;
- border radius, shadow, elevation, and spacing token values;
- motion duration/easing tokens;
- final visual branding and illustrations;
- coded component implementation and visual regression tests.

## 8. UX decision log

### Decision 1 — Today is the default and primary daily destination

**Context:** Dayly's central product loop starts with understanding the current day.

**Decision:** Today is the default landing experience and the first persistent primary navigation item.

**Reason:** It brings tasks, schedule, habits, focus, and progress into an actionable daily context without making every module compete for attention.

**Trade-offs:** Users seeking a specific record take one additional step or use global Search; Today must avoid becoming a cluttered dashboard.

**Status:** Accepted for Phase 0B; validate hierarchy and density in later UX testing.

### Decision 2 — Keep the primary navigation to nine destinations

**Context:** The prompt lists Today, Tasks, Projects, Calendar, Habits, Focus, Analytics, Search, and Settings, while also naming Notifications, Profile, and Integrations as screens.

**Decision:** Use the nine listed destinations as primary navigation. Treat Inbox as a Tasks view, Notifications as a global utility, Profile and Integrations as Settings subsections, and detail/create screens as contextual.

**Reason:** The product specification favors clear boundaries and discourages adding navigation items simply because a feature exists.

**Trade-offs:** Some lower-frequency features require a utility menu or contextual entry; they remain discoverable through links and command actions.

**Status:** Accepted for Phase 0B.

### Decision 3 — Mobile prioritizes Today, Tasks, Calendar, and Focus

**Context:** Mobile cannot provide a persistent, legible destination for every desktop section.

**Decision:** Use those four high-frequency destinations in mobile bottom navigation and place the remaining destinations in More.

**Reason:** These support the daily loop and active execution. Projects, Habits, Analytics, Search, and Settings remain accessible without crowding the bar.

**Trade-offs:** Habit and Project access is one step deeper on mobile; usage should be validated before changing the stable navigation model.

**Status:** Accepted as the initial mobile IA; subject to usability validation.

### Decision 4 — Quick Add requires only a task title

**Context:** Dayly must support capture before organization.

**Decision:** The minimum task creation input is a title. Advanced fields are progressively disclosed.

**Reason:** This protects speed and keeps the first task flow understandable.

**Trade-offs:** Some tasks enter Inbox without enough planning context and require later triage.

**Status:** Accepted for MVP UX.

### Decision 5 — Inbox is a view, not a top-level domain

**Context:** The requested screen inventory includes Inbox, while the product specification defines Tasks as the actionable-work domain rather than a separate inbox entity.

**Decision:** Place Inbox under Tasks as a triage view. Its canonical flag/derivation is unresolved for the data-model phase.

**Reason:** This supports capture and triage without introducing an undocumented product domain or conflating Inbox with Open.

**Trade-offs:** The eventual data model must support a clear triage rule; the UI cannot rely on an ambiguous label indefinitely.

**Status:** UX direction accepted; data rule unresolved.

### Decision 6 — Keep Calendar objects visually distinct

**Context:** Task, event, focus, and external calendar concepts have different ownership and meaning.

**Decision:** Use distinct labels, metadata, interaction affordances, and a source legend for Calendar Event, Scheduled Task, Focus Session, and External Event.

**Reason:** This directly implements the product boundaries and prevents accidental cross-domain actions.

**Trade-offs:** The calendar has more visual vocabulary and needs a short first-use explanation.

**Status:** Accepted for Phase 0B.

### Decision 7 — Focus completion never completes a task automatically

**Context:** Actual time is evidence about effort, not proof that actionable work is done.

**Decision:** Finish Focus leads to Session Review and separately offers task completion.

**Reason:** It preserves explicit completion and trustworthy analytics.

**Trade-offs:** One extra action is required when a focus session finishes the task; this avoids a more harmful false completion.

**Status:** Accepted from product specification.

### Decision 8 — External integrations are optional contextual flows

**Context:** Google Calendar and NutriTrack are post-MVP and have unresolved contracts.

**Decision:** Keep connection management under Settings and show imported/contextual data only in source-labeled Calendar/Today contexts after connection.

**Reason:** This preserves ownership, keeps MVP useful without integrations, and makes permission/sync state visible.

**Trade-offs:** Integration users may visit Settings before seeing the result; future contextual prompts can provide a direct entry without making it mandatory.

**Status:** Accepted for Phase 0B; sync and NutriTrack behavior unresolved.

### Decision 9 — Do not lock the project progress formula in UX

**Context:** Product progress is derived and the final strategy is not yet defined.

**Decision:** Reserve a labeled progress component that can explain its strategy, missing data, and period without committing to a final formula.

**Reason:** The UX can support count-, time-, or other reviewed strategies without creating a false promise.

**Trade-offs:** Early screens may show a limited or “method to be defined” state; this is preferable to a misleading percentage.

**Status:** UX container accepted; formula unresolved for a later phase.

### Decision 10 — Keep habit exception actions explicit and provisional

**Context:** Pause, skip, backfill, and recurrence changes affect streaks and consistency, but product rules remain open.

**Decision:** Design controls as reserved/progressive interactions and do not imply their effect until the rule is approved.

**Reason:** A polished control with an undefined consequence would create a hidden product decision.

**Trade-offs:** Habit UX may be intentionally narrower in MVP.

**Status:** MVP completion/review path accepted; exception behavior unresolved.

### Decision 11 — No final visual token decisions in Phase 0B

**Context:** The prompt asks for design direction but says final colors and typography belong primarily to the Design System phase.

**Decision:** Define tone, hierarchy, density, accessibility, and interaction direction without fixing a final palette or typography system.

**Reason:** It preserves room for evidence-based visual design while giving UX enough guidance.

**Trade-offs:** The documentation cannot answer every visual styling question yet.

**Status:** Accepted.

## 9. Unresolved UX decisions

The following decisions must remain visible and be resolved before the affected experiences are finalized:

- Exact user-visible task state vocabulary: Inbox, Planned, Scheduled, In Progress, Completed, Overdue, Cancelled, and Archived do not all necessarily represent independent domain states.
- The canonical rule for entering/leaving Inbox and whether triage metadata is explicit or derived.
- Parent/subtask completion behavior and bulk task actions.
- Project progress formula, treatment of unestimated work, and how partial completion is communicated.
- Whether Dayly supports one or multiple scheduled blocks per task in the first implementation.
- Calendar drag/move behavior, conflict resolution, and default Day/Week/Month availability.
- The visual and behavioral treatment of recurring event exceptions.
- Habit pause, skip, missed, backfill, recurrence-change, timezone, and streak rules.
- Focus behavior when the app is backgrounded, the device clock changes, or saving fails.
- Notification defaults, quiet hours, daily briefing/weekly review behavior, and mobile delivery channels.
- Authentication, profile/account scope, and whether any workspace identity exists.
- Offline persistence and reconciliation behavior across task, calendar, habit, and focus actions.
- External calendar sync direction, provider permissions, imported-event retention, and conflicts.
- NutriTrack metrics, freshness, consent language, placement, and retention.
- Search indexing scope, recent-search retention, notes/future-content treatment, and permission filtering.
- Accessibility validation targets, localization/long-text behavior, and final design tokens.

## 10. Phase 0B boundary

This document and the other UX documents define navigation, information hierarchy, interactions, states, responsive behavior, conceptual components, and flows. They do not authorize:

- a Next.js or other application scaffold;
- production UI code;
- a database schema or data migration;
- authentication implementation;
- provider integrations or sync code;
- application dependencies;
- PHASE 0C Data Model work.
