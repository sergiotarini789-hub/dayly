# Dayly Visual Direction

**Phase:** 1A — Visual Direction & Design Language
**Status:** Completed and reviewed
**Source:** Approved product, UX, domain, integration, and technical documentation

> This document defines Dayly's visual personality and design language. It does not implement CSS, tokens, components, application screens, or production UI. Exact token values, font, brand color, and icon library remain open where stated.

## 1. Visual product positioning

Dayly should feel like a calm, intelligent instrument for making decisions about the day. It is information-rich, but it should never feel like an operations console or a grid of disconnected dashboard cards.

The visual language supports this loop:

```text
Understand the day
        ↓
Decide what matters
        ↓
Allocate time
        ↓
Execute
        ↓
Review
```

### 1.1 Personality

Dayly is:

- modern without chasing novelty;
- focused without being severe;
- calm without being passive;
- intelligent through hierarchy and useful context, not through decorative AI effects;
- premium through restraint, craft, and consistency;
- information-rich with deliberate disclosure;
- fast and purposeful for everyday actions;
- approachable to a new user and precise enough for a demanding day.

### 1.2 What the product should avoid

- generic SaaS blue-and-gray sameness;
- excessive gradients, glassmorphism, or translucent layers;
- oversized decorative hero areas that push daily work below the fold;
- dashboard clutter and equal-weight cards;
- excessive borders around every region;
- childish gamification, streak celebration overload, or competitive scores;
- motion that delays or distracts from a task;
- status meaning that depends on color alone;
- visual treatment that makes imported data look Dayly-owned;
- treating a Calendar Event, Scheduled Task, Focus Session, and Habit as the same item.

### 1.3 Visual thesis

**Quiet structure, visible intent.**

Dayly should establish hierarchy with surfaces, spacing, typography, and selective accents before using ornament. A person should be able to scan Today and answer “What do I need to know and do right now?” within seconds.

## 2. Design reference analysis

The following references are used as pattern references, not visual templates. Dayly must not copy their identity, tokens, layouts, or branded details.

| Reference | Useful principle to learn | Dayly adaptation |
|---|---|---|
| **Linear** | Strong hierarchy, dense but legible lists, restrained surfaces, keyboard-friendly speed | Use compact task/project scanning and clear state emphasis without adopting Linear's branding or issue model. |
| **Notion** | Flexible information organization and progressive disclosure | Keep Dayly's domain model more opinionated; expose detail progressively without making the user construct the whole system. |
| **Things** | Calm personal-product tone and clear separation of areas | Use a warm, approachable personal workflow while preserving Dayly's schedule/focus/analytics distinctions. |
| **Todoist** | Fast task capture, clear task rows, approachable completion interaction | Make Quick Add title-first and low friction, but connect work to planning without becoming a task-only product. |
| **Sunsama** | Daily planning as a deliberate ritual and time-aware overview | Use Today as an actionable daily decision surface without requiring a lengthy planning ceremony. |
| **Akiflow** | Unified task/calendar context and time allocation | Show tasks and time together while preserving Task versus Calendar Event ownership. |
| **Motion** | Attention to scheduling capacity and automatic planning concepts | Make available time and conflicts legible, but avoid autonomous scheduling in the MVP. |
| **Apple Calendar** | Strong temporal orientation, calm time-axis treatment, familiar event scanning | Use a readable timeline and local time context without treating events as tasks. |
| **Google Calendar** | Familiar calendar density, event color/label conventions, broad time navigation | Borrow temporal clarity while using Dayly's source labels and non-color-only event distinctions. |

### 2.1 Extracted principles

1. The primary surface should answer a user question, not showcase every capability.
2. Dense lists need strong type hierarchy and predictable row actions.
3. Keyboard speed and touch clarity are complementary, not competing, goals.
4. A calm background gives important state changes room to register.
5. A visual distinction is strongest when it combines label, shape, placement, and restrained color.
6. Personal productivity software should feel supportive rather than judgmental.
7. Time-based information needs a stable axis, clear now-state, and enough whitespace to parse overlaps.
8. Advanced configuration should appear when needed, not on every first view.

