# Dayly Visual States

**Phase:** 1A — Visual Direction & Design Language
**Status:** Completed and reviewed
**Related documents:** [`VISUAL_DIRECTION.md`](VISUAL_DIRECTION.md), [`DESIGN_TOKENS.md`](DESIGN_TOKENS.md), [`MOTION_PRINCIPLES.md`](MOTION_PRINCIPLES.md), [`SCREEN_MAP.md`](SCREEN_MAP.md)

> This document defines the visual language for product states. It does not implement components, CSS, or application logic.

## 1. State principles

- A state must communicate what happened, what is true now, and what the user can do next.
- State is expressed through a combination of typography, surface, icon/shape, label, and action; never color alone.
- Loading is not an empty state. Empty is not an error. Offline is not necessarily failure of the source record.
- State changes should preserve context and avoid unexpected layout jumps.
- State emphasis is proportional: an integration warning should not overpower an active Focus session or primary task.
- State language remains consistent across Today, Tasks, Calendar, Habits, Focus, Analytics, Search, and Settings.
- Every state has keyboard, screen-reader, mobile, light-theme, and dark-theme behavior.

## 2. State vocabulary

| State | Meaning | Default visual priority |
|---|---|---:|
| **Loading** | The system is retrieving or processing data. | Low but visible; preserve orientation. |
| **Skeleton** | A layout-preserving loading treatment. | Structural, not content-like. |
| **Empty** | No records exist in the current scope. | Helpful, calm, action-oriented. |
| **First use** | The user has not formed the feature's first mental model. | Educational but minimal. |
| **Populated** | Normal content is available. | Primary hierarchy applies. |
| **Error** | A request/action failed. | Clear and recoverable; not alarmist. |
| **Offline** | Network-dependent freshness or save is unavailable. | Visible status, not a destructive warning. |
| **Success** | A requested action completed. | Brief confirmation; source view updates. |
| **Disabled** | An action is unavailable by state/permission/feature scope. | Explain why when not obvious. |
| **Selected** | An item/view is the current selection. | Persistent context cue. |
| **Focused** | Keyboard/input focus is on the control. | Highest interaction clarity. |
| **Hover** | Pointer is over a possible target. | Supplemental only; never required. |
| **Pressed** | The control is actively being invoked. | Immediate tactile/visual confirmation. |
| **Permission denied** | Access is not granted. | Source-aware recovery guidance. |
| **No results** | Query/filter returned no matches. | Reset/change-query guidance. |
| **Stale/partial** | Data is known but not fully current/complete. | Source and freshness visible. |

## 3. Loading and skeleton

### Visual treatment

- Preserve page title, current date, navigation, and primary action while data loads.
- Use simple low-contrast blocks that reflect expected layout without imitating private text in excessive detail.
- Prefer independent section loading on Today so one slow/optional section does not blank the whole page.
- Use a progress indicator for bounded saves/syncs and an indeterminate treatment only when duration is unknown.
- Avoid spinner-only screens for routine lists.

### Behavior

- Disable duplicate submission while a mutation is pending.
- Keep entered form values visible.
- Do not present zero metrics, empty-day language, or “no events” until loading completes.
- Announce meaningful busy state to assistive technology without repeatedly interrupting.

## 4. Empty and first-use states

### Empty

An empty state says what belongs here and presents one primary next action:

- Empty Tasks: Create Task or Quick Add.
- Empty Projects: Create Project and explain outcome containers.
- Empty Calendar: Create Event or Schedule Task.
- Empty Habits: Create Habit.
- Empty Focus: Start Focus.
- Empty Analytics: Explain what activity will produce useful evidence.
- Empty Search before query: Show examples, not a blank result table.

### First use

First-use treatment is lighter than a tour:

1. one sentence about the feature;
2. one visible primary action;
3. optional example or secondary link;
4. no requirement to configure integrations or advanced fields.

Today first use should guide the first Task and then get out of the way.

## 5. Populated state

- Apply the module-specific hierarchy from the UX and visual direction documents.
- Keep primary actions near the content they change.
- Show only properties useful to the current decision; detail views progressively disclose more.
- Use consistent row height/density within one list.
- Make source, ownership, and stale state visible when content is external or derived.
- Preserve scan order under responsive layout changes.

## 6. Error state

### Visual treatment

- Use a restrained danger semantic accent for the affected region, not a red page wash.
- Use an error icon/label and a plain-language message.
- Keep unaffected content and navigation usable where possible.
- Put Retry, Reconnect, Refresh, or Return actions next to the affected scope.
- Keep form input and unsaved values intact.

