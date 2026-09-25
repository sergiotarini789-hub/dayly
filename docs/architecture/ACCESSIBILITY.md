# Dayly Accessibility Contract

**Phase:** 0E — Technical Specification & Engineering Contract
**Status:** In progress
**Related documents:** [`UX_PRINCIPLES.md`](../ux/UX_PRINCIPLES.md), [`SCREEN_MAP.md`](../ux/SCREEN_MAP.md), [`COMPONENT_INVENTORY.md`](../ux/COMPONENT_INVENTORY.md), [`TECHNICAL_SPEC.md`](TECHNICAL_SPEC.md)

> This document defines implementation accessibility requirements. It does not create UI or components.

## 1. Target

Dayly targets **WCAG 2.2 AA** for user-facing web experiences, subject to validation with assistive technologies and realistic browsers/devices. Accessibility is part of acceptance, not a final visual polish task.

## 2. Semantic structure

- Use native semantic HTML for headings, landmarks, lists, buttons, links, forms, tables, and disclosures.
- Maintain one clear page/destination heading and meaningful heading hierarchy.
- Use buttons for actions and links for navigation; do not use clickable generic containers.
- Provide meaningful page titles and route context.
- Keep source type/ownership meaning available as text, not only icon/color.
- Preserve logical DOM order when visual layout changes responsively.

## 3. Keyboard and focus

- Every action is operable by keyboard without requiring a pointer, drag, hover, or swipe.
- Provide visible, high-contrast focus indicators that are not removed by CSS resets.
- Use logical tab order and avoid focus traps except within active modal/dialog patterns.
- Return focus to a sensible trigger after dialogs/sheets close.
- Do not steal focus on background updates.
- Provide keyboard alternatives for Calendar move/reschedule and row overflow actions.
- Command palette and shortcuts always have visible navigation alternatives.
- Avoid keyboard traps in timers, date pickers, comboboxes, drawers, and forms.

## 4. Screen readers and announcements

- Every form control has an accessible name and relationship to its help/error text.
- State changes such as task completion, save success, retry failure, timer pause, and sync status are announced appropriately without excessive noise.
- Loading states expose meaningful busy/status semantics.
- Dynamic Today sections do not reorder focus unexpectedly.
- Charts and progress values have text summaries/data alternatives.
- Icon-only actions have accessible labels and tooltips are not the only label.
- Decorative icons are hidden from assistive technology.

## 5. Color, contrast, and visual meaning

- Meet WCAG AA contrast requirements for normal text, large text, controls, and focus indicators.
- Do not communicate priority, overdue, source, conflict, completion, or provider ownership through color alone.
- Use text, icons/patterns, labels, or structure alongside color.
- Avoid using red as a moral judgment for ordinary overdue work.
- Support high contrast/forced-color behavior where platform settings require it.

## 6. Motion and timing

- Respect `prefers-reduced-motion`.
- Timers remain understandable without animation.
- Do not require a transient animation to notice completion or conflict.
- Avoid auto-advancing/expiring content without pause/control.
- Give users enough time to read notifications and undo actions.

## 7. Forms and validation

- Labels remain visible or programmatically associated; placeholders are not labels.
- Required/optional fields are explicit.
- Errors identify the field and explain how to fix it.
- Validation does not erase user input.
- Summary errors are provided for long forms, with focus moved only when appropriate.
- Date/time/timezone inputs expose precision and interpretation.
- Recurrence, external ownership, and destructive effects are explained before confirmation.

## 8. Dialogs, sheets, and navigation

- Modal dialogs/sheets have names, focus management, escape/cancel behavior, and accessible action labels.
- Destructive confirmation defaults to safe/cancel where appropriate.
- Mobile bottom sheets have a full-screen or inline alternative when needed.
- Drawers and More navigation are reachable without a hover-only interaction.
- Back navigation preserves context and is understandable to screen readers.

## 9. Responsive and touch access

- Meet the approved mobile/tablet/desktop bands from the UX architecture.
- Primary mobile targets should be comfortably touchable; avoid tightly packed destructive controls.
- Gestures such as swipe/drag have visible menu/button alternatives.
- Large text, zoom, portrait/landscape, and long localized strings do not hide primary actions.
- Calendar content has an accessible list/agenda alternative to a dense grid.

## 10. Content and language

- Use clear product language: Task, Calendar Event, Scheduled Task, Habit Occurrence, Focus Session, and External Event remain distinguishable.
- Do not use health data to make judgmental or medical claims.
- Error, empty, loading, permission, offline, and success copy is concise and actionable.
- Avoid relying on abbreviations or icon meanings without explanation.
- Plan for localization, date/number formatting, and right-to-left considerations before hard-coding layout assumptions.

## 11. Testing requirements

Future implementation should include:

- automated semantic/accessible-name checks where useful;
- keyboard-only walkthroughs for all critical flows;
- screen-reader checks for Today, Quick Add, task completion, scheduling, Focus, dialogs, and errors;
- contrast/focus inspection;
- reduced-motion and zoom/large-text checks;
- mobile touch and responsive checks;
- manual validation with representative assistive technologies before release.

Automated checks supplement, not replace, manual usability testing.

## 12. Phase boundary

No accessible component, CSS token, test, UI, or application code was created.