## 3. Color philosophy

Dayly uses a semantic color system rather than a feature-owned palette. Color supports hierarchy, state, and orientation; it does not carry the full meaning of an item.

### 3.1 Color roles

| Role | Visual intent | Use |
|---|---|---|
| **Brand primary** | A restrained, calm blue-to-indigo or blue-violet direction is the current candidate. | Primary actions, selected navigation, active focus on the most important control. |
| **Brand subtle** | A low-contrast tint derived from the brand. | Selected surfaces, contextual emphasis, non-destructive highlights. |
| **Neutral canvas** | Quiet, slightly warm or cool background. | App background and reading field. |
| **Neutral surface** | Clear surface separation without a heavy card grid. | Main content regions, task rows, forms. |
| **Elevated surface** | A stronger surface step with restrained shadow/border. | Menus, popovers, dialogs, focused panels. |
| **Text primary** | Highest legible contrast. | Titles, key values, primary actions. |
| **Text secondary** | Reduced but comfortable contrast. | Supporting context, dates, project labels. |
| **Text muted** | Reserved for metadata and placeholders that remain accessible. | Timestamps, helper text, non-primary metadata. |
| **Border/divider** | Low-contrast structure. | Section separation, input boundaries, focus-adjacent context. |
| **Success** | Calm green family, not neon. | Completed/saved/healthy states. |
| **Warning** | Controlled amber/gold family. | Capacity pressure, stale context, attention needed. |
| **Danger** | Restrained red/coral family. | Destructive actions, invalid states, serious sync failure. |
| **Info** | Clear blue/cyan family distinct from brand where necessary. | Explanations, neutral system information, sync details. |

Exact hues and contrast values remain Design Tokens decisions for PHASE 1B and validation.

### 3.2 Productivity-state color treatment

Productivity types use semantic roles plus non-color cues:

| Concept | Color direction | Supporting visual cue |
|---|---|---|
| **Task** | Neutral text/surface with brand emphasis only when selected or actionable | Task icon/row structure and explicit label in contextual views. |
| **Scheduled Task Block** | Brand-subtle/task tint | Task marker, block shape, and “Scheduled Task” source label. |
| **Dayly Calendar Event** | Separate event tint within the neutral/brand family | Calendar/event icon and solid event treatment. |
| **External Calendar Event** | Muted provider-neutral tint | External source badge and distinct edge/pattern treatment. |
| **Habit** | Soft consistency accent, preferably calm green/teal direction | Occurrence control, recurrence label, streak/consistency text. |
| **Focus Session** | Focus accent or deep neutral depending on context | Clock/session icon, timer framing, and “Focus” label. |
| **Overdue** | Warning/danger emphasis proportional to action needed | Text “Overdue,” deadline treatment, and not color alone. |
| **Completed** | Success tint used sparingly | Completion control, strikethrough/settled typography, and state text where needed. |

No feature may create a new unrelated color for its own status. All colors map back to semantic tokens.

## 4. Light and dark mode philosophy

Dark mode is a designed environment for long productivity sessions, not an inverted light theme.

### Light mode

- Use a quiet canvas and clear surface steps.
- Keep borders subtle; use spacing before card outlines.
- Use dark text with comfortable contrast and avoid pure black when a softer ink improves reading.
- Reserve elevation for overlays and active context.
- Keep semantic accents muted enough for sustained use.

### Dark mode

- Use a layered charcoal/ink surface family rather than pure black as the default canvas.
- Increase surface separation through small luminance steps and restrained borders, not bright outlines.
- Lighten primary text sufficiently for reading; keep muted text legible without becoming luminous.
- Reduce saturation of semantic colors so success/warning/danger do not glow or dominate.
- Use shadows sparingly; dark surfaces should not rely on invisible shadows for hierarchy.
- Preserve the same semantic meaning and source distinctions as light mode.

### Theme invariants

- A selected state must remain visible in both themes.
- Focus rings must remain high contrast in both themes.
- Disabled is reduced emphasis, not unreadable text.
- Overdue is attention, not a full-screen red state.
- External data remains visibly external in both themes.
- User-created custom colors, if supported later, must pass contrast and semantic constraints.