### Error categories

- Validation errors are local to fields and summarized for long forms.
- Authorization/permission errors identify the needed account/provider action.
- Database/server errors use a safe message and request ID.
- Integration errors show provider/source and freshness without payloads.
- Conflicts show what needs review without silently selecting a version.

## 7. Offline and stale state

- Use a small, persistent status indicator plus local source labels rather than an obstructive full-screen banner for ordinary offline viewing.
- Cached content is marked last-known/stale where that affects decisions.
- Pending/unsaved mutations are visually distinct from saved content.
- Do not show an external provider as “synced” while offline or before a successful operation.
- Keep Dayly-owned data usable when external context is unavailable.
- If an action cannot be saved, explain whether it is pending, preserved as a draft, or must be retried.

## 8. Success state

- Use a short confirmation near the source action.
- Update the source list/detail immediately after confirmed persistence.
- Offer Undo for reversible actions such as task completion/archive when supported.
- Do not celebrate every tap with large animation or sound.
- Completion of a Focus Session confirms actual duration and separately offers Task completion; it does not imply it.
- Integration connection success and initial sync success are separate confirmations.

## 9. Disabled state

Disabled controls:

- reduce emphasis without becoming illegible;
- include a reason when disabled behavior is not obvious;
- are not the only place where unavailable information is explained;
- do not appear interactive to keyboard/screen-reader users;
- remain distinguishable from loading and permission denied.

For future integrations, disabled provider actions should explain whether the provider is unsupported, disconnected, unauthorized, offline, or awaiting a later phase.

## 10. Selected, focused, hover, and pressed

### Selected

Use a subtle semantic surface, clear border/indicator, and text/icon emphasis. Selection persists across light/dark themes and does not rely on color alone. Calendar selected items retain source identity.

### Focused

Use a visible high-contrast focus ring with sufficient offset. Focus is stronger than hover and must remain visible at keyboard zoom/large text. Never remove the browser focus outline without replacing it.

### Hover

Hover may reveal a secondary affordance or surface change on pointer devices. It must not reveal the only action or source label. Touch and keyboard have equivalent alternatives.

### Pressed

Pressed feedback is immediate and brief. It should not imply the server mutation succeeded before the result is known. A pressed control returns to pending/success/error state explicitly.

## 11. Permission denied and consent states

- Use a lock/permission cue plus the affected source/provider label.
- Explain the minimum recovery: connect, reauthorize, choose a calendar/category, or return to core Dayly.
- Do not expose provider IDs or private source payloads.
- Keep unconnected Dayly features usable.
- Distinguish a user denial from a provider outage or a missing feature.

## 12. No-results state

No results should help the user change the query or scope:

- show the active query/filter;
- suggest clearing a restrictive filter or trying a related term;
- preserve the search field and keyboard/mobile focus;
- do not describe the entire Tasks/Projects/Habits domain as empty;
- offer Create Task only when it is a natural next action, not as a misleading search result.

## 13. Calendar-specific states

- **External event stale:** muted source label + last-known time + sync action.
- **Conflict:** distinct conflict marker/pattern + text action required; no silent merge.
- **Overlapping blocks:** layered/stacked geometry and accessible list order.
- **No availability:** neutral notice that capacity is unknown, not an error.
- **Current time:** visible line/marker with text alternative and time-zone context.
- **All-day:** separate date band treatment, not a zero-duration timed block.

## 14. Focus-specific states

| State | Visual treatment |
|---|---|
| Idle | Clear Start Focus action and optional Task/Project context. |
| Active | Dominant timer, quiet surrounding surface, associated Task secondary. |
| Paused | Timer remains visible with paused label and Resume primary action. |
| Interrupted | Actual duration/context retained; optional interruption note. |
| Completing | Bounded save state; prevent duplicate finish. |
| Completed | Actual duration review, source link, and separate Task completion choice. |
| Save error | Preserve timer/session result and show retry/persistence status. |

## 15. Accessibility state rules

- Every state has a text/semantic equivalent.
- Color/pattern/icon is never the only state signal.
- State changes are announced when relevant and not excessively.
- Focus is managed after dialogs, sheets, saves, errors, and list removal.
- Loading does not move focus unexpectedly.
- Reduced motion replaces animated transitions with immediate state changes.
- Large text and narrow viewports do not hide error/success/primary action content.

## 16. Phase boundary

No visual-state components, CSS, animations, or application code were created.
