# Dayly Design Token Architecture

**Phase:** 1A — Visual Direction & Design Language
**Status:** In progress
**Related documents:** [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md), [`VISUAL_STATES.md`](VISUAL_STATES.md), [`MOTION_PRINCIPLES.md`](MOTION_PRINCIPLES.md), [`UX_PRINCIPLES.md`](UX_PRINCIPLES.md)

> This document defines the conceptual token system. It does not create CSS variables, Tailwind configuration, component code, or final values.

## 1. Token architecture

Dayly should use three token layers:

```text
Primitive tokens
        ↓
Semantic tokens
        ↓
Component tokens
```

### 1.1 Primitive tokens

Primitive tokens describe raw palette, type, spacing, radius, shadow, motion, and breakpoint values. They are not used directly throughout feature UI.

Examples:

```text
color.neutral.0
color.neutral.50
color.blue.500
space.1
radius.md
shadow.overlay
motion.duration.standard
```

Primitive names describe the value family, not its meaning in a Task or Calendar. Exact colors and scale values remain subject to contrast and visual validation.

### 1.2 Semantic tokens

Semantic tokens express meaning and theme behavior:

```text
color.background.canvas
color.surface.default
color.surface.elevated
color.content.primary
color.content.secondary
color.content.muted
color.border.default
color.border.focus
color.action.primary
color.action.primary.hover
color.state.success
color.state.warning
color.state.danger
color.state.info
color.productivity.task
color.productivity.schedule
color.productivity.event
color.productivity.external
color.productivity.habit
color.productivity.focus
color.productivity.overdue
color.productivity.completed
```

Semantic tokens are the main contract consumed by components. Themes map primitives to semantic roles without changing markup or product meaning.

### 1.3 Component tokens

Component tokens describe local relationships and should be introduced only when semantic tokens cannot express the component's behavior:

```text
component.button.primary.background
component.button.primary.content
component.button.primary.focus-ring
component.task-row.padding
component.task-row.selected.background
component.calendar-block.schedule.border
component.calendar-block.external.pattern
component.focus-timer.active.content
component.dialog.surface
component.input.error.border
```

Component tokens must not become a hidden feature palette. A component token should refer back to semantic roles and remain reusable across contexts.

## 2. Color token groups

### 2.1 Primitive palette direction

The primitive palette should include:

- neutral canvas/surface/content scales;
- a restrained brand blue-indigo or blue-violet family;
- calm success green/teal family;
- controlled warning amber family;
- restrained danger red/coral family;
- informative blue/cyan family;
- optional provider-neutral external accent that remains subordinate.

The exact brand hue, palette steps, and light/dark values are open. No feature may select an arbitrary hex value outside the token system.

### 2.2 Light-theme semantic mapping

Light mode should map:

- canvas to a quiet high-lightness neutral;
- default surfaces to a clearly readable but near-canvas neutral;
- elevated surfaces to a stronger contrast step with restrained shadow;
- primary content to a high-contrast ink;
- secondary/muted content to accessible reduced contrast;
- borders to subtle neutral lines;
- semantic accents to muted, readable fills and stronger text/icon variants;
- selected states to a light semantic tint plus border/focus cue.

### 2.3 Dark-theme semantic mapping

Dark mode should map independently rather than invert:

- canvas to a deep charcoal/ink primitive;
- default/elevated surfaces to progressively lighter dark neutrals;
- primary content to comfortable off-white/near-white text;
- secondary/muted content to accessible dimmer text;
- borders to restrained luminance edges;
- semantic accents to lower-saturation tones with readable foreground variants;
- selected states to a controlled surface lift plus border/focus cue;
- shadows to minimal/limited use.

### 2.4 Productivity token rules

Productivity tokens are semantic, not feature-specific colors:

| Semantic token family | Meaning | Additional cue |
|---|---|---|
| `productivity.task` | Actionable work | Task icon/row structure. |
| `productivity.schedule` | Planned Task Block | Schedule/task label and block geometry. |
| `productivity.event` | Dayly Calendar Event | Event icon and solid time block. |
| `productivity.external` | Provider-owned context | External badge and source/provenance. |
| `productivity.habit` | Recurring behavior | Occurrence control and recurrence text. |
| `productivity.focus` | Actual effort session | Clock/session treatment. |
| `productivity.overdue` | Past incomplete deadline | “Overdue” text and deadline treatment. |
| `productivity.completed` | Explicitly completed work | Completion control and settled typography. |

## 3. Typography tokens

Conceptual groups:

```text
type.family.interface
type.family.mono-or-tabular
type.size.display
type.size.page
type.size.section
type.size.item
type.size.body
type.size.label
type.size.meta
type.weight.regular
type.weight.medium
type.weight.semibold
type.line-height.tight
type.line-height.body
type.line-height.relaxed
type.letter-spacing.normal
type.letter-spacing.label
```

