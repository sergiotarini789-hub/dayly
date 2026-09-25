# Dayly Motion Principles

**Phase:** 1E — Interaction & Motion System
**Status:** In progress
**Related documents:** [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md), [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md), [`VISUAL_STATES.md`](VISUAL_STATES.md), [`INTERACTION_SYSTEM.md`](INTERACTION_SYSTEM.md), [`ACCESSIBILITY.md`](../architecture/ACCESSIBILITY.md)

> This document defines the approved motion language. The implementation contract and reusable patterns are in [`INTERACTION_SYSTEM.md`](INTERACTION_SYSTEM.md).

## 1. Purpose and boundaries

Motion communicates hierarchy, continuity, spatial relationships, state change, feedback, and system status. It must not make a routine productivity action wait, hide an error, imply persistence before confirmation, or make information dependent on movement.

Dayly motion is quiet, direct, reversible where possible, and stable across light/dark themes, responsive layouts, touch, keyboard, and assistive technology. Prefer CSS transitions and keyframes using `transform` and `opacity`. Do not add an animation framework, JavaScript animation loop, parallax, routine bounce, hover-only action, or complex gesture system.

## 2. Motion categories

Every motion treatment should have one primary category and a plain-state equivalent:

| Category | Purpose | Examples | Default treatment |
|---|---|---|---|
| **Micro** | Confirm a direct pointer or keyboard interaction. | Hover, press, focus-adjacent surface, checkbox mark. | Immediate color/border/opacity or very small transform. |
| **State** | Make a control's persistent state change legible. | Selected tab, checked switch, input error/success, disabled control. | Fast token transition; never relies on movement alone. |
| **Structural** | Preserve continuity when a region appears, disappears, or changes arrangement. | Disclosure, list insertion/removal, master/detail region. | Small opacity/translation, bounded to the affected region. |
| **Feedback** | Communicate system status or a completed/failed action. | Spinner, skeleton, toast, inline success/error, retry state. | Static text/semantics always remain; continuous motion is optional. |
| **Spatial** | Explain where a layer or context came from or is going. | Dialog, popover, drawer, sheet, overlay. | Short enter/exit with a small token distance and a related origin. |

Do not combine categories to make a routine action theatrical. Structural and spatial motion must never block Escape, focus restoration, keyboard navigation, touch dismissal, or the next valid action.

## 3. Approved timing categories

Only the existing duration tokens in [`src/styles/tokens.css`](../../src/styles/tokens.css) may be used:

| Token | Current value | Approved use |
|---|---:|---|
| `--duration-instant` | `80ms` | Immediate pressed/focus-adjacent feedback and state acknowledgment. |
| `--duration-fast` | `160ms` | Hover, selected/checked state, small disclosure, menu/popover. |
| `--duration-normal` | `240ms` | Dialog/drawer, toast, ordinary local enter/exit, detail continuity. |
| `--duration-slow` | `360ms` | Deliberate spatial emphasis only when it improves orientation; not routine controls. |

These are categories, not permission to invent a fifth duration. Do not add arbitrary values, long routine transitions, or per-component timing overrides. Reduced-motion tokens collapse timing to an immediate result and the CSS reduced-motion rules remove decorative movement.

## 4. Existing easing tokens

Use only the approved easing tokens:

- `--ease-standard` for ordinary state and micro feedback;
- `--ease-emphasized` only for a meaningful spatial relationship;
- `--ease-entrance` for entering content;
- `--ease-exit` for leaving content.

Routine controls should not bounce, overshoot, spring, rotate, or use a custom cubic-bezier. Existing motion distances are `--motion-distance-small` and `--motion-distance-panel`; use them rather than inventing distances.

## 5. Interaction rules

### Controls

- Hover supplements, but never replaces, focus, labels, or an action.
- Pressed feedback is immediate and confirms input, not persistence.
- `:focus-visible` is high-contrast and immediate; it is never faded out or hidden during a transition.
- Disabled controls remain readable, are not focus targets, and are distinct from loading.
- Loading controls preserve their measured layout and accessible name; the spinner is supplemental.
- Inputs keep readable values and messages while focus, error, success, or disabled feedback changes.

### Layers

Dialogs, drawers, sheets, popovers, menus, and scrims use token-based entrance and exit behavior. Escape is handled immediately at the document/container level. Focus moves into a modal scope and returns to the opening trigger when it closes, without waiting for an animation to complete.

### Lists and detail

Use list motion only for the affected item or bounded region. Insertion and removal may use a small opacity/translation treatment; reorder should preserve orientation and not animate a long list. Selection remains visible without motion. Generic master/detail transitions use a short detail entrance on desktop and a stacked region on narrow screens.

## 6. Responsive structural changes

Responsive breakpoints can change navigation, columns, stacking, safe-area padding, and scroll ownership. Those structural changes should remain **instant**: they are an environmental layout response, not a user action that benefits from a delayed transition. Do not animate grid-template changes, viewport-wide reflow, breakpoint navigation replacement, or shell geometry. A bounded content region that is explicitly opened by the user may use structural motion after it is mounted.

## 7. Loading and feedback

- Spinners indicate short indeterminate work and have an accessible label/status.
- Skeletons preserve the expected layout and remain static under reduced motion.
- Progress communicates bounded work; it is not a substitute for error or empty state.
- Inline success/error states stay near the source action and include text.
- Toasts are non-blocking confirmations with an accessible live region and a visible dismissal/action path.
- Retry is explicit and adjacent to the affected scope.
- No success, error, or selection meaning depends on an animation completing.

## 8. Reduced motion is mandatory

With `prefers-reduced-motion: reduce`:

- remove decorative translation, scaling, continuous spinner/progress/skeleton movement, shimmer, parallax, and spatial animation;
- replace entrance/exit with immediate presence and semantic state updates;
- keep useful opacity, border, and text changes when they improve clarity;
- do not auto-scroll, reorder, or move focus through animation;
- preserve Escape, keyboard navigation, touch interaction, focus restoration, live announcements, and loading/error/success meaning.

The token layer provides reduced-motion values and component/layout styles explicitly disable continuous and decorative animation. JavaScript presence handling also completes exit immediately when the preference is active.

## 9. Performance and validation

Prefer compositor-friendly `transform` and `opacity`. Avoid JavaScript animation loops, layout-thrashing measurements, large-list animation, full-page background motion, and high-frequency timer animation. Validate with mouse, keyboard-only, touch-sized controls, light theme, dark theme, narrow/desktop layouts, and reduced motion. Test focus restoration and immediate Escape independently of visual timing.

## 10. Phase boundary

PHASE 1E establishes the domain-agnostic interaction/motion primitives, token-based CSS behavior, reduced-motion contract, showcase coverage, and tests. PHASE 1F composes those foundations into product-facing onboarding and Today surfaces without adding domain persistence, APIs, integrations, or fake server behavior.