## 5. Typography direction

### 5.1 Font strategy

Use one highly legible neutral sans family as the primary interface family. The desired direction is a modern humanist/neo-grotesk system with:

- strong numeral clarity for dates, durations, and analytics;
- compact but readable lowercase forms;
- reliable rendering across mobile and desktop;
- broad language coverage and accessible fallback behavior;
- enough weight variation for hierarchy without relying on oversized text.

A separate display face is not required. The final font family is unresolved and should be selected in PHASE 1B after licensing, rendering, performance, and localization review.

### 5.2 Hierarchy

| Level | Purpose | Direction |
|---|---|---|
| Display/context | Date or occasional Today context | Restrained; should orient without consuming the task area. |
| Page heading | Destination title | Clear and compact; one dominant heading. |
| Section heading | Today/Tasks/Analytics region | Strong enough to scan, not oversized. |
| Item title | Task, project, habit, or event name | Highest local emphasis and resilient to long text. |
| Body | Descriptions and explanatory content | Comfortable reading measure and line height. |
| Label | Buttons, tabs, source/state labels | Medium emphasis with clear case/spacing. |
| Metadata | Dates, estimates, tags, secondary facts | Muted but accessible; never the only state cue. |
| Numeric/statistical | Durations, counts, progress values | Tabular/clear numerals where useful; always include context and unit. |

Avoid giant hero headings, all-caps task titles, tight tracking, and tiny metadata that forces zoom.

## 6. Spacing and composition direction

Use a small, consistent 4-unit conceptual rhythm. The proposed starting scale is:

```text
space-1  = 4
space-2  = 8
space-3  = 12
space-4  = 16
space-5  = 20
space-6  = 24
space-8  = 32
space-10 = 40
space-12 = 48
space-16 = 64
```

These are design-direction starting values, not final CSS constants.

### Composition rules

- **Page padding:** generous enough to create a reading field; reduce on mobile while preserving touch and text margins.
- **Card/panel padding:** default to a compact interior with more space around primary content than metadata.
- **Component gaps:** use the smallest gap that keeps actions and labels distinguishable.
- **Section spacing:** make a new decision area feel separate without drawing a border around every section.
- **List density:** prefer row rhythm and hierarchy over tall cards.
- **Mobile spacing:** increase interaction separation even when content becomes more compact.
- **Desktop spacing:** allow a readable central measure; do not stretch every panel to the viewport edge.

## 7. Shape language

Dayly uses quiet, moderate rounding rather than universal pills.

| Element | Shape direction |
|---|---|
| Cards/panels | Moderate radius with stable corners; enough softness for calm surfaces. |
| Buttons | Moderate radius; primary actions are not pill-shaped by default. |
| Inputs | Moderate radius with clear focus boundary. |
| Modals/sheets | Larger radius where it communicates a separate layer; mobile sheets may emphasize top corners. |
| Badges/tags | Compact rounded shape; pills are appropriate for metadata labels, not every control. |
| Status indicators | Small rounded marker paired with text/icon. |
| Calendar blocks | Functional rectangular geometry; do not make time blocks look like chips. |

Exact radius values remain token validation work.

## 8. Borders, shadows, and surfaces

Use this hierarchy before adding decoration:

```text
surface
   ↓
contrast
   ↓
spacing
   ↓
typography
   ↓
restrained border/shadow
```

- Borders identify inputs, selected boundaries, and meaningful separation; they do not outline every card.
- Dividers are used for long lists or temporal sections, not decorative segmentation.
- Shadows are reserved for elevated surfaces, popovers, dialogs, and a small number of active layers.
- Hover/selected surfaces use a subtle semantic background shift plus text/icon/focus change.
- A selected item must remain clear without a shadow alone.
- Dark mode uses surface luminance and thin borders more than deep shadows.
- Elevation has a small number of levels; no feature invents a custom shadow.

## 9. Iconography

Use one coherent outline icon family with:

- consistent stroke weight and corner treatment;
- a default 20px working size for controls;
- 16px for dense metadata and 24px for primary mobile/empty-state actions;
- filled/solid variants only when they communicate an active or destructive state;
- icon plus text for unfamiliar or consequential actions;
- icon-only controls only when the icon is conventional and has an accessible label.

The final icon library is unresolved. Mixing icon families, emoji, provider logos, and custom illustrations in the same control group is not allowed without a deliberate visual decision.

## 10. Information density

Dayly's default density is **focused default**: compact enough to show useful context, spacious enough to identify the next action. It is not a dense admin table and not a large-card dashboard.

### Density modes

- **Compact:** More rows and metadata; used for desktop Tasks, Calendar timelines, and detailed Analytics where scanning is the goal.
- **Focused default:** The standard mode for Today, Projects, and everyday lists.
- **Comfortable:** More spacing and larger controls; used for mobile forms, first use, active Focus, and accessibility/large-text contexts.

### Module guidance

| Module | Default density | Reason |
|---|---|---|
| Today | Focused default | Must answer daily questions quickly while preserving a visible next action. |
| Tasks | Compact on desktop, comfortable touch rows on mobile | Capture and scan many tasks without shrinking interaction targets. |
| Calendar | Compact timeline on desktop, comfortable vertical agenda on mobile | Time relationships need density but not tiny labels. |
| Analytics | Focused default with spacious metric grouping | Reflection needs comprehension more than maximum data count. |
| Habits | Focused default | Completion should feel easy and consistency should remain calm. |
| Focus | Comfortable/minimal | Execution should reduce distractions and make time legible. |

Density changes spacing and information disclosure, not semantic meaning or accessibility.

## 11. Task visual language

A Task should communicate the next useful fact first. The full detail screen may expose all supported properties, while rows and Today progressively disclose.

### Task row hierarchy

1. Completion control and title.
2. Priority only when meaningful.
3. Deadline/overdue or scheduled time when relevant to the current view.
4. Project label and one or two useful tags.
5. Estimate/actual summary only when it helps the current decision.
6. Additional properties in detail/overflow.

### Task states

- **Open:** normal readable title and actionable completion control.
- **In Progress:** subtle active marker and optional focus association; not a loud warning color.
- **Completed:** settled typography and success cue; retain enough readability for history.
- **Archived:** shown only in relevant history/archive contexts with reduced emphasis.
- **Overdue:** explicit label and deadline emphasis; never color alone.
- **Scheduled:** scheduled time/block shown as planning context, not as a Calendar Event.
- **Inbox:** triage context shown through view/metadata, not a separate item type.

A task row should not display description, recurrence, reminders, every tag, and every duration value simultaneously. Detail and progressive disclosure carry the rest.

## 12. Calendar visual language

Calendar uses a common temporal grid/agenda but distinct source treatments:

| Object | Visual treatment | Required non-color cue |
|---|---|---|
| **Task Schedule Block** | Task/brand-subtle fill or accent edge with functional rectangular shape | Task icon/label and link to Task Detail. |
| **Dayly Calendar Event** | Solid event surface with clear start/end geometry | Event icon/source label and event detail action. |
| **External Calendar Event** | Muted provider-neutral surface with a distinct edge/pattern | External source badge and source/sync status. |
| **Focus Session** | Thin outline/clock marker or session overlay, not an event block | Focus label/icon and actual-duration context. |

Additional rules:

- Current time uses a clear line/marker and accessible text context.
- Selected items use surface/outline/focus changes in addition to color.
- Overlaps show stacking/columns or a readable conflict treatment; do not invent new colors for each overlap.
- All-day events occupy a distinct date band/agenda region.
- External and Dayly-owned events remain distinguishable in light/dark themes.
- Conflict and stale states use labels/icons plus semantic emphasis.
- Exact interaction/drag behavior belongs to the UX implementation phase, not this visual specification.

## 13. Habit visual language

