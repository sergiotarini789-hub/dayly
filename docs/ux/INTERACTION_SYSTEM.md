# Dayly Interaction & Motion System

**Phase:** 1E — Interaction & Motion System
**Status:** In progress
**Scope:** generic UI only; placeholder content in `/showcase`

This document describes the implementation contract for interaction states, motion, presence, loading, feedback, overlays, navigation, and generic layout continuity. It is intentionally independent of Tasks, Calendar, Habits, Focus, Projects, analytics, authentication, persistence, APIs, and integrations.

## 1. Implementation map

| Concern | Implementation | Contract |
|---|---|---|
| Approved values | [`src/styles/tokens.css`](../../src/styles/tokens.css) | Use only `--duration-instant`, `--duration-fast`, `--duration-normal`, `--duration-slow`, approved easing, and motion-distance tokens. |
| Core control states | [`src/styles/components.css`](../../src/styles/components.css), [`src/components/ui/primitives.tsx`](../../src/components/ui/primitives.tsx) | Native semantics first; focus, press, disabled, loading, validation, selected, and busy states remain readable. |
| Presence and focus | [`src/components/ui/utils.ts`](../../src/components/ui/utils.ts) | `usePresence` keeps an exiting region mounted for its token duration, completes immediately under reduced motion, and exposes animation-end completion. |
| Overlays | [`src/components/ui/overlays.tsx`](../../src/components/ui/overlays.tsx) | Dialog, drawer/sheet, popover, menu, and scrim use token-based enter/exit; Escape and focus restoration are not animation-dependent. |
| Shell/navigation | [`src/styles/layout.css`](../../src/styles/layout.css), [`src/components/layout/responsive-navigation.tsx`](../../src/components/layout/responsive-navigation.tsx) | Active/collapse feedback is supplemental; responsive shell reflow stays instant; mobile More uses the accessible dialog surface. |
| List/detail continuity | [`src/components/layout/primitives.tsx`](../../src/components/layout/primitives.tsx), [`src/styles/layout.css`](../../src/styles/layout.css) | `MotionList`, `MotionListItem`, and `MasterDetail` are generic and opt-in. |
| Showcase | [`src/showcase/ComponentShowcase.tsx`](../../src/showcase/ComponentShowcase.tsx), [`src/showcase/LayoutShowcase.tsx`](../../src/showcase/LayoutShowcase.tsx) | Every pattern is placeholder-only and available at `/showcase`. |

## 2. State model

The system distinguishes these states instead of using motion as a proxy:

- **idle/populated:** normal readable content and available actions;
- **hover:** pointer-only supplemental emphasis;
- **focus-visible:** keyboard/assistive navigation cue that is immediate and persistent;
- **pressed:** direct input acknowledgment, not a persistence result;
- **selected/active:** persistent current context, visible without motion;
- **disabled:** unavailable control, not focusable and not confused with loading;
- **loading/busy:** work in progress, layout-preserving and announced semantically where useful;
- **empty:** no content in scope, with a useful next action;
- **error:** affected scope, explanation, and retry/recovery path;
- **success:** concise source-adjacent confirmation;
- **exiting:** a temporary visual presence state only; it is `aria-hidden`, non-interactive, and removed after the approved duration or immediately for reduced motion.

State meaning always exists in text, structure, semantics, or persistent styling. Motion may reinforce it, but never carries it alone.

## 3. Control patterns

### Buttons and icon buttons

`Button` and `IconButton` use `:hover` only as supplemental surface feedback, immediate `:active` feedback, and the global tokenized focus ring. Loading sets `disabled` and `aria-busy` while retaining the accessible name and content footprint; the spinner is absolutely positioned so the button does not collapse or remeasure. Disabled controls stay readable and are visually distinct from loading.

Use a visible label for ordinary actions. Icon-only actions require an accessible label; a tooltip may supplement it but cannot be its only accessible name.

### Inputs and fields

`Input`, `Textarea`, `Select`, and `Combobox` retain labels, descriptions, entered values, and messages. Focus changes border/ring without reducing text contrast. Error uses `aria-invalid` and an adjacent alert message; success is not conveyed by color alone because the message remains present. Disabled controls use native `disabled` semantics. Loading select/input states preserve the field position and use `aria-busy`.

### Checkbox, radio, switch, tabs, select

Native checkbox, radio, switch, and select semantics are preserved. Their visual marks and tracks transition with `--duration-fast` and `--ease-standard`; focus-visible outlines are immediate. Tabs expose tab semantics and selected state without requiring an animated indicator. Select uses the platform control so keyboard, touch, and assistive technology behavior remain reliable.