Rules:

- Use an interface sans family with accessible fallback stack.
- Use tabular/clear numerals for durations and statistics when comparison benefits.
- Keep page/display sizes restrained to preserve vertical space.
- Use weight and spacing before all-caps or extreme size changes.
- Metadata remains readable under zoom and localization.
- Final family, weight availability, and exact scale are open for PHASE 1B.

## 4. Spacing tokens

The proposed conceptual rhythm uses a 4-unit base:

```text
space.1  = 4
space.2  = 8
space.3  = 12
space.4  = 16
space.5  = 20
space.6  = 24
space.8  = 32
space.10 = 40
space.12 = 48
space.16 = 64
```

Semantic usage examples:

```text
layout.page-padding
layout.section-gap
layout.card-padding
layout.list-row-gap
layout.form-field-gap
layout.mobile-action-inset
layout.sidebar-width
```

A component should use a semantic/layout token where a relationship matters, not repeat arbitrary values. Exact values are proposed starting points, not locked implementation values.

## 5. Radius tokens

Conceptual values:

```text
radius.none
radius.xs
radius.sm
radius.md
radius.lg
radius.xl
radius.full
```

Rules:

- `radius.md` is the likely default for buttons, inputs, and moderate cards.
- `radius.lg`/`xl` is reserved for elevated panels, dialogs, and focused mobile surfaces.
- `radius.full` is primarily for badges/status markers, not every button.
- Calendar time blocks keep functional rectangular geometry.
- Exact radius values remain open.

## 6. Border and elevation tokens

```text
border.width.hairline
border.width.default
border.color.default
border.color.subtle
border.color.focus
border.color.error
shadow.none
shadow.raised
shadow.overlay
shadow.dialog
```

- Most page structure comes from surface and spacing.
- `shadow.raised` is for a selected/raised panel only where necessary.
- `shadow.overlay` and `shadow.dialog` distinguish temporary layers.
- Semantic focus/error borders must pass contrast requirements.
- There should be no per-feature shadow palette.

## 7. Motion tokens

Motion is defined further in [`MOTION_PRINCIPLES.md`](MOTION_PRINCIPLES.md). Conceptual token groups are:

```text
motion.duration.instant
motion.duration.fast
motion.duration.standard
motion.duration.emphasis
motion.easing.standard
motion.easing.enter
motion.easing.exit
motion.easing.spring
motion.distance.small
motion.distance.panel
```

Reduced-motion behavior maps non-essential motion to no motion or a quick opacity/state change.

## 8. Responsive tokens

Responsive tokens express composition changes rather than merely scaling:

```text
breakpoint.mobile
breakpoint.tablet
breakpoint.desktop
layout.navigation.desktop-sidebar
layout.navigation.mobile-bottom-bar
layout.navigation.mobile-more-sheet
layout.calendar.mobile-agenda
layout.calendar.desktop-timeline
```

Use the approved planning bands:

- Mobile: approximately 320–767px.
- Tablet: approximately 768–1023px.
- Desktop: 1024px and above.

Exact framework breakpoint values are implementation decisions that must preserve these UX bands.

## 9. Focus and accessibility tokens

```text
focus.ring.color
focus.ring.width
focus.ring.offset
focus.ring.inset
state.disabled.opacity
state.loading.opacity
state.selected.background
state.hover.background
state.pressed.background
state.error.border
state.success.background
```

Focus tokens must remain visible in both themes and not depend on hover. Disabled tokens reduce interaction affordance without making required explanatory text unreadable.

## 10. Token governance

- Primitive tokens may be changed during visual validation, but semantic meaning must remain stable.
- Semantic tokens are the contract between themes and components.
- Component tokens require a demonstrated local relationship; do not add a token for one-off styling.
- Product state meaning must not be encoded only in a color token.
- Final values require contrast, responsive, accessibility, and visual regression review.
- Tokens are documented before CSS implementation.
- Deprecated tokens need a migration note; do not silently repurpose a semantic token.
- Theme customizations, if later supported, must map through semantic tokens and preserve contrast/source distinctions.

## 11. Open token decisions

- Exact brand hue and brand scale.
- Exact light/dark neutral values.
- Final interface font and fallback stack.
- Exact type scale and weight availability.
- Exact spacing/radius/shadow values.
- Exact focus-ring width/color behavior.
- Chart-specific palette, chart language, and data visualization patterns.
- Final density presets and whether users can select Compact, Focused default, or Comfortable explicitly.
- Whether users can choose custom themes while preserving semantic meaning and contrast.
- Whether users can choose future custom accent colors within semantic constraints.
- Whether calendar colors are user-customizable within semantic constraints.
- Final token file/configuration format for Tailwind CSS v4.

## 12. Phase boundary

No CSS variables, Tailwind configuration, token files, component styles, or application code were created.