- **Due:** clear completion control with recurrence context.
- **Completed:** calm success confirmation and completed occurrence state.
- **Streak:** concise number/text with a definition or period available; no trophy wall.
- **Consistency:** small, legible period view or summary with completed/expected context.
- **Missed:** explicit but non-punitive neutral/warning treatment; not a failure spectacle.
- **Paused:** muted/paused label distinct from missed.
- **Upcoming:** quiet future cue, not a notification-like alert.

Habits should feel supportive and repeatable. Streaks are evidence for reflection, not the primary visual reward loop.

## 14. Focus visual language

Focus is an execution surface, not a dashboard.

- Active Focus uses one dominant timer and one clear context: Task, Project, or unlinked session.
- Paused state changes the timer treatment and action label without losing elapsed context.
- Completed state emphasizes actual duration and a clear next choice: review, return, or explicitly complete the Task.
- Interrupted state preserves actual-duration truth and offers a lightweight note/context path.
- The associated Task title is visible but secondary to the timer.
- Decorative charts, dense analytics, and unrelated notifications are suppressed during active work.
- High contrast and reduced motion are required; motion must not be necessary to perceive elapsed time.

## 15. Today visual hierarchy

Today should answer “What do I need to know and do right now?” in a few seconds. The recommended hierarchy is conditional rather than a fixed card stack:

1. **Orientation:** date, local time, short greeting/context, and the current time-zone context.
2. **Now/Next:** active Focus if running; otherwise the next Calendar Event or Scheduled Task Block, plus available-time context when known.
3. **Critical actions:** overdue/due-soon work and the small set of priority tasks that need a decision now.
4. **Today's plan:** a readable timeline/agenda with Dayly Events and Scheduled Task Blocks distinguished.
5. **Priority task queue:** the next actionable work, with completion and schedule actions close by.
6. **Habits due:** visible when a habit needs action; quiet when none are due.
7. **Review context:** completed work, actual Focus time, project attention, and day progress when the data supports a decision.
8. **Optional context:** NutriTrack summary, upcoming items, and integration health only when connected/relevant.

The hierarchy adapts: active Focus moves to the top; a busy event-heavy day emphasizes timeline; an empty day emphasizes one Quick Add action. Secondary information should collapse or defer before it pushes the next action out of reach.

## 16. Responsive personality

### Mobile — approximately 320–767px

- Focused, thumb-friendly, and intentionally vertical.
- Today, Tasks, Calendar, and Focus remain the fastest destinations through bottom navigation.
- Use compact headers, bottom sheets, full-screen forms, and one primary action at a time.
- Keep touch targets comfortable even when list density increases.
- Collapse secondary Today context before reducing task/title legibility.
- Use a readable vertical agenda rather than squeezing a desktop calendar grid.

### Tablet — approximately 768–1023px

- Use a hybrid rail/sidebar and adaptive list/detail composition.
- Let Today and Calendar gain context when width permits, but switch to focused panes before text becomes cramped.
- Use drawers/sheets for secondary controls when portrait width is constrained.

### Desktop — 1024px and above

- Use a calm persistent sidebar with higher information density and keyboard-friendly row actions.
- Allow list/detail and timeline compositions where both areas remain readable.
- Use whitespace and central reading measures so a wide viewport does not become a wall of cards.
- Keep Quick Add, Search, command palette, and profile/settings utilities visually secondary to the current decision.

Responsive composition changes hierarchy and interaction density; it does not change source ownership or state meaning.

## 17. Accessibility visual contract

Visual decisions target WCAG 2.2 AA and must support:

- sufficient text, control, border, and focus contrast in light and dark themes;
- focus rings that remain visible at zoom and large text;
- status indicators that combine color with text, icon, pattern, or structure;
- touch-friendly controls and comfortable spacing without hiding information;
- readable metadata and numeric values at mobile widths;
- text alternatives for charts, Calendar geometry, and productivity-state visuals;
- reduced-motion behavior without loss of state meaning.

The visual system must remain understandable without color, hover, animation, or pointer input.

## 18. Phase boundary

This visual direction does not implement:

- CSS or Tailwind tokens;
- application screens;
- React components;
- color/font/icon libraries;
- task/calendar/habit/focus functionality;
- production UI or dependencies.
