# Dayly Motion Principles

**Phase:** 1A — Visual Direction & Design Language
**Status:** In progress
**Related documents:** [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md), [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md), [`VISUAL_STATES.md`](VISUAL_STATES.md), [`ACCESSIBILITY.md`](../architecture/ACCESSIBILITY.md)

> This document defines motion intent and timing categories. It does not implement animations, transitions, CSS, or components.

## 1. Motion purpose

Motion in Dayly communicates:

- where the user's context moved;
- whether an action was accepted, pending, completed, or interrupted;
- how a layer entered or left;
- how a time-based state changed;
- which content is related.

Motion does not exist to make a productivity workflow feel busy. It must never delay a common action, hide an error, imply saved state prematurely, or reward every completion with a spectacle.

## 2. Motion personality

Dayly motion should be:

- quiet and confident;
- short for frequent actions;
- direct rather than bouncy by default;
- spatially coherent;
- reversible where the action is reversible;
- restrained during Focus;
- optional for users who prefer reduced motion.

Use opacity, small translation, surface emphasis, and height changes before large scale, rotation, blur, or parallax effects.

## 3. Duration categories

These are starting categories for validation in PHASE 1B, not final CSS values:

| Category | Approximate range | Use |
|---|---:|---|
| **Instant** | 0–100ms | Pressed feedback, focus/state color, immediate affordance. |
| **Fast** | 100–180ms | Hover/selected surface, checkbox/completion acknowledgment, small disclosure. |
| **Standard** | 180–280ms | Popovers, row expansion, local content changes, ordinary enter/exit. |
| **Emphasis** | 280–450ms | Modal/sheet entrance, meaningful Today reordering, first-use guidance. |
| **Long** | Over 450ms | Avoid for routine work; only for a bounded, user-controlled onboarding or progress context. |

Duration should account for distance, content importance, device capability, and reduced-motion preference. A faster action is usually better than a more expressive one.

## 4. Easing direction

Conceptual easing tokens:

- **Standard:** balanced acceleration/deceleration for ordinary state changes.
- **Enter:** gentle acceleration into a new surface.
- **Exit:** quick departure so the next action is available promptly.
- **Emphasis:** restrained spring only for a meaningful spatial relationship, never for a routine checkbox.

Avoid elastic overshoot, bouncing badges, and easing that makes content feel detached from the user's action.

## 5. Interaction motion

### Hover and focus

Use a fast surface/border transition. Focus ring appearance must be immediate and visible; never animate it in a way that hides keyboard position.

### Pressed

Use a subtle immediate scale/surface/opacity response. It confirms input, not persistence.

### Completion

Task completion may use a brief check/settled-text transition and optional row movement. It must:

- remain understandable without animation;
- preserve an undo path;
- not move a long list unexpectedly before the result is confirmed;
- avoid celebratory confetti, sound, or oversized reward treatment by default.

Habit completion uses an equally restrained occurrence update. Streaks should not animate as a game reward.

### List changes

When an item is created, completed, archived, or filtered:

- use a small, predictable transition or immediate state update;
- preserve keyboard/screen-reader context;
- avoid large layout shifts;
- do not animate every row in a long list.

### Focus transitions

Entering Focus reduces unrelated motion. The timer changes state immediately on start/pause/resume. Elapsed time remains readable as a value, not dependent on a rotating animation.

## 6. Page and navigation transitions

- Route changes should preserve a stable shell and current destination.
- Use a short crossfade or spatially related transition only where it aids orientation.
- Do not animate every page as a theatrical scene.
- Back navigation should feel like returning to the prior context, not replaying an onboarding sequence.
- Preserve Today/calendar date context through transitions.

## 7. Modal, drawer, and bottom-sheet motion

- Modals/sheets enter from the interaction context with a clear scrim/surface separation.
- Enter and exit timing is short enough to keep forms responsive.
- Focus moves into a modal and returns to the trigger when it closes.
- Dismissal is available by visible control and keyboard/touch equivalent.
- On mobile, a bottom sheet may slide from the bottom; a complex form may use a full-screen transition.
- Destructive confirmation does not use alarming motion as a substitute for clear copy.

## 8. Loading and progress motion

- Skeleton shimmer is optional and must respect reduced motion; static placeholders are valid.
- Spinners are reserved for short indeterminate operations and include accessible status.
- Progress indicators communicate bounded work only when progress is meaningful.
- A syncing indicator does not imply successful synchronization.
- Never use infinite animation to cover an unknown/error state indefinitely.

## 9. Calendar and data visualization motion

- Calendar navigation may animate a small date-range shift when it improves orientation, but instant keyboard navigation remains supported.
- Drag/move previews are optional and must have a non-drag alternative.
- Chart reveal animation is not required to understand a metric.
- Data changes should not animate from false zero values; use a state transition that preserves the source/period.
- Current-time indicators may update without distracting movement.

## 10. Reduced motion

When `prefers-reduced-motion: reduce` is active:

- remove non-essential page/element translation, scaling, parallax, and spring effects;
- replace with immediate state changes or a short opacity/border change;
- keep Focus timer readable without visual animation;
- disable skeleton shimmer in favor of static placeholders;
- do not auto-scroll or reorder content through animated movement;
- preserve all state feedback through text, structure, and focus.

Users should not lose meaning or access to actions when motion is reduced.

## 11. Motion accessibility and performance

- Motion must not cause flashing or seizure risk.
- Keep animation work composited and bounded when implemented.
- Avoid animating large lists, full-page backgrounds, or high-frequency timer elements.
- Do not move focus with animation.
- Test at reduced motion, low-power mode, large text, keyboard-only, and screen-reader use.

## 12. Open motion decisions

- Exact duration/easing values.
- Whether route transitions are needed after usability testing.
- Whether a small completion motion is helpful or distracting.
- Calendar navigation/drag preview behavior.
- Chart animation policy and library constraints.
- Focus timer visual update strategy.
- Motion token format for Tailwind CSS v4.

## 13. Phase boundary

No animation library, CSS transition, motion component, or application code was created.