There is no domain-specific segmented control in PHASE 1E. If one is added later, it must follow the same selected/focus/disabled contract and approved tokens.

## 4. Presence and overlays

`usePresence(open, durationToken)` is the small generic presence helper used by overlay primitives. It returns:

- `present`, controlling whether the region is mounted;
- `state`, either `open` or `closed`, for CSS entry/exit selectors;
- `onAnimationEnd`, which safely completes an exit when the direct region animation ends.

A timeout fallback prevents a missing CSS event from leaving an exiting region mounted. The duration is read from the approved CSS token. Under reduced motion, the region is removed immediately.

Dialog and drawer/sheet behavior:

1. trigger focus is retained before opening;
2. focus moves into the dialog scope;
3. Tab is contained while open;
4. visible close and scrim controls remain available;
5. Escape is handled immediately through both container and document-level handling;
6. focus returns to the trigger as soon as the open state closes, not after a decorative animation;
7. the exiting region is hidden and non-interactive while it finishes its visual exit.

Popover and menu behavior follows the same presence and focus-restoration model. Menu arrow/Home/End navigation remains synchronous. Toasts are non-blocking and use live-region semantics; their action and dismissal do not depend on animation.

## 5. Navigation and responsive behavior

Desktop navigation exposes active destination with `aria-current`, selected surface, and text/icon emphasis. Collapse/expand is an explicit button with an accessible name and `aria-expanded`; compact navigation uses labels/tooltips that do not remove access to the destination. Pointer hover is not required.

The mobile bottom navigation has large touch targets and the More destination opens the generic dialog surface. Opening/closing the More surface retains Escape and focus restoration. The shell does not animate breakpoint-driven sidebar hiding, column stacking, bottom navigation insertion, safe-area padding, or grid geometry: those changes are structural and remain instant.

## 6. List, selection, and master/detail patterns

`MotionList` and `MotionListItem` provide an opt-in hook for bounded generic collections:

```tsx
<MotionList label="Example items">
  <MotionListItem motionState="enter" selected>
    Placeholder item
  </MotionListItem>
</MotionList>
```

`enter`, `exit`, and `move` are visual hints only. A consumer must update the collection and accessible selection state synchronously; it must not wait for animation to commit a change. Animate only affected items, avoid animating long lists, and provide an immediate state equivalent for reduced motion.

`MasterDetail` keeps a stable list region and a related detail region on desktop. On narrow screens it stacks the detail below the list. The detail entrance is short and local when the detail is mounted; responsive stacking itself is instant. A consumer must manage selection and navigation semantics separately from motion.

## 7. Loading, inline feedback, and retries

- **Spinner:** short indeterminate work; use a readable label or `aria-busy` context.
- **Skeleton:** layout-preserving placeholder; no content-like private data and no shimmer under reduced motion.
- **Inline loading:** keep the source control/region in place; do not replace it with an empty gap.
- **Button loading:** preserve label footprint, disable duplicate invocation, and expose busy state.
- **Success:** source-adjacent text or status, with optional non-blocking toast.
- **Error:** affected scope, plain-language explanation, and visible Retry or another recovery action.
- **Toast:** brief live feedback, never the only record of an important error.
- **Empty:** distinct from loading and error; explain what the placeholder scope means.

## 8. Reduced-motion contract

The contract is mandatory, not an enhancement. The CSS layer disables spinner/progress/skeleton and overlay/list/detail decorative animation and turns off smooth scrolling. The token layer collapses motion distances and durations. The presence helper completes exits immediately when `matchMedia('(prefers-reduced-motion: reduce)')` matches.

Opacity, border, text, and semantic state changes may remain when they improve clarity. Focus, Escape, keyboard navigation, touch targets, live status, and focus restoration are unchanged.

## 9. Verification checklist

For a new generic interaction pattern, verify:

- keyboard operation and visible focus;
- native or correct ARIA semantics;
- immediate Escape and focus restoration for a layer;
- no hover-only action;
- layout remains stable while loading;
- disabled is distinct from loading, empty, error, and success;
- light and dark themes retain contrast;
- touch-sized targets and safe-area shell behavior remain intact;
- reduced-motion removes decorative/continuous movement;
- tests assert state and semantics rather than animation timing or pixel coordinates.

PHASE 1E stops at generic interaction/motion foundations. PHASE 1F composes them into a bounded frontend-only onboarding and Today preview; persistence, remote product workflows, and PHASE 1G remain out of scope.
